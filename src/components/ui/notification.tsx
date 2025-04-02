import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface NotificationProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  className?: string;
}

export function Notification({
  open,
  message,
  severity,
  onClose,
  className,
}: NotificationProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const severityStyles = {
    success: 'bg-[hsl(var(--success))] text-white border-[hsl(var(--success))]',
    error: 'bg-[hsl(var(--destructive))] text-white border-[hsl(var(--destructive))]',
    warning: 'bg-[hsl(var(--warning))] text-white border-[hsl(var(--warning))]',
    info: 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]',
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 p-4 rounded-md shadow-lg border max-w-[300px] z-50 animate-in fade-in slide-in-from-right-5 duration-300',
        severityStyles[severity],
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="whitespace-pre-line text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 flex-shrink-0 focus:outline-none"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 