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

export const sanitizeName = (name: string): string => name
    .trim()
    .replace(/\.+$/, '')
    .trim()
    .replace(/[\\/:*?"<>|#^[\]%]/g, '-')
    || 'Untitled'