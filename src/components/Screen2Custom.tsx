import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { TikTokCoin } from './TikTokCoin.tsx';
import { AppConfig } from '../types.ts';

interface Screen2CustomProps {
  config: AppConfig;
  onClose: () => void;
  onConfirmAmount: (coins: string, rawCoins: number, rawUsd: number) => void;
}

export const Screen2Custom: React.FC<Screen2CustomProps> = ({
  config,
  onClose,
  onConfirmAmount,
}) => {
  const [coinsInput, setCoinsInput] = useState<string>('');

  const handleKeyClick = (key: string) => {
    if (key === 'backspace') {
      setCoinsInput((prev) => prev.slice(0, -1));
    } else if (key === '00') {
      if (coinsInput.length > 0 && coinsInput.length < 10) {
        setCoinsInput((prev) => prev + '00');
      }
    } else if (key === 'all') {
      setCoinsInput(config.totalCoinsBalance.replace(/,/g, ''));
    } else {
      if (coinsInput.length < 10) {
        setCoinsInput((prev) => prev + key);
      }
    }
  };

  const formattedInput = coinsInput
    ? Number(coinsInput).toLocaleString()
    : '';

  // Approximate dollar rate based on TikTok screenshot: 100,000 coins = $1,210.00 => $0.0121/coin
  const coinNum = Number(coinsInput || 0);
  const totalUsd = coinNum > 0 ? (coinNum * 0.0121).toFixed(2) : '0';

  const handleExchange = () => {
    if (coinNum > 0) {
      onConfirmAmount(formattedInput, coinNum, coinNum * 0.0121);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-end bg-black/40">
      {/* Background Dimmed Fake Screen 1 Peek */}
      <div className="absolute inset-0 pointer-events-none opacity-40 blur-xs overflow-hidden px-5 pt-3">
        <div className="flex items-center justify-between text-slate-900 py-1">
          <span className="font-bold">Exchange</span>
          <div className="w-8 h-8 rounded-full bg-slate-300" />
        </div>
        <div className="text-center mt-5">
          <p className="text-sm">TikTok Coins Balance</p>
          <p className="text-2xl font-bold">{config.totalBalanceUsd}</p>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div className="relative z-10 bg-white rounded-t-3xl pt-5 pb-4 px-5 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-slate-900">Custom</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Number of coins label */}
        <p className="text-[12px] text-slate-400 font-medium mb-1.5">
          Number of coins
        </p>

        {/* Amount Input Row */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TikTokCoin size={20} />
            {coinsInput ? (
              <span className="text-[19px] font-bold text-slate-950 tracking-tight tabular-nums">
                {formattedInput}
              </span>
            ) : (
              <span className="text-[16px] text-slate-300 font-medium">
                Enter any amount
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleKeyClick('all')}
            className="text-[14px] font-bold text-slate-900 hover:text-black cursor-pointer px-1 shrink-0"
          >
            All
          </button>
        </div>

        {/* Source balance caption */}
        <p className="text-[11px] text-slate-400 mt-2 mb-3">
          From LIVE Rewards balance: {config.totalBalanceUsd} ({config.totalCoinsBalance})
        </p>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 my-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyClick(digit)}
              className="h-12 bg-[#F8F9FA] hover:bg-[#EFF1F3] active:bg-[#E5E7EB] rounded-xl flex items-center justify-center text-[20px] font-medium text-slate-900 transition-all active:scale-[0.97] cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleKeyClick('00')}
            className="h-12 bg-[#F8F9FA] hover:bg-[#EFF1F3] active:bg-[#E5E7EB] rounded-xl flex items-center justify-center text-[19px] font-medium text-slate-900 transition-all active:scale-[0.97] cursor-pointer"
          >
            00
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('0')}
            className="h-12 bg-[#F8F9FA] hover:bg-[#EFF1F3] active:bg-[#E5E7EB] rounded-xl flex items-center justify-center text-[20px] font-medium text-slate-900 transition-all active:scale-[0.97] cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeyClick('backspace')}
            className="h-12 bg-[#F8F9FA] hover:bg-[#EFF1F3] active:bg-[#E5E7EB] rounded-xl flex items-center justify-center text-slate-800 transition-all active:scale-[0.97] cursor-pointer"
            title="Backspace"
          >
            <Delete className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Total Row */}
        <div className="flex items-center justify-between pt-2.5 pb-1">
          <span className="text-[14px] font-bold text-slate-900">Total</span>
          <span className="text-[14px] text-slate-400 tabular-nums">
            {coinNum > 0 ? `$${totalUsd}` : '0'}
          </span>
        </div>

        {/* Policy disclaimer */}
        <p className="text-[10px] text-slate-400 mt-1 mb-3">
          Coins obtained through this exchange are subject to our{' '}
          <span className="text-[#E62A50] font-medium cursor-pointer">
            Virtual Items Policy
          </span>
          .
        </p>

        {/* Bottom Exchange Button */}
        <button
          type="button"
          onClick={handleExchange}
          disabled={coinNum <= 0}
          className={`w-full py-3.5 rounded-lg text-center font-semibold text-[15px] transition-all ${
            coinNum > 0
              ? 'bg-[#FE2C55] hover:bg-[#E62A50] text-white cursor-pointer active:scale-[0.99]'
              : 'bg-[#F3F4F6] text-slate-400 cursor-not-allowed'
          }`}
        >
          Exchange
        </button>
      </div>
    </div>
  );
};
