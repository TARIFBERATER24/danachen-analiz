import type { QuestionScreen, TaxAnswers } from './types'

export const TOTAL_STEPS = 8

const yes = (v: unknown) => v === 'yes'

/**
 * The questionnaire is pure data: one question per screen.
 * New questions can be inserted without touching the flow controller.
 */
export const QUESTION_SCREENS: QuestionScreen[] = [
  // ── Step 1 — Работа ─────────────────────────────────────────────
  {
    id: 'worked',
    step: 1,
    stepLabel: 'Работа',
    question: 'Работил ли си в Германия през 2025 г.?',
    kind: 'single',
    field: 'worked',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'employers',
    step: 1,
    stepLabel: 'Работа',
    question: 'Колко работодатели имаше през 2025 г.?',
    kind: 'single',
    field: 'employers',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3+', label: '3 или повече' },
    ],
    visible: (a) => yes(a.worked),
  },
  {
    id: 'changedEmployer',
    step: 1,
    stepLabel: 'Работа',
    question: 'Сменя ли работодателя през годината?',
    kind: 'single',
    field: 'changedEmployer',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
    visible: (a) => yes(a.worked),
  },

  // ── Step 2 — Семейство ──────────────────────────────────────────
  {
    id: 'maritalStatus',
    step: 2,
    stepLabel: 'Семейство',
    question: 'Какво беше семейното ти положение през 2025 г.?',
    kind: 'single',
    field: 'maritalStatus',
    options: [
      { value: 'single', label: 'Неженен / неомъжена' },
      { value: 'married', label: 'Женен / омъжена' },
      { value: 'separated', label: 'Разделен' },
      { value: 'divorced', label: 'Разведен' },
      { value: 'widowed', label: 'Вдовец / вдовица' },
    ],
  },
  {
    id: 'hasChildren',
    step: 2,
    stepLabel: 'Семейство',
    question: 'Имаш ли деца?',
    kind: 'single',
    field: 'hasChildren',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'childrenCount',
    step: 2,
    stepLabel: 'Семейство',
    question: 'Колко деца?',
    kind: 'counter',
    field: 'childrenCount',
    min: 1,
    max: 10,
    visible: (a) => yes(a.hasChildren),
  },

  // ── Step 3 — Разходи за работа ──────────────────────────────────
  {
    id: 'homeoffice',
    step: 3,
    stepLabel: 'Разходи за работа',
    question: 'Работил ли си от вкъщи?',
    german: 'Homeoffice — работа от вкъщи',
    kind: 'single',
    field: 'homeoffice',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
    visible: (a) => yes(a.worked),
  },
  {
    id: 'homeofficeDays',
    step: 3,
    stepLabel: 'Разходи за работа',
    question: 'Приблизително колко дни през 2025 г.?',
    helper: 'Достатъчна е приблизителна преценка. Можеш да я коригираш по-късно.',
    kind: 'number',
    field: 'homeofficeDays',
    unit: 'дни',
    min: 0,
    max: 365,
    placeholder: 'напр. 60',
    visible: (a) => yes(a.worked) && yes(a.homeoffice),
  },
  {
    id: 'commute',
    step: 3,
    stepLabel: 'Разходи за работа',
    question: 'Пътуваше ли редовно до работното си място?',
    german: 'Pendlerpauschale — разходи за пътуване до работа',
    kind: 'single',
    field: 'commute',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
    visible: (a) => yes(a.worked),
  },
  {
    id: 'commuteKm',
    step: 3,
    stepLabel: 'Разходи за работа',
    question: 'Колко километра е разстоянието в една посока?',
    helper: 'Посочи само разстоянието от дома до работата, не отиване + връщане.',
    kind: 'number',
    field: 'commuteKm',
    unit: 'km',
    min: 0,
    max: 500,
    placeholder: 'напр. 24',
    visible: (a) => yes(a.worked) && yes(a.commute),
  },

  // ── Step 4 — Жилище и преместване ───────────────────────────────
  {
    id: 'secondHome',
    step: 4,
    stepLabel: 'Жилище',
    question: 'Имал ли си второ жилище заради работата си?',
    german: 'Doppelte Haushaltsführung — второ жилище заради работа',
    kind: 'single',
    field: 'secondHome',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'moved',
    step: 4,
    stepLabel: 'Жилище',
    question: 'Премести ли се заради нова работа или значително по-кратък път до работа?',
    kind: 'single',
    field: 'moved',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
  },

  // ── Step 5 — Плащания ───────────────────────────────────────────
  {
    id: 'benefits',
    step: 5,
    stepLabel: 'Плащания',
    question: 'Получавал ли си някое от следните плащания през 2025 г.?',
    helper: 'Можеш да избереш повече от едно.',
    kind: 'multi',
    field: 'benefits',
    options: [
      { value: 'krankengeld', label: 'Krankengeld', hint: 'обезщетение при болест от здравната каса' },
      { value: 'arbeitslosengeld', label: 'Arbeitslosengeld', hint: 'обезщетение за безработица' },
      { value: 'elterngeld', label: 'Elterngeld', hint: 'помощ за родители след раждане на дете' },
      { value: 'kurzarbeitergeld', label: 'Kurzarbeitergeld', hint: 'компенсация при намалено работно време' },
      { value: 'none', label: 'Нито едно', hint: 'не съм получавал такива плащания' },
    ],
  },

  // ── Step 6 — Разходи ────────────────────────────────────────────
  {
    id: 'expenses',
    step: 6,
    stepLabel: 'Разходи',
    question: 'За кои от тези неща си плащал през 2025 г.?',
    helper: 'Избери всичко, което се отнася за теб.',
    kind: 'multi',
    field: 'expenses',
    options: [
      { value: 'commute', label: 'Пътуване до работа' },
      { value: 'homeoffice', label: 'Homeoffice', hint: 'работа от вкъщи' },
      { value: 'equipment', label: 'Работно оборудване' },
      { value: 'devices', label: 'Компютър / телефон' },
      { value: 'training', label: 'Професионални обучения' },
      { value: 'workwear', label: 'Работно облекло' },
      { value: 'moving', label: 'Преместване заради работа' },
      { value: 'secondHome', label: 'Второ жилище' },
      { value: 'insurance', label: 'Застраховки' },
      { value: 'donations', label: 'Дарения' },
      { value: 'other', label: 'Други професионални разходи' },
    ],
  },

  // ── Step 7 — Издръжка на близък ─────────────────────────────────
  {
    id: 'supportsRelative',
    step: 7,
    stepLabel: 'Издръжка',
    question: 'Изпращал ли си редовно пари за издръжка на близък човек?',
    kind: 'single',
    field: 'supportsRelative',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Не' },
    ],
  },
  {
    id: 'support',
    step: 7,
    stepLabel: 'Издръжка',
    question: 'Разкажи малко повече за издръжката',
    helper: 'Тази информация може да бъде релевантна и трябва да бъде проверена допълнително.',
    kind: 'support',
    field: 'supportCountry',
    visible: (a) => yes(a.supportsRelative),
  },

  // ── Step 8 — Lohnsteuerbescheinigung ────────────────────────────
  {
    id: 'lohnsteuer',
    step: 8,
    stepLabel: 'Документи',
    question: 'Имаш ли годишното удостоверение от работодателя?',
    german: 'Lohnsteuerbescheinigung 2025 — годишно удостоверение от работодателя',
    kind: 'single',
    field: 'lohnsteuer',
    options: [
      { value: 'upload', label: 'Да — искам да го кача' },
      { value: 'later', label: 'Да — ще го кача по-късно' },
      { value: 'missing', label: 'Все още не го имам' },
    ],
  },
]

export function visibleScreens(answers: TaxAnswers): QuestionScreen[] {
  return QUESTION_SCREENS.filter((screen) => !screen.visible || screen.visible(answers))
}

export function isAnswered(screen: QuestionScreen, answers: TaxAnswers): boolean {
  if (screen.kind === 'multi') {
    const value = answers[screen.field] as string[] | undefined
    return Array.isArray(value) && value.length > 0
  }
  if (screen.kind === 'support') {
    return Boolean(answers.supportCountry) && typeof answers.supportAmount === 'number'
  }
  const value = answers[screen.field]
  return value !== undefined && value !== '' && !Number.isNaN(value as number)
}
