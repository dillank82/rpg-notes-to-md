import { CampaignsData } from "../../schemas/RPGNotesData.schema"
import { generateNoteContent, normalizeTagName } from "./generateNoteContent"

describe('normalizeTagName', () => {
  const campaignName = 'Test Campaign'
  const createTag = (overrides: Partial<CampaignsData['subjectTags'][number]>): CampaignsData['subjectTags'][number] => {
    return {
      id: 1,
      name: 'default-name',
      isGlobal: true,
      ...overrides
    }
  }
  it('should return valid global tag unchanged', () => {
    const tag = createTag ({ name: 'Mansion', isGlobal: true })
    expect(normalizeTagName(tag, campaignName)).toBe(tag.name)
  })
  it('should replace invalid characters with underscores', () => {
    const tag = createTag ({ name: 'c*h!a@r#a$c%t^e&r(s)', isGlobal: true })
    expect(normalizeTagName(tag, campaignName)).toBe('c_h_a_r_a_c_t_e_r_s_')
  })
  it('should add normalized campaign name to local tags', () => {
    const tag = createTag ({ name: 'Phantom', isGlobal: false })
    expect(normalizeTagName(tag, campaignName)).toBe(`${tag.name}/Test_Campaign`)
  })
  it('should add underscore if tag starts with a number', () => {
    const tag = createTag ({ name: '1000', isGlobal: true })
    expect(normalizeTagName(tag, campaignName)).toBe(`_${tag.name}`)
  })
  it('should strip leading hashes, slashes and spaces', () => {
    const tag = createTag ({ name: '  ##/Thunder', isGlobal: true })
    expect(normalizeTagName(tag, campaignName)).toBe('Thunder')
  })
  it('should collapse multiple slashes and trim trailing slashes', () => {
    const tag = createTag ({ name: 'Elephant//', isGlobal: false })
    const invalidCampaignName = campaignName + '///'
    expect(normalizeTagName(tag, invalidCampaignName)).toBe('Elephant/Test_Campaign')
  })
  it('should handle complex mixed cases', () => {
    const tag = createTag ({ name: ' 1. Important Tag! ', isGlobal: false })
    expect(normalizeTagName(tag, campaignName)).toBe('_1__Important_Tag_/Test_Campaign')
  })
})

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