import { useState } from "react"
import { useConverter } from "../hooks/useConverter"
import { FileSelector } from "./FileSelector"
import { Button } from "./Button"
import { MessageBox } from "./MessageBox"

export const Converter = () => {
    const [file, setFile] = useState<File | null>(null)
    const { convert, status, error, downloadUrl } = useConverter()
    return (
        <main className="
            w-full max-w-2xl h-full bg-white shadow-sm p-6 flex flex-col items-center
            md:rounded-xl
        ">
            {(status === 'idle' || status === 'error') && (
                <FileSelector onFileSelect={setFile} />
            )}

            {status === 'processing' && <MessageBox><p>Converting...</p></MessageBox>}

            {status === 'success' && downloadUrl && (
                <MessageBox>
                    <div>
                        <p>Done! Your archive is ready for migration.</p>
                        <a href={downloadUrl} download="obsidian_vault.zip">
                            Download .zip
                        </a>
                        <Button onClick={() => window.location.reload()}>Start again</Button>
                    </div>
                </MessageBox>
            )}

            {error && <MessageBox variant="error"><p>{error}</p></MessageBox>}

            {(status === 'idle' || status === 'error') && (
                <Button
                    onClick={async () => { await convert(file) }}
                    isLoading={!file}
                >
                    Convert
                </Button>
            )}
        </main>
    )
}      