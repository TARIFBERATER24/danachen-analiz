export const SUPPORTED_TAX_YEAR = 2025 as const

export type AnswerSource = 'user_input' | 'document_extraction' | 'system_derived'
export type VerificationStatus = 'unverified' | 'user_confirmed' | 'verified' | 'needs_review'

export type TaxCaseStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_INFORMATION'
  | 'READY_FOR_REVIEW'
  | 'READY_FOR_FORM_GENERATION'
  | 'FORM_GENERATED'
  | 'COMPLETED'
  | 'BLOCKED_COMPLEX_CASE'

export type MissingSeverity = 'OPTIONAL' | 'REQUIRED_LATER' | 'BLOCKING'
export type EvidenceStatus = 'evidence_required_now' | 'evidence_may_be_requested' | 'evidence_not_required_initially'

export type FieldType =
  | 'yes_no'
  | 'single_select'
  | 'multi_select'
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'counter'
  | 'document'
  | 'address'

export type AddressValue = {
  street?: string
  postalCode?: string
  city?: string
  country?: string
}

export type TaxAnswerValue = string | number | boolean | null | string[] | AddressValue
export type TaxAnswers = Record<string, TaxAnswerValue | undefined>

export type TaxOption = {
  value: string
  labelBg: string
  labelDe?: string
  helpBg?: string
}

export type ConditionalRule = {
  all?: ConditionalRule[]
  any?: ConditionalRule[]
  not?: ConditionalRule
  equals?: { questionId: string; value: TaxAnswerValue }
  includes?: { questionId: string; value: string }
  answered?: string
}

export type EvidenceRequirement = {
  status: EvidenceStatus
  documentType?: string
  whyBg: string
  whereBg: string
  acceptedFormats?: string[]
}

export type TaxQuestion = {
  id: string
  taxYear: number
  category: string
  labelBg: string
  helpBg?: string
  fieldType: FieldType
  required: boolean
  conditionalRule?: ConditionalRule
  evidenceRequirement: EvidenceRequirement
  sourceForm?: string
  /** Deliberately null until the official 2025 field identifier is verified. */
  sourceField: string | null
  validationRule?: string
  priority: number
  options?: TaxOption[]
  unit?: string
  min?: number
  max?: number
  placeholder?: string
}

const noEvidence: EvidenceRequirement = {
  status: 'evidence_not_required_initially',
  whyBg: 'Отговорът помага да се избере правилният път.',
  whereBg: 'Можеш да го попълниш по личните си данни и документи.',
}

const mayRequestEvidence = (documentType: string, whyBg: string, whereBg: string): EvidenceRequirement => ({
  status: 'evidence_may_be_requested',
  documentType,
  whyBg,
  whereBg,
  acceptedFormats: ['PDF', 'JPG', 'PNG'],
})

const requiredEvidence = (documentType: string, whyBg: string, whereBg: string): EvidenceRequirement => ({
  status: 'evidence_required_now',
  documentType,
  whyBg,
  whereBg,
  acceptedFormats: ['PDF', 'JPG', 'PNG'],
})

const yesNo = (id: string, category: string, labelBg: string, helpBg: string, required: boolean, conditionalRule?: ConditionalRule): TaxQuestion => ({
  id,
  taxYear: SUPPORTED_TAX_YEAR,
  category,
  labelBg,
  helpBg,
  fieldType: 'yes_no',
  required,
  conditionalRule,
  evidenceRequirement: noEvidence,
  sourceField: null,
  priority: required ? 1 : 2,
  options: [
    { value: 'yes', labelBg: 'Да' },
    { value: 'no', labelBg: 'Не' },
  ],
})

export const TAX_QUESTIONS: TaxQuestion[] = [
  // Personal data
  {
    id: 'full_name', taxYear: 2025, category: 'Лични данни', labelBg: 'Как е пълното ти име?',
    helpBg: 'Въведи името така, както е изписано в официалните ти документи.', fieldType: 'text', required: true,
    evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null, validationRule: 'not_empty', priority: 1,
    placeholder: 'Име и фамилия',
  },
  {
    id: 'address', taxYear: 2025, category: 'Лични данни', labelBg: 'Къде беше адресът ти в Германия през 2025 г.?',
    helpBg: 'Нужен е адресът на пребиваване за данъчната година.', fieldType: 'address', required: true,
    evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null, validationRule: 'address_complete', priority: 1,
  },
  {
    id: 'date_of_birth', taxYear: 2025, category: 'Лични данни', labelBg: 'Кога си роден/а?',
    fieldType: 'date', required: true, evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null,
    validationRule: 'date_of_birth', priority: 1,
  },
  {
    id: 'marital_status', taxYear: 2025, category: 'Лични данни', labelBg: 'Какво беше семейното ти положение през 2025 г.?',
    fieldType: 'single_select', required: true, evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null,
    validationRule: 'not_empty', priority: 1, options: [
      { value: 'single', labelBg: 'Неженен/неомъжена' }, { value: 'married', labelBg: 'Женен/омъжена' },
      { value: 'separated', labelBg: 'Разделен/а' }, { value: 'divorced', labelBg: 'Разведен/а' },
      { value: 'widowed', labelBg: 'Вдовец/вдовица' },
    ],
  },
  {
    id: 'tax_id', taxYear: 2025, category: 'Лични данни', labelBg: 'Имаш ли данъчния си идентификационен номер?',
    helpBg: 'Steuer-ID е 11-цифрен номер. Ако не го намираш, отбележи, че липсва — това не изтрива останалите отговори.',
    fieldType: 'text', required: true, evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null,
    validationRule: 'german_tax_id', priority: 1, placeholder: '11 цифри',
  },
  {
    id: 'religion', taxYear: 2025, category: 'Лични данни', labelBg: 'Имаше ли значение религията за Kirchensteuer?',
    helpBg: 'Ако не си сигурен/на, остави въпроса за проверка по Lohnsteuerbescheinigung.', fieldType: 'single_select', required: false,
    evidenceRequirement: noEvidence, sourceForm: 'ESt 1 A', sourceField: null, priority: 2,
    options: [{ value: 'yes', labelBg: 'Да' }, { value: 'no', labelBg: 'Не' }, { value: 'unknown', labelBg: 'Не съм сигурен/на' }],
  },

  // Employment
  { ...yesNo('worked_in_germany', 'Работа', 'Работи ли като служител в Германия през 2025 г.?', 'V1 е насочена към Arbeitnehmer.', true) },
  {
    id: 'number_of_employers', taxYear: 2025, category: 'Работа', labelBg: 'Колко работодатели имаше през 2025 г.?', fieldType: 'single_select', required: true,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: noEvidence, sourceForm: 'Anlage N', sourceField: null,
    validationRule: 'not_empty', priority: 1, options: [{ value: '1', labelBg: '1' }, { value: '2', labelBg: '2' }, { value: '3+', labelBg: '3 или повече' }],
  },
  {
    id: 'employer_name', taxYear: 2025, category: 'Работа', labelBg: 'Как се казваше основният ти работодател?', fieldType: 'text', required: true,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Arbeitsvertrag', 'Името помага да се съпоставят данните с удостоверението от работодателя.', 'Работният договор или Lohnsteuerbescheinigung.'),
    sourceForm: 'Anlage N', sourceField: null, validationRule: 'not_empty', priority: 1, placeholder: 'Име на работодателя',
  },
  {
    id: 'gross_income', taxYear: 2025, category: 'Доходи', labelBg: 'Какъв е брутният ти доход за 2025 г.?', helpBg: 'Вземи стойността от Lohnsteuerbescheinigung. Не въвеждай приблизителна сума, ако разполагаш с документа.', fieldType: 'currency', required: true,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Lohnsteuerbescheinigung 2025', 'Документът съдържа основните стойности за дохода и удържаните данъци.', 'Обикновено се предоставя от работодателя или HR/Lohnbuchhaltung след края на годината.'),
    sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 1, unit: 'EUR', placeholder: 'напр. 38400',
  },
  {
    id: 'lohnsteuer', taxYear: 2025, category: 'Доходи', labelBg: 'Колко Lohnsteuer е удържана?', fieldType: 'currency', required: true,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Lohnsteuerbescheinigung 2025', 'Това е данъкът, удържан от работодателя през годината.', 'В Lohnsteuerbescheinigung — стойността за Lohnsteuer.'),
    sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 1, unit: 'EUR', placeholder: 'напр. 5120',
  },
  {
    id: 'solidarity_surcharge', taxYear: 2025, category: 'Доходи', labelBg: 'Колко Solidaritätszuschlag е удържан?', fieldType: 'currency', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Lohnsteuerbescheinigung 2025', 'Стойността се използва само ако е посочена за твоя случай.', 'В Lohnsteuerbescheinigung.'),
    sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 2, unit: 'EUR', placeholder: '0 ако няма',
  },
  {
    id: 'church_tax', taxYear: 2025, category: 'Доходи', labelBg: 'Колко Kirchensteuer е удържана?', fieldType: 'currency', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Lohnsteuerbescheinigung 2025', 'Стойността се взема от удостоверението, когато е приложима.', 'В Lohnsteuerbescheinigung.'),
    sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 2, unit: 'EUR', placeholder: '0 ако няма',
  },
  {
    id: 'tax_class', taxYear: 2025, category: 'Доходи', labelBg: 'Коя Steuerklasse беше посочена?', fieldType: 'single_select', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Lohnsteuerbescheinigung 2025', 'Помага за проверка на удържаните данъци.', 'В Lohnsteuerbescheinigung или ELStAM данните.'),
    sourceForm: 'ESt 1 A', sourceField: null, priority: 2, options: ['I', 'II', 'III', 'IV', 'V', 'VI'].map((value) => ({ value, labelBg: `Steuerklasse ${value}` })),
  },
  {
    id: 'lohnsteuerbescheinigung', taxYear: 2025, category: 'Документи', labelBg: 'Разполагаш ли с Lohnsteuerbescheinigung 2025?', fieldType: 'single_select', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: requiredEvidence('Lohnsteuerbescheinigung 2025', 'Документът е основният източник за дохода и удържаните данъци.', 'Работодател, HR/Lohnbuchhaltung или Bescheinigungsabruf в ELSTER.'),
    sourceForm: 'Anlage N', sourceField: null, priority: 1, options: [{ value: 'yes', labelBg: 'Да' }, { value: 'later', labelBg: 'Ще го намеря по-късно' }, { value: 'no', labelBg: 'Все още не' }],
  },

  // Commuting and home office
  { ...yesNo('commuting', 'Пътуване до работа', 'Пътуваше ли до първото си работно място?', 'Разстоянието се измерва в едната посока.', false, { equals: { questionId: 'worked_in_germany', value: 'yes' } }) },
  {
    id: 'work_address', taxYear: 2025, category: 'Пътуване до работа', labelBg: 'Какъв беше адресът на работното място?', fieldType: 'address', required: false,
    conditionalRule: { equals: { questionId: 'commuting', value: 'yes' } }, evidenceRequirement: noEvidence, sourceForm: 'Anlage N', sourceField: null, priority: 2,
  },
  {
    id: 'distance_one_way_km', taxYear: 2025, category: 'Пътуване до работа', labelBg: 'Колко километра е разстоянието в една посока?', fieldType: 'number', required: false,
    conditionalRule: { equals: { questionId: 'commuting', value: 'yes' } }, evidenceRequirement: noEvidence, sourceForm: 'Anlage N', sourceField: null, validationRule: 'range_0_500', priority: 2, unit: 'km', min: 0, max: 500, placeholder: 'напр. 24',
  },
  {
    id: 'working_days', taxYear: 2025, category: 'Пътуване до работа', labelBg: 'Колко работни дни приблизително пътуваше?', fieldType: 'number', required: false,
    conditionalRule: { equals: { questionId: 'commuting', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Работен календар', 'Броят дни влияе върху проверката на пътуванията.', 'Календар, фишове или потвърждение от работодателя; пази доказателствата при поискване.'), sourceForm: 'Anlage N', sourceField: null, validationRule: 'range_0_366', priority: 2, unit: 'дни', min: 0, max: 366, placeholder: 'напр. 210',
  },
  {
    id: 'home_office_days', taxYear: 2025, category: 'Работа от вкъщи', labelBg: 'Колко дни работи от вкъщи през 2025 г.?', fieldType: 'number', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Работен календар', 'Дните трябва да могат да се обяснят, ако Finanzamt ги поиска.', 'Работен календар, график или потвърждение от работодателя.'), sourceForm: 'Anlage N', sourceField: null, validationRule: 'range_0_366', priority: 2, unit: 'дни', min: 0, max: 366, placeholder: 'напр. 60',
  },

  // Work expenses
  {
    id: 'work_expense_categories', taxYear: 2025, category: 'Разходи за работа', labelBg: 'Кои разходи, свързани с работата, имаше?', helpBg: 'Избери само категории, които действително се отнасят за теб.', fieldType: 'multi_select', required: false,
    conditionalRule: { equals: { questionId: 'worked_in_germany', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Разходни документи', 'Фактури и други доказателства може да бъдат поискани, но не е нужно да качваш всичко предварително.', 'Съхрани ги при себе си; качване се иска само при конкретно правило.'), sourceForm: 'Anlage N', sourceField: null, priority: 2,
    options: [
      { value: 'equipment', labelBg: 'Професионално оборудване' }, { value: 'computer', labelBg: 'Компютър' },
      { value: 'phone', labelBg: 'Телефон' }, { value: 'training', labelBg: 'Професионално обучение' },
      { value: 'workwear', labelBg: 'Работно облекло' }, { value: 'membership', labelBg: 'Професионални членства' },
      { value: 'other', labelBg: 'Други разходи' },
    ],
  },
  ...(['equipment_amount', 'computer_amount', 'phone_amount', 'training_amount', 'workwear_amount', 'membership_amount', 'other_work_expenses_amount'] as const).map((id) => ({
    id, taxYear: 2025, category: 'Разходи за работа', labelBg: ({ equipment_amount: 'Колко плати за професионално оборудване?', computer_amount: 'Колко плати за компютър?', phone_amount: 'Колко плати за телефон?', training_amount: 'Колко плати за обучения?', workwear_amount: 'Колко плати за работно облекло?', membership_amount: 'Колко плати за професионални членства?', other_work_expenses_amount: 'Колко бяха другите професионални разходи?' } as Record<string, string>)[id], fieldType: 'currency' as const, required: false,
    conditionalRule: { includes: { questionId: 'work_expense_categories', value: id.replace('_amount', '').replace('other_work_expenses', 'other') } }, evidenceRequirement: mayRequestEvidence('Фактура или разписка', 'Документ може да бъде поискан при проверка.', 'Съхранявай фактурата или разписката; не я качвай, освен ако не бъде поискана.'), sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 2, unit: 'EUR', placeholder: 'напр. 250',
  })),

  // Moving / double household
  { ...yesNo('job_related_move', 'Преместване', 'Премести ли се поради работа?', 'Тук е важно преместването да има връзка с работата.', false, { equals: { questionId: 'worked_in_germany', value: 'yes' } }) },
  {
    id: 'moving_expenses_amount', taxYear: 2025, category: 'Преместване', labelBg: 'Какви бяха разходите за преместването?', fieldType: 'currency', required: false,
    conditionalRule: { equals: { questionId: 'job_related_move', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Документи за преместване', 'Доказателствата може да бъдат поискани за конкретните разходи.', 'Фактури от хамали, транспорт и други свързани услуги.'), sourceForm: 'Anlage N', sourceField: null, validationRule: 'non_negative_currency', priority: 2, unit: 'EUR', placeholder: 'напр. 1200',
  },
  { ...yesNo('double_household', 'Второ жилище', 'Имаше ли второ домакинство заради работа?', 'Това е отделна и по-сложна област.', false, { equals: { questionId: 'worked_in_germany', value: 'yes' } }) },
  {
    id: 'double_household_amount', taxYear: 2025, category: 'Второ жилище', labelBg: 'Какви бяха приблизителните разходи за второто жилище?', fieldType: 'currency', required: false,
    conditionalRule: { equals: { questionId: 'double_household', value: 'yes' } }, evidenceRequirement: requiredEvidence('Договор за наем и разходи', 'Тази форма на разходи изисква отделни доказателства.', 'Договор за наем, плащания и документи за домакинството.'), sourceForm: 'Anlage N-Doppelte Haushaltsführung', sourceField: null, validationRule: 'non_negative_currency', priority: 1, unit: 'EUR', placeholder: 'напр. 6000',
  },

  // Family and benefits
  { ...yesNo('has_children', 'Семейство', 'Имаше ли деца, релевантни за данъчната декларация?', 'Ако да, ще уточним необходимите данни на следваща стъпка.', false) },
  { id: 'children_count', taxYear: 2025, category: 'Семейство', labelBg: 'Колко деца?', fieldType: 'counter', required: false, conditionalRule: { equals: { questionId: 'has_children', value: 'yes' } }, evidenceRequirement: mayRequestEvidence('Данни за децата', 'Данните могат да бъдат проверени по официални документи.', 'Geburtsurkunde, Kindergeldbescheid или други документи според случая.'), sourceForm: 'Anlage Kind', sourceField: null, validationRule: 'range_1_10', priority: 2, min: 1, max: 10, unit: 'деца' },
  { id: 'income_replacement_benefits', taxYear: 2025, category: 'Обезщетения', labelBg: 'Получаваше ли Krankengeld, Arbeitslosengeld, Elterngeld или Kurzarbeitergeld?', fieldType: 'multi_select', required: false, evidenceRequirement: mayRequestEvidence('Удостоверение за обезщетение', 'Тези плащания могат да имат значение за декларацията.', 'От здравната каса, Agentur für Arbeit или друга институция.'), sourceForm: 'Anlage N', sourceField: null, priority: 2, options: [{ value: 'krankengeld', labelBg: 'Krankengeld' }, { value: 'arbeitslosengeld', labelBg: 'Arbeitslosengeld' }, { value: 'elterngeld', labelBg: 'Elterngeld' }, { value: 'kurzarbeitergeld', labelBg: 'Kurzarbeitergeld' }, { value: 'none', labelBg: 'Нито едно' }] },
  { id: 'insurance_contributions', taxYear: 2025, category: 'Осигуровки', labelBg: 'Имаш ли данни за осигурителни вноски и пенсионни вноски?', fieldType: 'currency', required: false, evidenceRequirement: mayRequestEvidence('Годишни осигурителни удостоверения', 'Вноските се сверяват с Lohnsteuerbescheinigung и други удостоверения.', 'Работодател, здравна каса или пенсионен фонд.'), sourceForm: 'Anlage Vorsorgeaufwand', sourceField: null, validationRule: 'non_negative_currency', priority: 2, unit: 'EUR', placeholder: 'напр. 7200' },
  { id: 'supports_relatives', taxYear: 2025, category: 'Издръжка', labelBg: 'Подпомагаше ли финансово близък човек?', fieldType: 'yes_no', required: false, evidenceRequirement: mayRequestEvidence('Доказателства за издръжка', 'За тази област обикновено са нужни доказателства за лицето и плащанията.', 'Банкови преводи, документи за доходи и семейна връзка.'), sourceForm: 'Anlage Unterhalt', sourceField: null, priority: 2, options: [{ value: 'yes', labelBg: 'Да' }, { value: 'no', labelBg: 'Не' }] },
  { id: 'support_country', taxYear: 2025, category: 'Издръжка', labelBg: 'В коя държава живее човекът?', fieldType: 'text', required: false, conditionalRule: { equals: { questionId: 'supports_relatives', value: 'yes' } }, evidenceRequirement: noEvidence, sourceForm: 'Anlage Unterhalt', sourceField: null, priority: 2, placeholder: 'напр. България' },
  { id: 'support_amount', taxYear: 2025, category: 'Издръжка', labelBg: 'Каква сума изпрати през 2025 г.?', fieldType: 'currency', required: false, conditionalRule: { equals: { questionId: 'supports_relatives', value: 'yes' } }, evidenceRequirement: requiredEvidence('Банкови преводи и доказателства', 'Това е област с конкретни доказателствени изисквания.', 'Банкови извлечения и документи според държавата и случая.'), sourceForm: 'Anlage Unterhalt', sourceField: null, validationRule: 'non_negative_currency', priority: 1, unit: 'EUR', placeholder: 'напр. 2400' },

  // Explicit complex-case gates
  { ...yesNo('self_employed', 'Проверка на случая', 'Имал/а ли си самостоятелна дейност, Gewerbe или freelance доход?', 'Това не се обработва от простия Arbeitnehmer workflow.', false) },
  { ...yesNo('foreign_income', 'Проверка на случая', 'Имаше ли доходи от чужбина или работа в друга държава?', 'Чуждестранните доходи изискват отделна проверка.', false) },
  { ...yesNo('complex_rental_income', 'Проверка на случая', 'Имаше ли по-сложни доходи от наем?', 'Обикновеният служителски workflow не покрива тази област.', false) },
  { ...yesNo('complex_capital_gains', 'Проверка на случая', 'Имаше ли сложни капиталови доходи или инвестиционни сделки?', 'Това може да изисква Anlage KAP и отделен преглед.', false) },
  { ...yesNo('multiple_country_residency', 'Проверка на случая', 'Живя ли или работи ли в повече от една държава?', 'Международните случаи не се обработват автоматично в V1.', false) },

  // Additional common deductible areas
  { ...yesNo('donations', 'Други разходи', 'Прави ли дарения през 2025 г.?', 'Ще е нужно да се провери дали има дарителско удостоверение.', false) },
  { ...yesNo('household_services', 'Други разходи', 'Плащаше ли за услуги в домакинството?', 'Това може да е отделна форма и изисква проверка на плащанията.', false) },
  { ...yesNo('exceptional_burdens', 'Други разходи', 'Имаше ли извънредни тежести или значими медицински разходи?', 'Не всяка медицинска разходна позиция е призната автоматично.', false) },
]

export function matchesRule(rule: ConditionalRule | undefined, answers: TaxAnswers): boolean {
  if (!rule) return true
  if (rule.all && !rule.all.every((item) => matchesRule(item, answers))) return false
  if (rule.any && !rule.any.some((item) => matchesRule(item, answers))) return false
  if (rule.not && matchesRule(rule.not, answers)) return false
  if (rule.equals) return answers[rule.equals.questionId] === rule.equals.value
  if (rule.includes) return Array.isArray(answers[rule.includes.questionId]) && (answers[rule.includes.questionId] as string[]).includes(rule.includes.value)
  if (rule.answered) {
    const value = answers[rule.answered]
    return value !== undefined && value !== null && value !== ''
  }
  return true
}

export function visibleTaxQuestions(answers: TaxAnswers): TaxQuestion[] {
  return TAX_QUESTIONS.filter((question) => matchesRule(question.conditionalRule, answers))
}

