import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy endpoint for TikTok avatar images to bypass referrer/CORS restrictions
app.get('/api/proxy-image', async (req: Request, res: Response) => {
  const imageUrl = req.query.url as string;
  if (!imageUrl) {
    res.status(400).send('Missing url parameter');
    return;
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      res.status(response.status).send('Failed to fetch image');
      return;
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).send('Internal server error');
  }
});

// TikTok User Profile Fetcher
app.get('/api/tiktok-user', async (req: Request, res: Response) => {
  const rawUsername = (req.query.username as string) || '';
  const username = rawUsername.trim().replace(/^@/, '');

  if (!username) {
    res.status(400).json({ success: false, error: 'Username is required' });
    return;
  }

  try {
    const targetUrl = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: `TikTok returned status ${response.status}`,
      });
      return;
    }

    const html = await response.text();

    // Strategy 1: Look for __UNIVERSAL_DATA_FOR_REHYDRATION__
    const rehydrationMatch = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (rehydrationMatch && rehydrationMatch[1]) {
      try {
        const json = JSON.parse(rehydrationMatch[1]);
        const defaultScope = json['__DEFAULT_SCOPE__'];
        const userInfo =
          defaultScope && defaultScope['webapp.user-detail']?.userInfo;

        if (userInfo && userInfo.user) {
          const user = userInfo.user;
          const stats = userInfo.stats || {};
          const avatarRaw =
            user.avatarLarger || user.avatarMedium || user.avatarThumb;

          const avatarUrl = avatarRaw
            ? `/api/proxy-image?url=${encodeURIComponent(avatarRaw)}`
            : null;

          res.json({
            success: true,
            user: {
              nickname: user.nickname || username,
              uniqueId: user.uniqueId || username,
              avatarUrl,
              avatarRaw,
              followerCount: stats.followerCount || 0,
              verified: user.verified || false,
            },
          });
          return;
        }
      } catch (parseErr) {
        console.warn('Could not parse rehydration JSON:', parseErr);
      }
    }

    // Strategy 2: Look for Open Graph and meta tags
    const ogImageMatch =
      html.match(/<meta property="og:image" content="([^"]+)"/) ||
      html.match(/<meta name="twitter:image" content="([^"]+)"/);

    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);

    if (ogImageMatch && ogImageMatch[1]) {
      const avatarRaw = ogImageMatch[1];
      const avatarUrl = `/api/proxy-image?url=${encodeURIComponent(avatarRaw)}`;
      let nickname = username;
      if (ogTitleMatch && ogTitleMatch[1]) {
        nickname = ogTitleMatch[1].split('(')[0].trim() || username;
      }

      res.json({
        success: true,
        user: {
          nickname,
          uniqueId: username,
          avatarUrl,
          avatarRaw,
          followerCount: 0,
          verified: false,
        },
      });
      return;
    }

    res.status(404).json({
      success: false,
      error: 'User profile data could not be found on TikTok',
    });
  } catch (error: any) {
    console.error('Error fetching TikTok profile:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch TikTok user profile',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
