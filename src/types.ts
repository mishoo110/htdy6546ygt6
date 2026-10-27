export type ScreenId = 1 | 2 | 3 | 4 | 5;

export interface AppConfig {
  userDisplayName: string;
  userHandle: string;
  userAvatarUrl?: string;
  totalBalanceUsd: string;
  totalCoinsBalance: string;
  searchUserHandle: string;
  recipientHandle: string;
  recipientNickname?: string;
  recipientAvatarUrl?: string;
  followersCount: string;
  exchangeCoins: string;
  exchangeAmountUsd: string;
  transactionTime: string;
  customKeypadValue: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  priceUsd: number;
  coinsLabel: string;
  priceLabel: string;
}
