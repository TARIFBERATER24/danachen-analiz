import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_ITEMS = [
  'Безплатна първоначална проверка',
  'На български език',
  'Без ангажимент',
  'Сигурна обработка на документи',
]

export function TrustStrip({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: string[]
  className?: string
}) {
  return (
    <ul className={cn('flex flex-wrap gap-x-6 gap-y-2.5', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-4 items-center justify-center rounded-full bg-success-muted">
            <Check className="size-3 text-success" aria-hidden="true" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
