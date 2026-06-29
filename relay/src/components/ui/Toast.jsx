import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Info, XCircle } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

const VARIANTS = {
  success: {
    icon: Check,
    iconCls: 'text-success',
    bg:      'bg-success/15',
  },
  error: {
    icon: XCircle,
    iconCls: 'text-danger',
    bg:      'bg-danger/15',
  },
  info: {
    icon: Info,
    iconCls: 'text-olive-300',
    bg:      'bg-olive-500/20',
  },
  default: {
    icon: Info,
    iconCls: 'text-white/50',
    bg:      'bg-white/10',
  },
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200]
      flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const v = VARIANTS[toast.type] ?? VARIANTS.default;
          const Icon = v.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{ opacity: 0, y: 16, scale: 0.95    }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-3
                px-4 py-3 rounded-2xl
                bg-panel border border-white/10
                shadow-panel
                min-w-[260px] max-w-[340px]"
            >
              <div className={`w-7 h-7 rounded-xl flex items-center
                justify-center flex-shrink-0 ${v.bg}`}>
                <Icon size={14} className={v.iconCls} />
              </div>

              <p className="text-xs font-medium text-white/85
                flex-1 leading-relaxed">
                {toast.message}
              </p>

              <button
                onClick={() => remove(toast.id)}
                className="flex-shrink-0 w-5 h-5 flex items-center
                  justify-center text-white/25
                  hover:text-white/60 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}