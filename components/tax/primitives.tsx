import type { ReactNode } from 'react'
import {
  Briefcase,
  Building2,
  Car,
  GraduationCap,
  Heart,
  House,
  Laptop,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RelevantArea } from '@/lib/tax/analysis'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'text-[0.7rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  return (
    <Tag className={cn('rounded-2xl border border-border bg-card shadow-card', className)}>
      {children}
    </Tag>
  )
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'accent' | 'demo'
  className?: string
}) {
  const tones = {
    neutral: 'bg-muted text-muted-foreground border-border',
    success: 'bg-success-muted text-success border-transparent',
    accent: 'bg-accent text-accent-foreground border-transparent',
    demo: 'bg-secondary text-muted-foreground border-border-strong border-dashed',
  } as const
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function GermanTerm({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm leading-relaxed text-muted-foreground', className)}>
      <span className="font-medium text-foreground/70">{children}</span>
    </p>
  )
}

export function ProgressBar({
  value,
  className,
  tone = 'primary',
}: {
  value: number
  className?: string
  tone?: 'primary' | 'success'
}) {
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500 ease-out',
          tone === 'primary' ? 'bg-primary' : 'bg-success',
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

const areaIcons = {
  car: Car,
  home: House,
  briefcase: Briefcase,
  laptop: Laptop,
  shield: ShieldCheck,
  building: Building2,
  graduation: GraduationCap,
  heart: Heart,
  users: Users,
}

export function AreaIcon({ icon, className }: { icon: RelevantArea['icon']; className?: string }) {
  const Icon = areaIcons[icon] ?? Briefcase
  return <Icon className={cn('size-5 text-primary', className)} aria-hidden="true" />
}
