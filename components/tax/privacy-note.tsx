import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PrivacyNote({ className }: { className?: string }) {
  return (
    <section
      className={cn('flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5', className)}
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Lock className="size-4 text-primary" aria-hidden="true" />
        Твоите документи съдържат чувствителни лични данни.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
        В тази V1 версия отговорите и метаданните се запазват локално на това устройство. Качените
        файлове се пазят в локално хранилище, не се обработват с OCR и не се изпращат към Finanzamt.
        Облачно запазване с вход и потребителски акаунт изисква свързване на auth/database слой.
      </p>
    </section>
  )
}

export function LegalNote({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs leading-relaxed text-muted-foreground text-pretty', className)}>
      Данъчният анализ представлява първоначална ориентация и подготовка на информация. Той не е
      данъчна консултация и не замества лицензиран Steuerberater. Професионална помощ се предоставя
      чрез оторизиран партньор.
    </p>
  )
}

