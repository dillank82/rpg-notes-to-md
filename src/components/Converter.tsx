import { useState } from "react"
import { useConverter } from "../hooks/useConverter"
import { FileSelector } from "./FileSelector"
import { Button } from "./Button"

export const Converter = () => {
    const [file, setFile] = useState<File | null>(null)
    const { convert, status, error, downloadUrl } = useConverter()
    return (
        <main className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-6">
            {(status === 'idle' || status === 'error') && (
                <FileSelector onFileSelect={setFile} />
            )}

            {status === 'processing' && <p>Converting...</p>}

            {status === 'success' && downloadUrl && (
                <div>
                    <p>Done! Your archive is ready for migration.</p>
                    <a href={downloadUrl} download="obsidian_vault.zip">
                        Download .zip
                    </a>
                    <button onClick={() => window.location.reload()}>Start again</button>
                </div>
            )}

            {error && <div className="error-toast">{error}</div>}

            <Button 
                onClick={async () => { await convert(file) }}
                isLoading={!file}
            >
                Convert
            </Button>
        </main>
    )
}      