import { useState, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame.tsx';
import { Screen1Exchange } from './components/Screen1Exchange.tsx';
import { Screen2Custom } from './components/Screen2Custom.tsx';
import { Screen3Confirm } from './components/Screen3Confirm.tsx';
import { Screen4Loading } from './components/Screen4Loading.tsx';
import { Screen5Completed } from './components/Screen5Completed.tsx';
import { CustomizeDrawer } from './components/CustomizeDrawer.tsx';
import { ScreenId, AppConfig } from './types.ts';

const BASE_BALANCE_USD = 978393139.26;
const BASE_COINS_BALANCE = 80858937129;

const DEFAULT_CONFIG: AppConfig = {
  userDisplayName: 'emirates095',
  userHandle: '@emirates095',
  totalBalanceUsd: '$978,393,139.26',
  totalCoinsBalance: '80,858,937,129',
  searchUserHandle: '@yb.j83',
  recipientHandle: '@kwooo22',
  followersCount: '—',
  exchangeCoins: '100,000',
  exchangeAmountUsd: '$1210.00',
  transactionTime: '27/10/2026, 11:31:01',
  customKeypadValue: '100000',
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(1);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  // Numeric tracking for smooth gradual balance countdowns and proportional updates
  const [currentUsdNumber, setCurrentUsdNumber] = useState<number>(BASE_BALANCE_USD);
  const [currentCoinsNumber, setCurrentCoinsNumber] = useState<number>(BASE_COINS_BALANCE);
  const [pendingDeduction, setPendingDeduction] = useState<{ coins: number; usd: number }>({
    coins: 100000,
    usd: 1210,
  });

  // Keyboard shortcut (keys 1-5 to quickly jump between screens)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        setActiveScreen(Number(e.key) as ScreenId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When custom coins are entered in Screen 2
  const handleCustomConfirm = (coinsFormatted: string, rawCoins: number, rawUsd: number) => {
    setPendingDeduction({ coins: rawCoins, usd: rawUsd });
    setConfig((prev) => ({
      ...prev,
      exchangeCoins: coinsFormatted || rawCoins.toLocaleString('en-US'),
      exchangeAmountUsd: `$${rawUsd.toFixed(2)}`,
    }));
    setActiveScreen(3);
  };

  // When a package is chosen in Screen 1
  const handlePackExchange = (coins: string, price: string, rawCoins: number, rawPrice: number) => {
    setPendingDeduction({ coins: rawCoins, usd: rawPrice });
    setConfig((prev) => ({
      ...prev,
      exchangeCoins: coins,
      exchangeAmountUsd: price,
    }));
    setActiveScreen(3);
  };

  // Called when Screen 4 gradual countdown finishes
  const handleFinishedExchanging = () => {
    const finalUsd = Math.max(0, currentUsdNumber - pendingDeduction.usd);
    const finalCoins = Math.max(0, currentCoinsNumber - pendingDeduction.coins);
    setCurrentUsdNumber(finalUsd);
    setCurrentCoinsNumber(finalCoins);
    setConfig((prev) => ({
      ...prev,
      totalBalanceUsd: `$${finalUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      totalCoinsBalance: finalCoins.toLocaleString('en-US'),
    }));
    setActiveScreen(5);
  };

  // Called when user clicks on money/balance to edit with proportional update
  const handleBalanceChange = (
    formattedUsd: string,
    formattedCoins: string,
    rawUsd: number,
    rawCoins: number
  ) => {
    setCurrentUsdNumber(rawUsd);
    setCurrentCoinsNumber(rawCoins);
    setConfig((prev) => ({
      ...prev,
      totalBalanceUsd: formattedUsd,
      totalCoinsBalance: formattedCoins,
    }));
  };

  const handleResetDefaults = () => {
    setCurrentUsdNumber(BASE_BALANCE_USD);
    setCurrentCoinsNumber(BASE_COINS_BALANCE);
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none">
      <main className="flex-1 w-full flex flex-col items-center justify-start sm:justify-center p-0">
        <PhoneFrame>
          {activeScreen === 1 && (
            <Screen1Exchange
              config={config}
              onOpenCustom={() => setActiveScreen(2)}
              onExchangeClick={handlePackExchange}
              onBalanceChange={handleBalanceChange}
              onSearchChange={(val) =>
                setConfig((prev) => ({ ...prev, searchUserHandle: val }))
              }
              onUpdateSenderProfile={(user) => {
                setConfig((prev) => ({
                  ...prev,
                  userDisplayName: user.name,
                  userHandle: user.handle,
                  userAvatarUrl: user.avatarUrl,
                }));
              }}
              onUpdateRecipientProfile={(user) => {
                setConfig((prev) => ({
                  ...prev,
                  recipientHandle: user.handle,
                  recipientNickname: user.nickname,
                  recipientAvatarUrl: user.avatarUrl,
                  followersCount: user.followers || prev.followersCount,
                }));
              }}
            />
          )}

          {activeScreen === 2 && (
            <Screen2Custom
              config={config}
              onClose={() => setActiveScreen(1)}
              onConfirmAmount={handleCustomConfirm}
            />
          )}

          {activeScreen === 3 && (
            <Screen3Confirm
              config={config}
              onConfirm={() => setActiveScreen(4)}
              onCancel={() => setActiveScreen(1)}
            />
          )}

          {activeScreen === 4 && (
            <Screen4Loading
              config={config}
              startUsd={currentUsdNumber}
              targetUsd={Math.max(0, currentUsdNumber - pendingDeduction.usd)}
              startCoins={currentCoinsNumber}
              targetCoins={Math.max(0, currentCoinsNumber - pendingDeduction.coins)}
              onFinishedLoading={handleFinishedExchanging}
            />
          )}

          {activeScreen === 5 && (
            <Screen5Completed
              config={config}
              onGoBack={() => setActiveScreen(1)}
            />
          )}
        </PhoneFrame>
      </main>

      {/* Customize Data Drawer */}
      <CustomizeDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onChangeConfig={setConfig}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
