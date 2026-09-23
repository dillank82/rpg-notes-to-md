import { useTranslation } from "react-i18next"
import { Button } from "./Button"

interface DownloadSectionProps {
    downloadUrl: string
}
export const DownloadSection = ({ downloadUrl }: DownloadSectionProps) => {
    const { t } = useTranslation()
    return (
        <div >
            <p className="text-center">{t('download.done')}</p>
            <div className="flex flex-col items-center">
                <Button as="a" href={downloadUrl} download="obsidian_vault.zip">{t('download.download')}</Button>
                <Button as="button" color="white" onClick={() => window.location.reload()}>{t('download.startAgain')}</Button>
            </div>
        </div>
    )
}