import React, { useState, useEffect, useRef } from 'react';
import { TikTokCoin } from './TikTokCoin.tsx';
import { AppConfig } from '../types.ts';

interface Screen4LoadingProps {
  config: AppConfig;
  startUsd: number;
  targetUsd: number;
  startCoins: number;
  targetCoins: number;
  onFinishedLoading?: () => void;
}

export const Screen4Loading: React.FC<Screen4LoadingProps> = ({
  config,
  startUsd,
  targetUsd,
  startCoins,
  targetCoins,
  onFinishedLoading,
}) => {
  const [currentUsd, setCurrentUsd] = useState<number>(startUsd);
  const [currentCoins, setCurrentCoins] = useState<number>(startCoins);
  const hasFinishedRef = useRef(false);

  // Gradual countdown animation as the spinner rotates
  useEffect(() => {
    hasFinishedRef.current = false;
    const duration = 2100; // Brisk smooth gradual decrease
    const startTime = performance.now();
    let animId: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth easing
      const easeProgress = 1 - Math.pow(1 - progress, 2);

      const nextUsd = startUsd - (startUsd - targetUsd) * easeProgress;
      const nextCoins = Math.round(startCoins - (startCoins - targetCoins) * easeProgress);

      setCurrentUsd(nextUsd);
      setCurrentCoins(nextCoins);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          // Hold final deducted numbers momentarily, then complete
          setTimeout(() => {
            if (onFinishedLoading) {
              onFinishedLoading();
            }
          }, 450);
        }
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [startUsd, targetUsd, startCoins, targetCoins, onFinishedLoading]);

  const formattedUsd = `$${currentUsd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const formattedCoins = currentCoins.toLocaleString('en-US');

  return (
    <div className="relative flex-1 flex flex-col justify-between bg-white overflow-hidden select-none">
      {/* Background: Screen 1 with exact degree of semi-transparency from the reference screenshot */}
      <div className="absolute inset-0 px-5 pt-2 pb-4 flex flex-col justify-between filter blur-[1.5px] opacity-45 pointer-events-none select-none">
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between py-1 mb-5">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-lg">✕</span>
              <span className="text-lg">—</span>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <span className="font-bold text-[17px] text-slate-900">Exchange</span>
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="text-right flex flex-col">
                <span className="font-bold text-[13px]">{config.userDisplayName}</span>
                <span className="text-[11px] text-slate-400">@{config.userHandle.replace(/^@/, '')}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#D1D5DB]" />
            </div>
          </div>

          {/* Balance Section - with animated numbers decreasing gradually */}
          <div className="text-center mt-3">
            <p className="text-[15px] font-semibold text-slate-900">
              TikTok Coins Balance
            </p>
            <h1 className="text-[34px] font-black text-slate-950 tracking-tight mt-0.5 mb-1 tabular-nums">
              {formattedUsd}
            </h1>
            <div className="flex items-center justify-center gap-1 text-[13px] text-slate-800 font-medium tabular-nums flex-wrap">
              <span>=</span>
              <span className="text-[#E62A50] font-semibold">{formattedUsd}</span>
              <span>(</span>
              <TikTokCoin size={15} className="mx-0.5" />
              <span>{formattedCoins})</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-1">
              Available balance to exchange the Coins
            </p>
          </div>

          {/* TikTok Username Box */}
          <div className="mt-6">
            <div className="text-[15px] font-bold text-slate-900 mb-2">
              TikTok username
            </div>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white">
              <span className="text-slate-900 text-sm font-medium">@ {config.recipientHandle.replace(/^@/, '')}</span>
              <span className="text-[#E62A50] font-semibold text-sm">Search</span>
            </div>
          </div>

          {/* Packages */}
          <div className="mt-5">
            <div className="text-[15px] font-bold text-slate-900 mb-3">
              Exchange earnings for Coins
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="border border-slate-200 rounded-xl py-4 flex flex-col items-center">
                <TikTokCoin size={24} />
                <span className="font-bold text-sm mt-1">250</span>
                <span className="text-xs text-slate-400">$3.03</span>
              </div>
              <div className="border border-slate-200 rounded-xl py-4 flex flex-col items-center">
                <TikTokCoin size={24} />
                <span className="font-bold text-sm mt-1">500</span>
                <span className="text-xs text-slate-400">$6.07</span>
              </div>
              <div className="border border-slate-200 rounded-xl py-4 flex flex-col items-center">
                <TikTokCoin size={24} />
                <span className="font-bold text-sm mt-1">15,000</span>
                <span className="text-xs text-slate-400">$182.04</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="pt-4">
          <div className="w-full bg-[#FE2C55] opacity-50 text-white font-semibold text-[15px] py-3.5 rounded-lg text-center">
            Exchange
          </div>
        </div>
      </div>

      {/* Translucent wash overlay matching image 0c349cdd-c688-4bbb-8e9c-59dc8728c8b2_5619848a.jfif */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />

      {/* Centered Spinning Ring Loader and Exchanging text */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6">
        {/* Animated dual-accent ring loader */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Background track */}
          <div className="w-14 h-14 rounded-full border-[3.5px] border-slate-100" />
          {/* Rotating active red/pink arc - slightly faster rotation */}
          <div
            className="absolute inset-0 w-14 h-14 rounded-full border-[3.5px] border-transparent border-t-[#FE2C55] border-r-[#FE2C55]"
            style={{ animation: 'spin 0.65s linear infinite' }}
          />
        </div>

        {/* Bold Text directly matching image */}
        <h3 className="text-[17px] font-bold text-slate-950 mt-4 tracking-tight">
          Exchanging...
        </h3>
      </div>
    </div>
  );
};
