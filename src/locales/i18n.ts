import appRu from './ru/app.json'
import errorsRu from './ru/errors.json'
import appEn from './en/app.json'
import errorsEn from './en/errors.json'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    ru: {
        app: appRu,
        errors: errorsRu
    },
    en: {
        app: appEn,
        errors: errorsEn
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'app',
        ns: ['app, errors'],
        interpolation: {
            escapeValue: false
        }
    })

export default i18next