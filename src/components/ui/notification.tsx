import React from 'react';
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
  if (!open) return null;

  const severityStyles = {
    success: 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.2)]',
    error: 'bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.2)]',
    warning: 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.2)]',
    info: 'bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.2)]',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 p-4 rounded-md shadow-lg border max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300',
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