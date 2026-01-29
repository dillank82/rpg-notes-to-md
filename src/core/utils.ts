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

export const generateNoteContent = (tags: string, description: string, body: string, notes: string) => {
    return `
        ---
        tags: [${tags}]
        ---
        ${description}
        \n# Description\n${body}
        \n${notes}
        \n#Connections
    `
}