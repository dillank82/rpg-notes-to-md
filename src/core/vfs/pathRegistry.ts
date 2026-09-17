import i18n from "../../locales/i18n"

export class PathRegistry {
    maxAttemps: number
    bigPaths: string[] = []
    private occupiedPaths = new Set<string>()
    constructor(maxAttepmsToResolvePath: number = 1000) {
        this.maxAttemps = maxAttepmsToResolvePath
    }

    resolve(basePath: string): string {
        let finalPath = basePath
        let counter = 1
        while (this.occupiedPaths.has(finalPath.toLowerCase())) {
            finalPath = basePath.replace(/.md$/, `-${counter}.md`)
            counter++
            if (counter > this.maxAttemps) throw new Error (i18n.t('errors:uniquePathMaxAttemptsExceeded', basePath))
        }
        this.occupiedPaths.add(finalPath.toLowerCase())
        if (finalPath.length > 200) this.bigPaths.push(finalPath)
        return finalPath
    }
}