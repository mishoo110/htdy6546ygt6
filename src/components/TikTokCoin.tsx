import React from 'react';

interface TikTokCoinProps {
  className?: string;
  size?: number;
}

export const TikTokCoin: React.FC<TikTokCoinProps> = ({
  className = '',
  size = 20,
}) => {
  return (
    <img
      src="/assets/aistudio/image_64198e3a.png"
      alt="TikTok Coin"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-block shrink-0 object-contain select-none ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};
