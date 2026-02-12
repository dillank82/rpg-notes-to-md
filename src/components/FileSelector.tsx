import { FileCheck, FilePlus } from "lucide-react"
import { ChangeEvent, DragEvent, useEffect, useState } from "react"
import { Button } from "./Button"

interface FileSelectorProps {
    onFileSelect: (file: File) => void
    onError: (message: string) => void
}

export const FileSelector = ({ onFileSelect, onError }: FileSelectorProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isJSON, setIsJSON] = useState<boolean | null>(null)
    const [, setDragCounter] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    useEffect(() => {
        const handleWindowDragEnter = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(prev => prev + 1)
            setIsDragging(true)
            if (e.dataTransfer.items[0].type === 'application/json') {
                setIsJSON(true)
            } else {
                setIsJSON(false)
            }
        }

        const handleWindowDragLeave = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(prev => {
                const newCount = prev - 1
                if (newCount <= 0) {
                    setIsDragging(false)
                    setIsJSON(null)
                    return 0
                }
                return newCount
            })
        }

        const handleWindowDrop = (e: globalThis.DragEvent) => {
            e.preventDefault()
            setDragCounter(0)
            setIsDragging(false)
            setIsJSON(null)
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
        setSelectedFile(file)
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

    const dragStyles = {
        active: 'border-violet-500 bg-violet-50',
        error: 'border-red-500 bg-red-50',
        default: 'border-gray-300'
    }
    const activeStyles = isDragging ? (isJSON ? dragStyles.active : dragStyles.error) : dragStyles.default
    return (
        <div
            onDrop={handleDrop}
            className={`border-2 border-dashed transition-colors rounded-sm w-[85%] ${activeStyles}`}
        >
            <label htmlFor="file-upload" className="cursor-pointer focus-within:ring-2 w-full p-10 flex flex-col items-center text-center" aria-live="polite">
                <input
                    type="file"
                    id="file-upload"
                    accept=".json"
                    onChange={(e) => { handleFileChange(e) }}
                    className="sr-only"
                />
                {isDragging
                    ? (isJSON ? "Drop file here" : "You need to choose .json file")
                    : (selectedFile ? "File uploaded and ready to convertation" : "Choose export file from RPG Notes (.json)")}
                {selectedFile
                    ? (
                        <>
                            <FileCheck
                                size={100}
                                strokeWidth={0.8}
                                color={isDragging ? (isJSON ? 'oklch(60.6% 0.25 292.717)' : 'oklch(63.7% 0.237 25.331)') : 'oklch(60.6% 0.25 292.717)'}
                            />
                            <p className="mt-4">{selectedFile.name}</p>
                            <Button as="button" color="white" onClick={() => setSelectedFile(null)}>Remove file and choose another</Button>
                        </>
                    ) : (
                        <FilePlus
                            size={100}
                            strokeWidth={0.8}
                            color={isDragging ? (isJSON ? 'oklch(60.6% 0.25 292.717)' : 'oklch(63.7% 0.237 25.331)') : 'oklch(75% 0.01 258.338)'}
                        />
                    )
                }
            </label>
        </div>
    )
}