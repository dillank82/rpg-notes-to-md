import { FilePlus } from "lucide-react"
import { ChangeEvent, DragEvent, useEffect, useState } from "react"

interface FileSelectorProps {
    onFileSelect: (file: File) => void
    onError: (message: string) => void
}

export const FileSelector = ({ onFileSelect, onError }: FileSelectorProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const [, setDragCounter] = useState(0)

    useEffect(() => {
        const handleWindowDragEnter = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(prev => prev + 1)
            setIsDragging(true)
        }

        const handleWindowDragLeave = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(prev => {
                const newCount = prev - 1
                if (newCount <= 0) {
                    setIsDragging(false)
                    return 0
                }
                return newCount
            })
        }

        const handleWindowDrop = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(0)
            setIsDragging(false)
        }

        window.addEventListener('dragenter', handleWindowDragEnter)
        window.addEventListener('dragleave', handleWindowDragLeave)
        window.addEventListener('dragover', (e) => e.preventDefault())
        window.addEventListener('drop', handleWindowDrop)

        return () => {
            window.removeEventListener('dragenter', handleWindowDragEnter)
            window.removeEventListener('dragleave', handleWindowDragLeave)
            window.removeEventListener('dragover', (e) => e.preventDefault())
            window.removeEventListener('drop', handleWindowDrop)
        }
    }, [])

    const processFile = (file: File) => {
        if (file.type !== "application/json" && !file.name.endsWith('.json')) {
            onError("App works only with .json files")
            return
        }
        onFileSelect(file)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file) processFile(file)
    }
    return (
        <div
            onDrop={handleDrop}
            className={`border-2 border-dashed transition-colors rounded-sm w-[85%] min-h-[235px] ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
        >
            <label htmlFor="file-upload" className="cursor-pointer focus-within:ring-2 w-full h-full p-10 flex flex-col items-center" aria-live="polite">
                {isDragging
                    ? "Drop file here"
                    : "Choose export file from RPG Notes (.json)"}

                <input
                    type="file"
                    id="file-upload"
                    accept=".json"
                    onChange={(e) => { handleFileChange(e) }}
                    className="sr-only"
                />
                <FilePlus
                    size={100}
                    strokeWidth={0.8}
                    color={isDragging ? 'oklch(62.5% 0.214 259.815)' : 'oklch(75% 0.01 258.338)'}
                />
            </label>
        </div>
    )
}