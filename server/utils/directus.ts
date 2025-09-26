import { createDirectus, rest } from '@directus/sdk'
import type { DirectusClient, RestClient } from '@directus/sdk'

export interface Translation {
  id: string;
  language: string;
  key: string;
  value: string;
}

let _directus : DirectusClient<any> & RestClient<any>

export const useDirectus = () => {
  if (!_directus) {
    _directus = createDirectus('https://eddb.unifr.ch/didanum9-admin').with(rest())
  }
  return _directus
}

export const dTranslate = (translations: Translation[], key: string, lang: string) => {
  const translation = translations.find(item => item.key === key && item.language === lang)
  return translation ? translation.value : ''
}

export const directusAssetUrl = (id: string): string => {
  return `https://eddb.unifr.ch/didanum9-admin/assets/${id}`
}