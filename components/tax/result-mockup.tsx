import { Car, Check, House, Lock, ShieldCheck } from 'lucide-react'

/** Static, non-interactive preview of the result dashboard, used as hero visual. */
export function ResultMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -top-6 bottom-10 rounded-[2.5rem] bg-surface" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[320px] rounded-[2.25rem] border border-border-strong bg-card p-2 shadow-raised">
        <div className="overflow-hidden rounded-[1.75rem] bg-background">
          {/* status bar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-[0.68rem] font-medium text-muted-foreground">Mein Deutschland</span>
            <span className="text-[0.68rem] font-medium text-muted-foreground">2025</span>
          </div>

          <div className="space-y-3 p-4">
            <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Твоят данъчен анализ
            </p>

            <div className="rounded-xl border border-border bg-card p-3.5 shadow-card">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-muted">
                  <Check className="size-3 text-success" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="text-[0.78rem] leading-snug font-medium text-foreground">
                  Данните ти се подреждат за проверка
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] font-medium text-muted-foreground">Готовност на случая</p>
                <Lock className="size-3 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-1.5 font-mono text-lg tracking-tight text-foreground/40">•  •  •  €</p>
              <p className="mt-1 text-[0.62rem] text-muted-foreground">Проверката изисква потвърдени данни</p>
            </div>

            <div className="space-y-2">
              {[
                { icon: Car, label: 'Пътуване до работа' },
                { icon: House, label: 'Homeoffice' },
                { icon: ShieldCheck, label: 'Застраховки' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
                >
                  <Icon className="size-3.5 text-primary" aria-hidden="true" />
                  <span className="text-[0.72rem] font-medium">{label}</span>
                  <span className="ml-auto text-[0.6rem] text-muted-foreground">за проверка</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center justify-between text-[0.7rem]">
                <span className="font-medium text-muted-foreground">Готовност на документите</span>
                <span className="font-mono text-foreground">7/10</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="rounded-xl bg-primary px-3.5 py-2.5 text-center text-[0.72rem] font-medium text-primary-foreground">
              Добави липсващите документи
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

