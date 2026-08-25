import assert from 'node:assert/strict'
import test from 'node:test'
import { TAX_QUESTIONS, type TaxAnswers } from '../lib/tax/schema.ts'
import { getMissingInformation } from '../lib/tax/missing.ts'
import { selectForms } from '../lib/tax/form-selection.ts'
import { MAPPING_CANDIDATES } from '../lib/tax/form-mappings.ts'
import { prepareOfficialPdfGeneration } from '../lib/tax/pdf.ts'
import { detectComplexCase, validateTaxCase } from '../lib/tax/validation.ts'

const employeeBase: TaxAnswers = {
  full_name: 'Ivan Ivanov',
  address: { street: 'Hauptstraße 1', postalCode: '80331', city: 'München', country: 'Deutschland' },
  date_of_birth: '1990-01-01',
  marital_status: 'single',
  tax_id: '12345678901',
  worked_in_germany: 'yes',
  number_of_employers: '1',
  employer_name: 'Muster GmbH',
  gross_income: 38400,
  lohnsteuer: 5120,
  lohnsteuerbescheinigung: 'yes',
}

test('single employee selects ESt 1 A and Anlage N only', () => {
  const forms = selectForms('case-a', employeeBase).selected.map((form) => form.formId)
  assert.deepEqual(forms, ['est1a', 'anlage-n'])
})

test('family and insurance answers select the explicit additional forms', () => {
  const forms = selectForms('case-b', { ...employeeBase, has_children: 'yes', insurance_contributions: 7200 }).selected.map((form) => form.formId)
  assert.deepEqual(forms, ['est1a', 'anlage-n', 'anlage-kind', 'vorsorgeaufwand'])
})

test('income replacement benefits do not invent a form', () => {
  const forms = selectForms('case-c', { ...employeeBase, income_replacement_benefits: ['krankengeld'] }).selected.map((form) => form.formId)
  assert.deepEqual(forms, ['est1a', 'anlage-n'])
})

test('double household selects the dedicated Anlage N form', () => {
  const forms = selectForms('case-d', { ...employeeBase, double_household: 'yes' }).selected.map((form) => form.formId)
  assert.deepEqual(forms, ['est1a', 'anlage-n', 'anlage-n-doppelte-haushaltsfuehrung'])
})

test('self-employed users are blocked from the employee flow', () => {
  assert.deepEqual(detectComplexCase({ ...employeeBase, self_employed: 'yes' }), ['Самостоятелна дейност или Gewerbe'])
})

test('required missing answers are blocking but optional unanswered questions remain optional', () => {
  const missing = getMissingInformation(TAX_QUESTIONS, { worked_in_germany: 'yes' }, [])
  assert.equal(missing.some((item) => item.questionId === 'full_name' && item.severity === 'BLOCKING'), true)
  assert.equal(missing.some((item) => item.questionId === 'work_expense_categories' && item.severity === 'OPTIONAL'), true)
})

test('validation catches impossible numeric values', () => {
  const issues = validateTaxCase(TAX_QUESTIONS, { ...employeeBase, commuting: 'yes', working_days: 500 }, [])
  assert.equal(issues.some((item) => item.code === 'invalid_days' && item.severity === 'ERROR'), true)
})

test('form generation remains blocked until official mapping is verified', () => {
  const forms = selectForms('case-a', employeeBase).selected
  const result = prepareOfficialPdfGeneration(forms)
  assert.equal(result.ok, false)
  assert.equal(result.status, 'blocked_unverified')
  assert.equal(MAPPING_CANDIDATES.every((mapping) => mapping.officialFieldId === null), true)
})

