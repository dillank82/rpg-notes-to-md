import { useTranslation } from "react-i18next"
import { languageNames, languages } from "../locales/i18n"

export const LanguagesSelect: React.FC = () => {
    const { i18n } = useTranslation()
    return (
        <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
            {languages.map((lang) => (
                <option key={lang} value={lang}>{languageNames[lang]}</option>
            ))}
        </select>
    )
}