import { Document } from 'mongoose'

export interface ITranslation {
  [key: string]: string
}

export interface IFAQ extends Document {
  question: ITranslation
  answer: ITranslation
  isActive: boolean
  getTranslation(field: 'question' | 'answer', language?: string): string
  createdAt: Date
  updatedAt: Date
}