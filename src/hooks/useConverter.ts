import { useState } from "react"
import { converterPipeline } from "../core/converterPipeline"
import { useTranslation } from "react-i18next"

export const useConverter = () => {
    const { t } = useTranslation()
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [warnings, setWarnings] = useState<string | null>(null)

    const convert = async(file: File) => {
        setStatus('processing')
        setError(null)
        setWarnings(null)

        try {
            const { blob, bigPathsMessage } = await converterPipeline(file)
        
            const url = URL.createObjectURL(blob)
            setDownloadUrl(url)
            setStatus('success')
            setWarnings(bigPathsMessage)
        } catch(err) {
            setError(err instanceof Error ? err.message : t('errors:unknownError'))
            setStatus('error')
        }
    }

    return { convert, status, warnings, error, setError, downloadUrl }
}