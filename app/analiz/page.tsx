import type { Metadata } from 'next'
import { TaxFlow } from '@/components/tax/tax-flow'

export const metadata: Metadata = {
  title: 'Данъчен анализ 2025 — провери твоята ситуация',
  description:
    'Отговори на няколко лесни въпроса на български и виж кои разходи и данъчни облекчения може да са релевантни за теб.',
}

export default function AnalysisPage() {
  return <TaxFlow />
}
