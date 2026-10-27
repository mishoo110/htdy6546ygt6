import React from 'react';
import { X, Check, Music2, ArrowLeft } from 'lucide-react';
import { TikTokCoin } from './TikTokCoin.tsx';
import { AppConfig } from '../types.ts';

interface Screen5CompletedProps {
  config: AppConfig;
  onGoBack: () => void;
}

export const Screen5Completed: React.FC<Screen5CompletedProps> = ({
  config,
  onGoBack,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-2 pb-4 bg-white text-slate-900">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between py-1 mb-6">
          {/* Left Close */}
          <button
            type="button"
            onClick={onGoBack}
            className="p-1 -ml-1 text-slate-800 hover:text-black cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Right User Lockup */}
          <div className="flex items-center gap-2.5">
            <div className="text-right flex flex-col">
              <span className="font-bold text-[13px] leading-tight text-slate-900">
                {config.userDisplayName}
              </span>
              <span className="text-[11px] text-slate-400 leading-tight">
                @{config.userHandle.replace(/^@/, '')}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D1D5DB] shrink-0 border border-slate-200">
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
          </div>
        </div>

        {/* Big Green Success Check Circle */}
        <div className="flex flex-col items-center mt-3 mb-6">
          <div className="w-20 h-20 rounded-full bg-[#20D563] flex items-center justify-center text-white shadow-sm shadow-emerald-500/10">
            <Check className="w-10 h-10 stroke-[3.2]" />
          </div>

          <h1 className="text-[23px] font-bold text-slate-950 text-center mt-5 mb-1.5 tracking-tight">
            Exchange Completed!
          </h1>

          <div className="flex items-center justify-center gap-1.5 text-[15px] text-slate-500 font-normal">
            <span>You exchanged for</span>
            <TikTokCoin size={17} />
            <span className="font-medium text-slate-800">
              {config.exchangeCoins} Coins
            </span>
          </div>
        </div>

        {/* Transaction Summary List */}
        <div className="space-y-4 pt-3 pb-2 text-[14px]">
          {/* Recipient */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Recipient</span>
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

          {/* Coins Exchanged */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Coins Exchanged</span>
            <span className="font-bold text-slate-950">
              {config.exchangeCoins} Coins
            </span>
          </div>

          {/* Deducted Amount */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Deducted Amount</span>
            <span className="font-bold text-[#E62A50] tabular-nums">
              {config.exchangeAmountUsd}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-normal">Time</span>
            <span className="font-bold text-slate-950 text-[13.5px] tabular-nums">
              {config.transactionTime}
            </span>
          </div>
        </div>

        {/* Start gifter level Promo Card */}
        <div className="mt-8 rounded-2xl bg-[#F8F9FA] border border-slate-100 p-3.5 flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0F141C] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Music2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] font-bold text-slate-950">
              Start gifter level
            </h4>
            <p className="text-[12px] text-slate-500 leading-snug mt-0.5">
              Send your first Gift to begin your gifter journey and unlock more rewards as you level up.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Go Back Action */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full bg-[#20D563] hover:bg-[#1bc058] text-white font-medium text-[15px] py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          <span>Go back</span>
        </button>
      </div>
    </div>
  );
};
