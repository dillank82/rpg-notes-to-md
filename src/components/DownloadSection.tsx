import { Button } from "./Button"

interface DownloadSectionProps {
    downloadUrl: string
}
export const DownloadSection = ({ downloadUrl }: DownloadSectionProps) => {
    return (
        <div >
            <p className="text-center">Done! Your archive is ready for migration.</p>
            <div className="flex flex-col items-center">
                <Button as="a" href={downloadUrl} download="obsidian_vault.zip">Download .zip</Button>
                <Button as="button" color="white" onClick={() => window.location.reload()}>Start again</Button>
            </div>
        </div>
    )
}