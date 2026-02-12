import { RESERVED_NAMES } from "../data/reservedNames"

export const normalizePath = (path: string, isFile: boolean = true): string => {
    const normalizedPath = path
        .trim()
        .replace(/\\/g, '/') // replace backslash for windows
        .replace(/\/+/g, '/') // collapse multiple slashes
        .replace(/^\/+/, '') // remove slash at the beginning

    return isFile
        ? normalizedPath.replace(/\/+$/, '') // remove slash at the end if it is file path
        : normalizedPath
}

export const sanitizeName = (name: string, type: string = 'RPGNotes'): string => {
    let sanitizedName = name.trim()
    while (sanitizedName.endsWith('.') || sanitizedName.endsWith(' ')) {
        sanitizedName = sanitizedName
            .replace(/\.+$/, '')
            .trim()
    }
    if (RESERVED_NAMES.has(sanitizedName.toUpperCase())) sanitizedName += `_${type}`
    return sanitizedName.replace(/[\\/:*?"<>|#^[\]%]/g, '-') || 'Untitled'
}

export const generateBigPathsMessage = (bigPathsWarnings: string[]) => {
    if (bigPathsWarnings.length === 0) return ''
    const initialText = 'Your file contains the following paths that are longer than 200 characters (this may be a problem on Windows):'
    const message = bigPathsWarnings.reduce((acc, currentPath) => acc + `\n${currentPath}`, initialText)
    return message
}