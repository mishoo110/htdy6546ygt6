import React from 'react';
import { X, RotateCcw, Sliders, Check } from 'lucide-react';
import { AppConfig } from '../types.ts';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onChangeConfig: (newConfig: AppConfig) => void;
  onResetDefaults: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof AppConfig, value: string) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formatted = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    handleChange('transactionTime', formatted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Sliders className="w-4 h-4 text-rose-500" />
            <span>Customize Screen Data & Defaults</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-800">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            Customize any data field below to see live updates across all 5 screens. All defaults precisely match the uploaded reference screenshots.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Display Name
              </label>
              <input
                type="text"
                value={config.userDisplayName}
                onChange={(e) => handleChange('userDisplayName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden"
                placeholder="emirates095"
              />
            </div>

            {/* Sender Handle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Account Handle
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch(`/api/tiktok-user?username=${encodeURIComponent(config.userHandle.replace(/^@/, ''))}`);
                    const data = await res.json();
                    if (data.success && data.user) {
                      onChangeConfig({
                        ...config,
                        userDisplayName: data.user.nickname,
                        userHandle: `@${data.user.uniqueId}`,
                        userAvatarUrl: data.user.avatarUrl,
                      });
                    }
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  جلب الصورة من تيك توك
                </button>
              </div>
              <input
                type="text"
                value={config.userHandle}
                onChange={(e) => handleChange('userHandle', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden"
                placeholder="@emirates095"
              />
            </div>

            {/* Total Balance USD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Balance (USD)
              </label>
              <input
                type="text"
                value={config.totalBalanceUsd}
                onChange={(e) => handleChange('totalBalanceUsd', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden tabular-nums"
                placeholder="$978,393,139.26"
              />
            </div>

            {/* Total Coins Balance */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Coins Count
              </label>
              <input
                type="text"
                value={config.totalCoinsBalance}
                onChange={(e) => handleChange('totalCoinsBalance', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden tabular-nums"
                placeholder="80,858,937,129"
              />
            </div>

            {/* Target Search Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Screen 1 Search Username
              </label>
              <input
                type="text"
                value={config.searchUserHandle}
                onChange={(e) => handleChange('searchUserHandle', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden"
                placeholder="@yb.j83"
              />
            </div>

            {/* Confirmation Recipient Handle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Confirmation & Receipt Recipient
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch(`/api/tiktok-user?username=${encodeURIComponent(config.recipientHandle.replace(/^@/, ''))}`);
                    const data = await res.json();
                    if (data.success && data.user) {
                      const followersFormatted =
                        data.user.followerCount > 1000000
                          ? `${(data.user.followerCount / 1000000).toFixed(1)}M`
                          : data.user.followerCount > 1000
                          ? `${(data.user.followerCount / 1000).toFixed(1)}K`
                          : String(data.user.followerCount || '—');

                      onChangeConfig({
                        ...config,
                        recipientHandle: `@${data.user.uniqueId}`,
                        recipientNickname: data.user.nickname,
                        recipientAvatarUrl: data.user.avatarUrl,
                        followersCount: followersFormatted,
                      });
                    }
                  }}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  جلب الصورة من تيك توك
                </button>
              </div>
              <input
                type="text"
                value={config.recipientHandle}
                onChange={(e) => handleChange('recipientHandle', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden"
                placeholder="@kwooo22"
              />
            </div>

            {/* Exchange Coins */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exchanged Coins Count
              </label>
              <input
                type="text"
                value={config.exchangeCoins}
                onChange={(e) => handleChange('exchangeCoins', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden tabular-nums"
                placeholder="100,000"
              />
            </div>

            {/* Deducted Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deducted Amount (USD)
              </label>
              <input
                type="text"
                value={config.exchangeAmountUsd}
                onChange={(e) => handleChange('exchangeAmountUsd', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden tabular-nums"
                placeholder="$1210.00"
              />
            </div>
          </div>

          {/* Transaction Time */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Receipt Transaction Time
              </label>
              <button
                type="button"
                onClick={handleSetCurrentTime}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Set to current time
              </button>
            </div>
            <input
              type="text"
              value={config.transactionTime}
              onChange={(e) => handleChange('transactionTime', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-rose-500 outline-hidden tabular-nums"
              placeholder="27/10/2026, 11:31:01"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Screenshots Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
