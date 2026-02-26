import { WritableComputedRef } from 'vue'
import { I18n, createI18n } from 'vue-i18n'

import en from '@renderer/locales/en/labels.json'
import enPrimevue from '@renderer/locales/en/primevue.json'
import it from '@renderer/locales/it/labels.json'
import itPrimevue from '@renderer/locales/it/primevue.json'

import { PrimeVueConfiguration } from 'primevue/config'

let i18n: I18n

const primeVueLocales = { en: enPrimevue, it: itPrimevue }

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

export function setI18nLanguage(locale: string, primevue: { config: PrimeVueConfiguration }) {
  const globalLocale = i18n.global.locale as WritableComputedRef<string>
  globalLocale.value = locale
  document.querySelector('html')?.setAttribute('lang', locale)
  if (primeVueLocales[locale]) {
    Object.keys(primeVueLocales[locale]).forEach(key => {
      if (primevue.config.locale && primevue.config.locale[key])
        primevue.config.locale[key] = primeVueLocales[locale][key]
    })
  }
}
