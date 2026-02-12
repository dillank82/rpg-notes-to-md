import { generateNoteContent } from "./generateNoteContent"

describe('generateNoteContent', () => {
    it('should create correct .md file structure', () => {
        const tags = ['Tag', 'Elf', 'Another tag'].join(', ')
        const description = 'Chosen by Elephant'
        const body = 'B\nO\nD\nY'
        const notes = ['> First Note', '> Second Note', '> Death Note'].join('\n')
        expect(generateNoteContent(tags, description, body, notes)).toMatchInlineSnapshot(`
          "---
          tags: [Tag, Elf, Another tag]
          ---
          Chosen by Elephant
          # Description
          B
          O
          D
          Y
          > First Note
          > Second Note
          > Death Note"
        `)
    })
    it('should not add frontmatter if no tags', () => {
        const tags = ''
        const description = 'Faith'
        const body = 'Hope'
        const notes = ['> Love'].join('\n')
        expect(generateNoteContent(tags, description, body, notes)).toMatchInlineSnapshot(`
          "Faith
          # Description
          Hope
          > Love"
        `)
    })
})