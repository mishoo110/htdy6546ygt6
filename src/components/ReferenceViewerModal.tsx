import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ScreenId } from '../types.ts';

interface ReferenceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ScreenId;
  onSelectScreen: (id: ScreenId) => void;
}

const SCREEN_IMAGES: Record<ScreenId, { name: string; path: string; desc: string }> = {
  1: {
    name: 'Screen 1: Main Exchange',
    path: '/assets/aistudio/1_faa6d65d.jpg',
    desc: 'الواجهة الأولى: شاشة التحويل الرئيسية ورصيد العملات واختيار الباقات وإدخال اسم الحساب.',
  },
  2: {
    name: 'Screen 2: Custom Keypad',
    path: '/assets/aistudio/2_f9595bc7.jpg',
    desc: 'الواجهة الثانية: لوحة الأرقام المخصصة لإدخال عدد العملات وسحب الرصيد الكامل.',
  },
  3: {
    name: 'Screen 3: Exchange Confirmation',
    path: '/assets/aistudio/3_dacf2d1e.jpg',
    desc: 'الواجهة الثالثة: نافذة تأكيد عملية التحويل وتفاصيل الحساب والمبلغ المخصوم.',
  },
  4: {
    name: 'Screen 4: Exchanging Loader',
    path: '/assets/aistudio/4_f59c1524.jpg',
    desc: 'الواجهة الرابعة: شاشة جارٍ التحويل (Exchanging...) مع الدائرة المتحركة والخلفية الضبابية.',
  },
  5: {
    name: 'Screen 5: Exchange Completed',
    path: '/assets/aistudio/5_3b2e0784.jpg',
    desc: 'الواجهة الخامسة: شاشة اكتمال التحويل بنجاح مع إيصال العملية وزر العودة الأخضر.',
  },
};

export const ReferenceViewerModal: React.FC<ReferenceViewerModalProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  const current = SCREEN_IMAGES[activeScreen];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-sm">📸 Original Reference Screenshots</span>
            <span className="text-xs text-slate-400">· الصور الأصلية المرفقة</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {([1, 2, 3, 4, 5] as ScreenId[]).map((num) => {
            const isSelected = activeScreen === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onSelectScreen(num)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>صورة {num}</span>
                <span className="text-[10px] opacity-75">
                  ({num === 1 ? 'الرئيسية' : num === 2 ? 'المخصصة' : num === 3 ? 'التأكيد' : num === 4 ? 'التحميل' : 'الإيصال'})
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="relative max-h-[65vh] flex items-center justify-center bg-black rounded-xl p-2 border border-slate-800 shadow-inner">
            <img
              src={current.path}
              alt={current.name}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-80 flex flex-col justify-center space-y-3">
            <div className="inline-block px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md text-xs font-semibold w-fit">
              Image #{activeScreen}
            </div>
            <h3 className="text-lg font-bold text-white">{current.name}</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans" dir="rtl">
              {current.desc}
            </p>
            <div className="pt-2">
              <a
                href={current.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 underline font-medium"
              >
                <span>فتح الصورة بجودتها الكاملة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
