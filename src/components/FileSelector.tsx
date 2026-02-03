import { ChangeEvent, DragEvent, useState } from "react"

interface FileSelectorProps {
    onFileSelect: (file: File) => void
}

export const FileSelector = ({ onFileSelect }: FileSelectorProps) => {
    const [isDragging, setIsDragging] = useState(false)
    
    const processFile = (file: File) => {
        if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        alert("App works only with .json files")
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
            className={`border-2 border-dashed p-10 transition-colors ${
             isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
        >
            <label htmlFor="file-upload" className="cursor-pointer focus-within:ring-2" aria-live="polite">
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
            </label>
            
        </div>
    )
}