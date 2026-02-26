import { WritableComputedRef } from 'vue'
import { I18n, createI18n } from 'vue-i18n'

import en from '@renderer/locales/en.json'
import it from '@renderer/locales/it.json'

let i18n: I18n

export function setupI18n() {
  i18n = createI18n({
    fallbackLocale: 'en',
    locale: 'en',
    legacy: false,
    globalInjection: true,
    messages: { en, it }
  })
  return i18n
}

export function setI18nLanguage(locale: string) {
  const globalLocale = i18n.global.locale as WritableComputedRef<string>
  globalLocale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
}
