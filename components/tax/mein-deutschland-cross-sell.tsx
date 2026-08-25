import { CalendarClock, FileSignature, FolderOpen, ShieldCheck, Wifi, Zap } from 'lucide-react'

const ITEMS = [
  { icon: FileSignature, label: 'Договори', hint: 'на едно място' },
  { icon: Zap, label: 'Ток и газ', hint: 'смяна и сравнение' },
  { icon: Wifi, label: 'Интернет', hint: 'тарифи и срокове' },
  { icon: ShieldCheck, label: 'Застраховки', hint: 'преглед' },
  { icon: CalendarClock, label: 'Важни срокове', hint: 'напоминания' },
  { icon: FolderOpen, label: 'Документи', hint: 'архив' },
]

export function MeinDeutschlandCrossSell() {
  return (
    <section className="flex flex-col gap-5 border-t border-border pt-8">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-balance">
          Още неща, които можеш да управляваш с Mein Deutschland
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Данъчният анализ е част от по-голяма платформа за живота в Германия.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, label, hint }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
          >
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{label}</span>
              <span className="truncate text-xs text-muted-foreground">{hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
