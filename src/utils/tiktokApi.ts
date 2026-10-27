export interface TikTokUserData {
  nickname: string;
  uniqueId: string;
  avatarUrl: string;
  avatarRaw: string;
  followerCount: number;
  verified: boolean;
}

export async function fetchTikTokUser(
  username: string
): Promise<{ success: boolean; user?: TikTokUserData; error?: string }> {
  const clean = username.trim().replace(/^@/, '');
  if (!clean) {
    return { success: false, error: 'Please enter a username' };
  }

  try {
    const res = await fetch(`/api/tiktok-user?username=${encodeURIComponent(clean)}`);
    const data = await res.json();
    if (data.success && data.user) {
      return { success: true, user: data.user };
    }
    return {
      success: false,
      error: data.error || 'User not found on TikTok',
    };
  } catch (err: any) {
    console.error('Error fetching TikTok user:', err);
    return {
      success: false,
      error: err.message || 'Network error fetching TikTok profile',
    };
  }
}
