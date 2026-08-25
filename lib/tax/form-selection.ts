import type { TaxAnswers } from './schema.ts'
import { FORM_DEFINITIONS, type FormId } from './forms/2025/index.ts'
import type { TaxFormAssignmentRecord } from './persistence.ts'

export type SelectedForm = {
  formId: FormId
  officialName: string
  reasonBg: string
  mappingStatus: 'unverified'
}

export function selectForms(caseId: string, answers: TaxAnswers): { selected: SelectedForm[]; records: TaxFormAssignmentRecord[] } {
  const selected: SelectedForm[] = []
  const add = (formId: FormId, reasonBg: string) => {
    const definition = FORM_DEFINITIONS[formId]
    if (selected.some((item) => item.formId === formId)) return
    selected.push({ formId, officialName: definition.officialName, reasonBg, mappingStatus: definition.mappingStatus })
  }

  if (answers.worked_in_germany === 'yes') {
    add('est1a', 'Основен формуляр за лице с пребиваване/работа в Германия.')
    add('anlage-n', 'Нужен за доходи от несамостоятелна работа и професионални разходи.')
  }
  if (answers.has_children === 'yes') add('anlage-kind', 'Избран е заради посочени деца.')
  if (answers.insurance_contributions !== undefined) add('vorsorgeaufwand', 'Избран е заради посочени осигурителни/пенсионни вноски.')
  if (answers.donations === 'yes') add('sonderausgaben', 'Избран е заради посочени дарения.')
  if (answers.exceptional_burdens === 'yes') add('aussergewoehnliche-belastungen', 'Избран е заради посочени извънредни тежести.')
  if (answers.household_services === 'yes') add('haushaltsnahe-aufwendungen', 'Избран е заради посочени услуги в домакинството.')
  if (answers.double_household === 'yes') add('anlage-n-doppelte-haushaltsfuehrung', 'Избран е заради посочено второ домакинство за работа.')
  if (answers.supports_relatives === 'yes') add('anlage-unterhalt', 'Избран е заради посочена финансова издръжка на близък човек.')

  return {
    selected,
    records: selected.map((item) => ({
      id: `${caseId}_${item.formId}`,
      tax_case_id: caseId,
      form_id: item.formId,
      tax_year: 2025,
      reason_bg: item.reasonBg,
      selection_status: 'selected',
    })),
  }
}

