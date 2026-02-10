export class PathRegistry {
    maxAttemps: number
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
            if (counter > this.maxAttemps) throw new Error (`Failed to resolve unique file path for "${basePath}" after 1000 attempts.`)
        }
        this.occupiedPaths.add(finalPath.toLowerCase())
        return finalPath
    }
}