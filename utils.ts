export const normalizePath = (path: string, isFile: boolean = true): string => {
    const normalizedPath = path
        .replace(/\\/g, '/') // replace backslash for windows
        .replace(/\/+/g, '/') // collapse multiple slashes
        .replace(/^\/+/, '') // remove slash at the beginning

    return isFile
        ? normalizedPath.replace(/\/+$/, '') // remove slash at the end if it is file path
        : normalizedPath
}