import React, { useState } from 'react';
import { X, Minus, Loader2, Check, UserCircle2 } from 'lucide-react';
import { TikTokCoin } from './TikTokCoin.tsx';
import { AppConfig } from '../types.ts';
import { fetchTikTokUser } from '../utils/tiktokApi.ts';

interface Screen1ExchangeProps {
  config: AppConfig;
  onOpenCustom: () => void;
  onExchangeClick: (coins: string, price: string, rawCoins: number, rawPrice: number) => void;
  onBalanceChange?: (formattedUsd: string, formattedCoins: string, rawUsd: number, rawCoins: number) => void;
  onSearchChange?: (val: string) => void;
  onUpdateSenderProfile?: (user: { name: string; handle: string; avatarUrl?: string }) => void;
  onUpdateRecipientProfile?: (user: {
    handle: string;
    nickname?: string;
    avatarUrl?: string;
    followers?: string;
  }) => void;
}

export const Screen1Exchange: React.FC<Screen1ExchangeProps> = ({
  config,
  onOpenCustom,
  onExchangeClick,
  onBalanceChange,
  onSearchChange,
  onUpdateSenderProfile,
  onUpdateRecipientProfile,
}) => {
  const [selectedPack, setSelectedPack] = useState<number>(0);
  const [searchVal, setSearchVal] = useState(config.searchUserHandle);
  const [isSearchingRecipient, setIsSearchingRecipient] = useState(false);
  const [recipientSearchResult, setRecipientSearchResult] = useState<{
    found: boolean;
    name?: string;
    avatar?: string;
    followers?: string;
  } | null>(null);

  // Click-to-edit balance state
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [editUsdInput, setEditUsdInput] = useState('');

  // Sender modal state
  const [isSenderModalOpen, setIsSenderModalOpen] = useState(false);
  const [senderInputVal, setSenderInputVal] = useState(config.userHandle);
  const [isFetchingSender, setIsFetchingSender] = useState(false);
  const [senderError, setSenderError] = useState<string | null>(null);

  const packs = [
    { coins: '250', price: '$3.03', rawCoins: 250, rawPrice: 3.03 },
    { coins: '500', price: '$6.07', rawCoins: 500, rawPrice: 6.07 },
    { coins: '15,000', price: '$182.04', rawCoins: 15000, rawPrice: 182.04 },
  ];

  const startEditingBalance = () => {
    const raw = config.totalBalanceUsd.replace(/[^0-9.]/g, '');
    setEditUsdInput(raw);
    setIsEditingBalance(true);
  };

  const handleBalanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setEditUsdInput(raw);
    const numUsd = parseFloat(raw);
    if (!isNaN(numUsd) && numUsd >= 0) {
      // Proportional ratio based on original screenshot numbers:
      // 80,858,937,129 / 978,393,139.26 = 82.64463054174092
      const propCoins = Math.round(numUsd * (80858937129 / 978393139.26));
      const formattedUsd = `$${numUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      const formattedCoins = propCoins.toLocaleString('en-US');
      if (onBalanceChange) {
        onBalanceChange(formattedUsd, formattedCoins, numUsd, propCoins);
      }
    }
  };

  const finishEditingBalance = () => {
    setIsEditingBalance(false);
  };

  // Fetch recipient TikTok profile
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = searchVal.trim().replace(/^@/, '');
    if (!cleanUsername) return;

    setIsSearchingRecipient(true);
    setRecipientSearchResult(null);

    const result = await fetchTikTokUser(cleanUsername);
    setIsSearchingRecipient(false);

    if (result.success && result.user) {
      const followersFormatted =
        result.user.followerCount > 1000000
          ? `${(result.user.followerCount / 1000000).toFixed(1)}M`
          : result.user.followerCount > 1000
          ? `${(result.user.followerCount / 1000).toFixed(1)}K`
          : String(result.user.followerCount || '—');

      setRecipientSearchResult({
        found: true,
        name: result.user.nickname,
        avatar: result.user.avatarUrl,
        followers: followersFormatted,
      });

      if (onUpdateRecipientProfile) {
        onUpdateRecipientProfile({
          handle: `@${result.user.uniqueId}`,
          nickname: result.user.nickname,
          avatarUrl: result.user.avatarUrl,
          followers: followersFormatted,
        });
      }
    } else {
      setRecipientSearchResult({
        found: false,
      });
      if (onUpdateRecipientProfile) {
        onUpdateRecipientProfile({
          handle: `@${cleanUsername}`,
          followers: '—',
        });
      }
    }

    if (onSearchChange) {
      onSearchChange(cleanUsername);
    }
  };

  // Fetch sender TikTok profile
  const handleFetchSenderProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = senderInputVal.trim().replace(/^@/, '');
    if (!clean) return;

    setIsFetchingSender(true);
    setSenderError(null);

    const result = await fetchTikTokUser(clean);
    setIsFetchingSender(false);

    if (result.success && result.user) {
      if (onUpdateSenderProfile) {
        onUpdateSenderProfile({
          name: result.user.nickname,
          handle: `@${result.user.uniqueId}`,
          avatarUrl: result.user.avatarUrl,
        });
      }
      setIsSenderModalOpen(false);
    } else {
      setSenderError(result.error || 'لم يتم العثور على الحساب في تيك توك');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-2 pb-4 bg-white text-slate-900 relative">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between py-1 mb-5">
          {/* Left: Close & line */}
          <div className="flex items-center gap-2 text-slate-800">
            <button
              type="button"
              className="p-1 -ml-1 text-slate-800 hover:text-black cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              className="p-1 text-slate-800 hover:text-black cursor-pointer"
              title="Minimize"
            >
              <Minus className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Center: Exchange with indicator dot */}
          <div className="flex items-center gap-1.5 ml-4">
            <span className="font-bold text-[17px] text-slate-900">Exchange</span>
            <span className="w-2 h-2 rounded-full bg-[#9CA3AF] opacity-90 inline-block" />
          </div>

          {/* Right: User identity (Focused Element 1) - Clickable to fetch sender TikTok profile */}
          <button
            type="button"
            onClick={() => setIsSenderModalOpen(true)}
            className="flex items-center gap-2.5 text-left cursor-pointer group p-1 -mr-1 rounded-xl hover:bg-slate-50 transition-colors"
            title="اضغط لتغيير الحساب وجلب صورته من تيك توك"
          >
            <div className="text-right flex flex-col">
              <span className="font-bold text-[13px] leading-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                {config.userDisplayName}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                @{config.userHandle.replace(/^@/, '')}
              </span>
            </div>
            {/* User avatar: uses fetched TikTok avatar if available, or default gray circle */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D1D5DB] shrink-0 border border-slate-200 flex items-center justify-center relative group-hover:ring-2 group-hover:ring-rose-400 transition-all">
              {config.userAvatarUrl ? (
                <img
                  src={config.userAvatarUrl}
                  alt={config.userDisplayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#D1D5DB]" />
              )}
            </div>
          </button>
        </div>

        {/* Balance Section */}
        <div className="text-center mt-3">
          <p className="text-[15px] font-semibold text-slate-900">
            TikTok Coins Balance
          </p>
          {isEditingBalance ? (
            <div className="flex items-center justify-center my-1">
              <span className="text-[28px] font-black text-slate-950">$</span>
              <input
                type="text"
                value={editUsdInput}
                onChange={handleBalanceInputChange}
                onBlur={finishEditingBalance}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishEditingBalance();
                }}
                autoFocus
                className="text-[30px] font-black text-slate-950 tracking-tight text-center max-w-[270px] outline-hidden bg-transparent border-b-2 border-[#FE2C55] tabular-nums"
                placeholder="0.00"
              />
            </div>
          ) : (
            <h1
              onClick={startEditingBalance}
              title="اضغط لتغيير الرصيد مع تناسق العملات"
              className="text-[34px] font-black text-slate-950 tracking-tight mt-0.5 mb-1 tabular-nums cursor-pointer hover:opacity-80 transition-opacity"
            >
              {config.totalBalanceUsd}
            </h1>
          )}
          <div
            onClick={startEditingBalance}
            className="flex items-center justify-center gap-1 text-[13px] text-slate-800 font-medium tabular-nums flex-wrap cursor-pointer"
            title="اضغط لتغيير الرصيد"
          >
            <span>=</span>
            <span className="text-[#E62A50] font-semibold">{config.totalBalanceUsd}</span>
            <span>(</span>
            <TikTokCoin size={15} className="mx-0.5" />
            <span>{config.totalCoinsBalance})</span>
          </div>
          <p className="text-[12px] text-slate-400 mt-1">
            Available balance to exchange the Coins
          </p>
        </div>

        {/* Target TikTok Username Input (Focused Element 2) */}
        <div className="mt-6">
          <label className="block text-[15px] font-bold text-slate-900 mb-2">
            TikTok username
          </label>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Show fetched TikTok avatar inside input if found */}
              {recipientSearchResult?.avatar || config.recipientAvatarUrl ? (
                <img
                  src={recipientSearchResult?.avatar || config.recipientAvatarUrl}
                  alt="Recipient"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <span className="text-slate-400 text-[14px]">@</span>
              )}
              <input
                type="text"
                value={searchVal.replace(/^@/, '')}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full text-[16px] sm:text-[14px] text-slate-900 outline-none border-none focus:outline-none focus:ring-0 font-medium bg-transparent"
                placeholder="yb.j83"
              />
            </div>

            <button
              type="submit"
              disabled={isSearchingRecipient}
              className="text-[#E62A50] hover:text-[#FE2C55] font-semibold text-[14px] px-1.5 py-1 rounded cursor-pointer transition-colors shrink-0 flex items-center gap-1"
            >
              {isSearchingRecipient ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E62A50]" />
              ) : (
                <span>Search</span>
              )}
            </button>
          </form>

          {/* Real-time TikTok User Preview Card after search */}
          {recipientSearchResult?.found && (
            <div className="mt-2 p-2 bg-rose-50/60 border border-rose-200/80 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={recipientSearchResult.avatar}
                  alt={recipientSearchResult.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-rose-300 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {recipientSearchResult.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {recipientSearchResult.followers} followers
                  </p>
                </div>
              </div>
            </div>
          )}

          {recipientSearchResult && !recipientSearchResult.found && (
            <p className="text-[12px] text-[#FE2C55] font-medium mt-1.5 px-1 animate-in fade-in duration-150" dir="rtl">
              عذرا المستخدم حسابه خاص ولا يستقبل
            </p>
          )}
        </div>

        {/* Exchange earnings for Coins */}
        <div className="mt-5">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">
            Exchange earnings for Coins
          </h2>

          {/* 3 Package Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {packs.map((pack, index) => {
              const isSelected = selectedPack === index;
              return (
                <button
                  key={pack.coins}
                  type="button"
                  onClick={() => setSelectedPack(index)}
                  className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? 'border-2 border-[#E62A50] shadow-xs'
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="mb-2">
                    <TikTokCoin size={24} />
                  </div>
                  <span className="text-[16px] font-bold text-slate-950 tabular-nums">
                    {pack.coins}
                  </span>
                  <span className="text-[12px] text-slate-400 mt-0.5 tabular-nums">
                    {pack.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom amount trigger */}
          <button
            type="button"
            onClick={onOpenCustom}
            className="text-[13px] text-slate-400 hover:text-slate-600 font-normal mt-3 text-left w-full cursor-pointer transition-colors block"
          >
            Enter a custom number or amount
          </button>
        </div>

        {/* Policy disclaimer */}
        <div className="mt-5 text-[11px] text-slate-400 leading-relaxed">
          <p>
            Coins obtained through this exchange are subject to the TikTok{' '}
            <span className="text-[#E62A50] font-medium hover:underline cursor-pointer">
              Virtual Items Policy
            </span>
            . Since you are accepting your Rewards in the form of Coins, this exchange is
            also subject to our{' '}
            <span className="text-[#E62A50] font-medium hover:underline cursor-pointer">
              Rewards Policy
            </span>
            . This exchange cannot be canceled or reversed.
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            const pack = packs[selectedPack];
            onExchangeClick(pack.coins, pack.price, pack.rawCoins, pack.rawPrice);
          }}
          className="w-full bg-[#FE2C55] hover:bg-[#E62A50] text-white font-semibold text-[15px] py-3.5 rounded-lg text-center cursor-pointer active:scale-[0.99] transition-all shadow-xs"
        >
          Exchange
        </button>
      </div>

      {/* Modal to change Sender profile & fetch from TikTok */}
      {isSenderModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <UserCircle2 className="w-4 h-4 text-rose-500" />
                <span>جلب صورة الحساب من تيك توك</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSenderModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3" dir="rtl">
              اكتب يوزر حسابك على تيك توك لجلب صورتك الحقيقية واسمك فورياً:
            </p>

            <form onSubmit={handleFetchSenderProfile} className="space-y-3">
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 focus-within:border-rose-500">
                <span className="text-slate-400 text-sm">@</span>
                <input
                  type="text"
                  value={senderInputVal.replace(/^@/, '')}
                  onChange={(e) => setSenderInputVal(e.target.value)}
                  placeholder="emirates095"
                  className="w-full text-sm outline-hidden font-medium ml-1 bg-transparent text-slate-900"
                  autoFocus
                />
              </div>

              {senderError && (
                <p className="text-[11px] text-rose-600 font-medium">
                  {senderError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSenderModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isFetchingSender}
                  className="px-4 py-1.5 bg-[#FE2C55] hover:bg-[#E62A50] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isFetchingSender ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>جلب الصورة والاسم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
