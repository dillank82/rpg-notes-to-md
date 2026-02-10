import { PathRegistry } from "./pathRegistry"

describe('pathRegistry', () => {
    it('should return valid path unchanged if registry is empty', () => {
        const registry = new PathRegistry()
        expect(registry.resolve('path')).toBe('path')
    })
    it('should return a sequence of different valid paths unchanged', () => {
        const registry = new PathRegistry()
        const path1 = registry.resolve('a')
        const path2 = registry.resolve('b')
        expect(path1).toBe('a')
        expect(path2).toBe('b')
    })
    it('should resolve a single collision', () => {
        const registry = new PathRegistry()
        const path1 = registry.resolve('note.md')
        const path2 = registry.resolve('note.md')
        expect(path1).toBe('note.md')
        expect(path2).toBe('note-1.md')
    })
    it('should resolve a multiple collision', () => {
        const registry = new PathRegistry()
        registry.resolve('note.md')
        registry.resolve('note.md')
        expect(registry.resolve('note.md')).toBe('note-2.md')
    })
    it('should not duplicate occupied suffixes when resolving collisions', () => {
        const registry = new PathRegistry()
        registry.resolve('note.md')
        registry.resolve('note-1.md')
        expect(registry.resolve('note.md')).toBe('note-2.md')
    })
    it('should compare paths case-insensitively', () => {
        const registry = new PathRegistry()
        registry.resolve('note.md')
        expect(registry.resolve('NoTE.md')).toBe('NoTE-1.md')
    })
    it('should work correctly with .md in the file name', () => {
        const registry = new PathRegistry()
        registry.resolve('note.md.md')
        expect(registry.resolve('note.md.md')).toBe('note.md-1.md')
    })
    it('should throw Error after max number of attempts to resolve unique path in loop', () => {
        const registry = new PathRegistry(10)
        for (let i = 1; i <= 10; i++) {
            registry.resolve('note.md')
        }
        expect(() => { registry.resolve('note.md') }).toThrowError()
    })
})