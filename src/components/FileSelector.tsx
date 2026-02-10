import { FilePlus } from "lucide-react"
import { ChangeEvent, DragEvent, useState } from "react"

interface FileSelectorProps {
    onFileSelect: (file: File) => void
    onError: (message: string) => void
}

export const FileSelector = ({ onFileSelect, onError }: FileSelectorProps) => {
    const [isDragging, setIsDragging] = useState(false)
    
    const processFile = (file: File) => {
        if (file.type !== "application/json" && !file.name.endsWith('.json')) {
            onError("App works only with .json files")
            return
        }
        onFileSelect(file)
    }
    
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file) processFile(file)
    }
    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed transition-colors rounded-sm w-[85%] min-h-[235px] ${
             isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
                    onChange={(e) => {handleFileChange(e)}}
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