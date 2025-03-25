export type RequestType = {
  name: string,
  phone: string,
  service?: string,
  type: RequestTypeType,
}

export type RequestTypeType = 'order' | 'consultation'
