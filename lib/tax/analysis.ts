import type { TaxAnswers } from './types'

export type RelevantArea = {
  id: string
  title: string
  german?: string
  description: string
  icon: 'car' | 'home' | 'briefcase' | 'laptop' | 'shield' | 'building' | 'graduation' | 'heart' | 'users'
}

export type DocumentItem = {
  id: string
  label: string
  german?: string
}

export type Analysis = {
  areas: RelevantArea[]
  availableDocuments: DocumentItem[]
  missingDocuments: DocumentItem[]
  totalDocuments: number
}

const has = (list: string[] | undefined, id: string) => Boolean(list?.includes(id))

export function buildAnalysis(answers: TaxAnswers, documentUploaded: boolean): Analysis {
  const areas: RelevantArea[] = []

  if (answers.commute === 'yes' || has(answers.expenses, 'commute')) {
    areas.push({
      id: 'commute',
      title: 'Пътуване до работа',
      german: 'Pendlerpauschale',
      description:
        answers.commuteKm
          ? `Посочи разстояние от ${answers.commuteKm} km в една посока. Изисква потвърждение на работните дни.`
          : 'Разходите за пътуване между дома и работата обикновено се посочват в декларацията.',
      icon: 'car',
    })
  }

  if (answers.homeoffice === 'yes' || has(answers.expenses, 'homeoffice')) {
    areas.push({
      id: 'homeoffice',
      title: 'Работа от вкъщи',
      german: 'Homeoffice',
      description: answers.homeofficeDays
        ? `Посочи около ${answers.homeofficeDays} дни работа от вкъщи. Броят дни трябва да бъде документиран.`
        : 'Дните, в които си работил от вкъщи, могат да имат значение за резултата.',
      icon: 'home',
    })
  }

  if (
    answers.worked === 'yes' ||
    has(answers.expenses, 'equipment') ||
    has(answers.expenses, 'other') ||
    has(answers.expenses, 'workwear')
  ) {
    areas.push({
      id: 'werbungskosten',
      title: 'Професионални разходи',
      german: 'Werbungskosten',
      description: 'Разходи, свързани директно с работата ти. Събирането на документи тук обикновено има най-голям ефект.',
      icon: 'briefcase',
    })
  }

  if (has(answers.expenses, 'equipment') || has(answers.expenses, 'devices')) {
    areas.push({
      id: 'equipment',
      title: 'Работно оборудване',
      german: 'Arbeitsmittel',
      description: 'Компютър, телефон, мебели и други неща, използвани за работа, се разглеждат отделно.',
      icon: 'laptop',
    })
  }

  if (has(answers.expenses, 'training')) {
    areas.push({
      id: 'training',
      title: 'Професионални обучения',
      german: 'Fortbildungskosten',
      description: 'Курсове, изпити, учебни материали и пътувания за обучение подлежат на проверка.',
      icon: 'graduation',
    })
  }

  if (has(answers.expenses, 'insurance')) {
    areas.push({
      id: 'insurance',
      title: 'Застраховки',
      german: 'Vorsorgeaufwendungen',
      description: 'Част от застрахователните вноски може да е относима. Необходими са годишни удостоверения.',
      icon: 'shield',
    })
  }

  if (answers.secondHome === 'yes' || has(answers.expenses, 'secondHome')) {
    areas.push({
      id: 'secondHome',
      title: 'Второ жилище заради работа',
      german: 'Doppelte Haushaltsführung',
      description: 'Наем, пътувания до дома и допълнителни разходи за храна изискват отделна документация.',
      icon: 'building',
    })
  }

  if (answers.moved === 'yes' || has(answers.expenses, 'moving')) {
    areas.push({
      id: 'moving',
      title: 'Преместване заради работа',
      german: 'Umzugskosten',
      description: 'Разходите за преместване по служебни причини се разглеждат по специални правила.',
      icon: 'home',
    })
  }

  if (answers.supportsRelative === 'yes') {
    areas.push({
      id: 'support',
      title: 'Издръжка на близък човек',
      german: 'Unterhaltsleistungen',
      description:
        'Тази информация може да бъде релевантна и трябва да бъде проверена допълнително. Обикновено са необходими доказателства за преводите.',
      icon: 'heart',
    })
  }

  if (answers.hasChildren === 'yes' || answers.maritalStatus === 'married') {
    areas.push({
      id: 'family',
      title: 'Семейно положение и деца',
      german: 'Familienstand',
      description: 'Семейният статус и децата влияят на данъчната ти класа и на възможните облекчения.',
      icon: 'users',
    })
  }

  const available: DocumentItem[] = []
  const missing: DocumentItem[] = []

  if (documentUploaded || answers.lohnsteuer === 'upload') {
    available.push({ id: 'lst', label: 'Годишно удостоверение от работодателя', german: 'Lohnsteuerbescheinigung' })
  } else {
    missing.push({ id: 'lst', label: 'Годишно удостоверение от работодателя', german: 'Lohnsteuerbescheinigung' })
  }

  if (answers.worked === 'yes') {
    available.push({ id: 'contract', label: 'Трудов договор', german: 'Arbeitsvertrag' })
    available.push({ id: 'health', label: 'Здравна осигуровка', german: 'Krankenversicherung' })
  }

  if (answers.maritalStatus) available.push({ id: 'status', label: 'Данни за семейно положение' })
  if (answers.hasChildren === 'yes') missing.push({ id: 'children', label: 'Документи за децата', german: 'Kindergeld / Geburtsurkunde' })
  if (answers.commute === 'yes') missing.push({ id: 'commuteProof', label: 'Данни за пътуване до работа' })
  if (answers.homeoffice === 'yes') missing.push({ id: 'homeofficeProof', label: 'Homeoffice дни' })
  if (answers.secondHome === 'yes') missing.push({ id: 'secondHomeProof', label: 'Договор и разходи за второто жилище' })
  if (answers.supportsRelative === 'yes') missing.push({ id: 'supportProof', label: 'Доказателства за изпратени суми' })
  if ((answers.expenses?.length ?? 0) > 0) missing.push({ id: 'receipts', label: 'Доказателства за определени разходи' })
  if ((answers.benefits?.length ?? 0) > 0 && !has(answers.benefits, 'none')) {
    missing.push({ id: 'benefitProof', label: 'Удостоверения за получени плащания', german: 'Leistungsnachweise' })
  }

  return {
    areas,
    availableDocuments: available,
    missingDocuments: missing,
    totalDocuments: available.length + missing.length,
  }
}
