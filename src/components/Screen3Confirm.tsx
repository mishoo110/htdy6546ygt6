import React from 'react';
import { TikTokCoin } from './TikTokCoin.tsx';
import { AppConfig } from '../types.ts';

interface Screen3ConfirmProps {
  config: AppConfig;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Screen3Confirm: React.FC<Screen3ConfirmProps> = ({
  config,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-5 bg-black/35 backdrop-blur-[2px]">
      {/* Background Dimmed Fake Screen 1 */}
      <div className="absolute inset-0 pointer-events-none opacity-25 blur-xs overflow-hidden px-5 pt-3">
        <div className="flex items-center justify-between text-slate-900 py-1">
          <span className="font-bold">Exchange</span>
          <div className="w-8 h-8 rounded-full bg-slate-300" />
        </div>
        <div className="text-center mt-5">
          <p className="text-sm">TikTok Coins Balance</p>
          <p className="text-2xl font-bold">{config.totalBalanceUsd}</p>
        </div>
      </div>

      {/* Confirmation Dialog Card */}
      <div className="relative z-10 w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-[18px] font-bold text-slate-950 text-center mb-6">
          Exchange Confirmation
        </h2>

        {/* Details Table */}
        <div className="space-y-4 mb-7 text-[14px]">
          {/* TikTok Account */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">TikTok Account</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-950">
              {config.recipientAvatarUrl && (
                <img
                  src={config.recipientAvatarUrl}
                  alt={config.recipientHandle}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-slate-200"
                />
              )}
              <span>@{config.recipientHandle.replace(/^@/, '')}</span>
            </div>
          </div>

          {/* Followers */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Followers</span>
            <span className="font-medium text-slate-950">{config.followersCount}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Coins</span>
            <div className="flex items-center gap-1.5 font-bold text-[#E62A50]">
              <TikTokCoin size={16} />
              <span>{config.exchangeCoins} Coins</span>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Amount</span>
            <span className="font-bold text-slate-950 tabular-nums">
              {config.exchangeAmountUsd}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-[#FE2C55] hover:bg-[#E62A50] text-white font-semibold text-[15px] py-3.5 rounded-lg text-center cursor-pointer active:scale-[0.99] transition-all shadow-xs"
          >
            Confirm Exchange
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 text-center text-[15px] font-semibold text-slate-900 hover:text-slate-600 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Dimmed bottom elements preview */}
      <div className="absolute bottom-4 left-5 right-5 pointer-events-none opacity-20">
        <div className="w-full h-11 bg-red-600 rounded-lg" />
      </div>
    </div>
  );
};
