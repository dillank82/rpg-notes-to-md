export class PathRegistry {
    private occupiedPaths = new Set<string>()

    resolve(basePath: string): string {
        let finalPath = basePath
        let counter = 1
        while (this.occupiedPaths.has(finalPath.toLowerCase())) {
            finalPath = basePath.replace(/.md$/, `-${counter}.md`)
            counter++
        }
        this.occupiedPaths.add(finalPath.toLowerCase())
        return finalPath
    }
}