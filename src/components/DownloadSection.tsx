import { Button } from "./Button"

interface DownloadSectionProps {
    downloadUrl: string
}
export const DownloadSection = ({ downloadUrl }: DownloadSectionProps) => {
    return (
        <div>
            <p>Done! Your archive is ready for migration.</p>
            <Button as="a" href={downloadUrl} download="obsidian_vault.zip">Download .zip</Button>
            <Button as="button" onClick={() => window.location.reload()}>Start again</Button>
        </div>
    )
}