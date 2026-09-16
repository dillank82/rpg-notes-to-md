import commonRu from './ru/converter.json'
import commonEn from './en/converter.json'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    ru: {
        converter: commonRu
    },
    en: {
        converter: commonEn
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'converter',
        ns: ['converter'],
        interpolation: {
            escapeValue: false
        }
    })

export default i18next