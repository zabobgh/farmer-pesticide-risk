export interface ChemItem {
  trade: string
  common: string
}

export interface FormData {
  id_card: string
  prefix: string
  fullname: string
  gender: string
  age: string | number
  address: string
  tambon: string
  amphoe: string
  province: string
  road: string
  occupation: string
  crop_category: string
  crop_detail: string
  involvement: string[]
  hospital: string
  survey_date: string
  interviewer: string
  interviewer_pos: string

  answers: Record<number, number>

  symptoms_g1: string[]
  symptoms_g2: string[]
  symptoms_g3: string[]

  disease: string[]
  med_pyridostigmine: string
  last_exposure: string
  days_per_month: string
  chem_purpose: string[]
  chems: ChemItem[]
  blood_result: string
}

export interface QuestionItem {
  n: number
  t: string
}

export interface OptionItem {
  l: string
  v: number
  c: string
}

export interface RiskMeta {
  cls: string
  icon: string
  action: string
  blood: boolean
}

export interface RiskResult {
  risk: string
  meta: RiskMeta
}

export interface DraftInfo {
  fullname: string
  time: string
}
