import { useState } from "react"
import { useConverter } from "../hooks/useConverter"
import { FileSelector } from "./FileSelector"
import { Button } from "./Button"
import { MessageBox } from "./MessageBox"
import { DownloadSection } from "./DownloadSection"

export const Converter = () => {
    const [file, setFile] = useState<File | null>(null)
    const { convert, status, warnings, error, setError, downloadUrl } = useConverter()
    return (
        <main className="
            w-full max-w-3xl bg-white p-6 flex flex-col items-center
            md:rounded-xl md:shadow-sm md:justify-center md:my-3
            lg:h-[75%]
        ">
            {(status === 'idle' || status === 'error') && (
                <FileSelector onFileSelect={setFile} onError={setError} />
            )}

            {status === 'processing' && <MessageBox><p>Converting...</p></MessageBox>}

            {status === 'success' && downloadUrl && (
                <MessageBox>
                    <DownloadSection downloadUrl={downloadUrl}/>
                    {warnings && <MessageBox variant="warning"><p>{warnings}</p></MessageBox>}
                </MessageBox>
            )}

            {error && <MessageBox variant="error"><p>{error}</p></MessageBox>}

            {(status === 'idle' || status === 'error') && (
                <Button
                    onClick={async () => { await convert(file) }}
                    disabled={!file}
                    as="button"
                >
                    Convert
                </Button>
            )}
        </main>
    )
}      