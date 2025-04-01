import React from 'react';
import { cn } from '../../lib/utils';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-3xl font-bold leading-tight tracking-tight', className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-2xl font-bold leading-tight tracking-tight', className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('text-xl font-semibold leading-snug tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn('text-lg font-semibold leading-snug tracking-tight', className)}>
      {children}
    </h4>
  );
}

export function Paragraph({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base leading-normal', className)}>
      {children}
    </p>
  );
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small className={cn('text-sm leading-normal', className)}>
      {children}
    </small>
  );
}

export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: TypographyProps) {
  return (
    <h3 className={cn('text-xl font-semibold leading-tight text-primary', className)}>
      {children}
    </h3>
  );
}

export function SubsectionTitle({ children, className }: TypographyProps) {
  return (
    <h4 className={cn('text-lg font-medium leading-snug text-secondary', className)}>
      {children}
    </h4>
  );
} 