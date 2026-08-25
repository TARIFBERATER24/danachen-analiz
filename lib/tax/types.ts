export type YesNo = 'yes' | 'no'

export type MaritalStatus = 'single' | 'married' | 'separated' | 'divorced' | 'widowed'

export type BenefitId = 'krankengeld' | 'arbeitslosengeld' | 'elterngeld' | 'kurzarbeitergeld' | 'none'

export type ExpenseId =
  | 'commute'
  | 'homeoffice'
  | 'equipment'
  | 'devices'
  | 'training'
  | 'workwear'
  | 'moving'
  | 'secondHome'
  | 'insurance'
  | 'donations'
  | 'other'

export type LohnsteuerChoice = 'upload' | 'later' | 'missing'

/** Typed questionnaire state. Every field is optional so the flow can be resumed. */
export type TaxAnswers = {
  worked?: YesNo
  employers?: '1' | '2' | '3+'
  changedEmployer?: YesNo

  maritalStatus?: MaritalStatus
  hasChildren?: YesNo
  childrenCount?: number

  homeoffice?: YesNo
  homeofficeDays?: number
  commute?: YesNo
  commuteKm?: number

  secondHome?: YesNo
  moved?: YesNo

  benefits?: BenefitId[]
  expenses?: ExpenseId[]

  supportsRelative?: YesNo
  supportCountry?: string
  supportAmount?: number

  lohnsteuer?: LohnsteuerChoice
}

export type UploadStatus = 'empty' | 'uploading' | 'done'

export type UploadedDocument = {
  name: string
  size: number
}

export type FlowStage = 'intro' | 'questions' | 'upload' | 'analysis' | 'result'

export type QuestionKind = 'single' | 'multi' | 'counter' | 'number' | 'support'

export type ChoiceOption = {
  value: string
  label: string
  german?: string
  hint?: string
}

export type QuestionScreen = {
  id: string
  /** 1–8, used for the "Стъпка X от 8" indicator. */
  step: number
  stepLabel: string
  question: string
  german?: string
  helper?: string
  kind: QuestionKind
  field: keyof TaxAnswers
  options?: ChoiceOption[]
  /** for number / counter kinds */
  unit?: string
  min?: number
  max?: number
  placeholder?: string
  visible?: (answers: TaxAnswers) => boolean
}
