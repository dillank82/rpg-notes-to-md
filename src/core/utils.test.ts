import { normalizePath, sanitizeName } from "./utils"

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

describe('sanitizeName', () => {
    it('should keep valid names', () => {
        const validName = 'Normal Name of Some-Char_01'
        expect(sanitizeName(validName)).toBe(validName)
    })
    it('should trim the spaces at the edges', () => {
        expect(sanitizeName('   name        ')).toBe('name')
    })
    it('should remove dots and spaces only at the end', () => {
        expect(sanitizeName('t.e.x.t with whitespaces ...  . .   .. . ')).toBe('t.e.x.t with whitespaces')
    })
    it('should replace prohibited characters with a hyphen', () => {
        expect(sanitizeName('\\1/2:3*4?5"6<7>8|9#10^11[12]13%14')).toBe('-1-2-3-4-5-6-7-8-9-10-11-12-13-14')
    })
    it('should return "Untitled" if the result is empty', () => {
        expect(sanitizeName('.. . . .    .')).toBe('Untitled')
    })
})