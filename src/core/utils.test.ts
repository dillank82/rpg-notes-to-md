import { normalizePath } from "./utils"

describe('normalizePath', () => {
    it('should replace backslashes with forward slashes; collapse multiple slashes; remove slash at the beginning; remove slash at the end if it is file path; trim whitespaces', () => {
        const testPath = '   \\testFolder\\testFile.test\\\\      '
        expect(normalizePath(testPath)).toBe('testFolder/testFile.test')
    })
    it ('should keep slash at the end if isFile is false', () => {
        const testPath = 'folder/'
        expect(normalizePath(testPath, false)).toBe(testPath)
    })
    it('the second function should not change the result of the first one', () => {
        const testPath = '   \\testFolder\\testFile.test\\\\      '
        const firstRun = normalizePath(testPath)
        const secondRun = normalizePath(firstRun)
        expect(firstRun).toBe(secondRun)
    })
}) 