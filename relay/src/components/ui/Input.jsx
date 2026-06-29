import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightElement, 
  required,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">

      {label && (
        <label className="text-[10px] font-bold text-olive-900
          uppercase tracking-nav flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative">

        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2
            text-subtle pointer-events-none flex">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className={cn(
            'w-full py-3 rounded-full border bg-surface',
            'text-sm text-olive-900 placeholder:text-subtle',
            'outline-none transition-all duration-150',
            'focus:ring-2 focus:ring-olive-100',
            error
              ? 'border-danger focus:border-danger'
              : 'border-border focus:border-olive-700',
            leftIcon    ? 'pl-11 pr-4'  : 'px-5',
            rightElement ? 'pr-14'      : '',
            className
          )}
          {...props}
        />

        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex">
            {rightElement}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-xs text-danger flex items-center gap-1.5"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
        {!error && helperText && (
          <motion.p
            key="helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-subtle"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;