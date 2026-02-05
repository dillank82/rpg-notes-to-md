import { Button } from "./Button"

interface DownloadSectionProps {
    downloadUrl: string
}
export const DownloadSection = ({ downloadUrl }: DownloadSectionProps) => {
    return (
        <div>
            <p>Done! Your archive is ready for migration.</p>
            <a href={downloadUrl} download="obsidian_vault.zip">
                Download .zip
            </a>
            <Button as="button" onClick={() => window.location.reload()}>Start again</Button>
        </div>
    )
}