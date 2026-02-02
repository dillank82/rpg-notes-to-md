import { ChangeEvent } from "react"

export const FileSelector = () => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (!file) return
    }
    return (
        <div>
            <label htmlFor="file-upload">Выберите файл экспорта из RPG Notes (.json):</label>
            <input 
                type="file"
                id="file-upload"
                accept=".json"
                onChange={(e) => {handleFileChange(e)}}
            />
        </div>
    )
}