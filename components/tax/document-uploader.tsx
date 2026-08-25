'use client'

import { useRef, useState } from 'react'
import { Check, FileText, Loader2, Lock, RefreshCw, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from './primitives'
import type { UploadStatus, UploadedDocument } from '@/lib/tax/types'

const ACCEPTED = '.pdf,.jpg,.jpeg,.png'

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentUploader({
  status,
  document,
  onFile,
  onRemove,
}: {
  status: UploadStatus
  document: UploadedDocument | null
  onFile: (file: UploadedDocument) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    const isValid = /\.(pdf|jpe?g|png)$/i.test(file.name)
    if (!isValid) {
      setError('Поддържат се само файлове във формат PDF, JPG или PNG.')
      return
    }
    setError(null)
    onFile({ name: file.name, size: file.size })
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col gap-3">
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            handleFiles(event.dataTransfer.files)
          }}
          className={cn(
            'flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed bg-card px-6 py-10 text-center transition-colors',
            dragging ? 'border-primary bg-accent/50' : 'border-border-strong',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent">
            <Upload className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-medium">Плъзни файла тук</p>
            <p className="text-sm text-muted-foreground">или го избери от устройството си</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            Избери файл
          </button>
          <p className="text-xs text-muted-foreground">Приемани формати: PDF, JPG, PNG · до 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            aria-label="Избери файл за качване"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          Прототип — файловете не се изпращат към сървър.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            status === 'done' ? 'bg-success-muted' : 'bg-accent',
          )}
        >
          {status === 'uploading' ? (
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          ) : (
            <FileText className="size-5 text-success" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{document?.name}</p>
          <p className="text-sm text-muted-foreground">
            {status === 'uploading' ? 'Качване…' : document ? formatSize(document.size) : ''}
          </p>
        </div>
        {status === 'done' && (
          <Badge tone="success">
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            Качен
          </Badge>
        )}
      </div>

      {status === 'done' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Замени
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-destructive transition-colors outline-none hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Премахни
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="sr-only"
            aria-label="Замени файла"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
      )}
    </div>
  )
}
