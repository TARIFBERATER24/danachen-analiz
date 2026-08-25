export type FormId =
  | 'est1a'
  | 'anlage-n'
  | 'anlage-kind'
  | 'vorsorgeaufwand'
  | 'sonderausgaben'
  | 'aussergewoehnliche-belastungen'
  | 'haushaltsnahe-aufwendungen'
  | 'anlage-n-doppelte-haushaltsfuehrung'
  | 'anlage-unterhalt'

export type FormDefinition = {
  formId: FormId
  year: 2025
  officialName: string
  officialSource: string
  retrievedAt: string
  formVersion: string
  mappingStatus: 'unverified'
  fields: never[]
}

/**
 * These are catalog entries only. Official line/field identifiers are deliberately
 * not invented. They must be inspected against the current FMS/ELSTER artifacts
 * before PDF generation is enabled.
 */
export const FORM_DEFINITIONS: Record<FormId, FormDefinition> = {
  est1a: {
    formId: 'est1a', year: 2025, officialName: 'ESt 1 A — Einkommensteuererklärung unbeschränkte Steuerpflicht',
    officialSource: 'https://www.elster.de/eportal/formulare-leistungen/alleformulare/est', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'anlage-n': {
    formId: 'anlage-n', year: 2025, officialName: 'Anlage N — Einkünfte aus nichtselbständiger Arbeit',
    officialSource: 'https://formulare-bfinv.de/', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'anlage-kind': {
    formId: 'anlage-kind', year: 2025, officialName: 'Anlage Kind',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  vorsorgeaufwand: {
    formId: 'vorsorgeaufwand', year: 2025, officialName: 'Anlage Vorsorgeaufwand',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  sonderausgaben: {
    formId: 'sonderausgaben', year: 2025, officialName: 'Anlage Sonderausgaben',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'aussergewoehnliche-belastungen': {
    formId: 'aussergewoehnliche-belastungen', year: 2025, officialName: 'Anlage Außergewöhnliche Belastungen',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'haushaltsnahe-aufwendungen': {
    formId: 'haushaltsnahe-aufwendungen', year: 2025, officialName: 'Anlage Haushaltsnahe Aufwendungen',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'anlage-n-doppelte-haushaltsfuehrung': {
    formId: 'anlage-n-doppelte-haushaltsfuehrung', year: 2025, officialName: 'Anlage N-Doppelte Haushaltsführung',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
  'anlage-unterhalt': {
    formId: 'anlage-unterhalt', year: 2025, officialName: 'Anlage Unterhalt',
    officialSource: 'https://www.elster.de/eportal/start?locale=de_DE&themaGlobal=formulare_eop', retrievedAt: '2026-08-25', formVersion: '2025 catalog entry; field mapping unverified', mappingStatus: 'unverified', fields: [],
  },
}

