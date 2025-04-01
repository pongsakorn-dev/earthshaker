import React from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}

export function PageHeader({ children, className, ...props }: ContainerProps) {
  return (
    <header className={cn('py-6 mb-6 border-b', className)} {...props}>
      {children}
    </header>
  );
}

export function PageTitle({ children, className, ...props }: ContainerProps) {
  return (
    <h1 className={cn('text-3xl font-bold leading-tight text-foreground', className)} {...props}>
      {children}
    </h1>
  );
}

export function Section({ children, className, ...props }: ContainerProps) {
  return (
    <section className={cn('py-6', className)} {...props}>
      {children}
    </section>
  );
}

export function Grid({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {children}
    </div>
  );
}

export function FormGrid({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export function FormSection({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('space-y-4 mb-8', className)} {...props}>
      {children}
    </div>
  );
}

export function FormField({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
}

export function Divider({ className, ...props }: Omit<ContainerProps, 'children'>) {
  return (
    <hr className={cn('my-6 border-t border-border', className)} {...props} />
  );
} 