import { RPGNotesDataMaps } from "../../interfaces/RPGNotesData"
import { CampaignsData } from "../../schemas/RPGNotesData.schema"
import { buildStructure } from "./VFSBuilder"

describe('VFSBuilder', () => {
    const createMockData = (overrides = {}): CampaignsData => ({
        campaigns: [],
        categories: [],
        connections: [],
        storyNotes: [],
        subjectNotes: [],
        subjects: [],
        subjectTagsAttachments: [],
        subjectTags: [],
        ...overrides
    })
    const createMockMaps = (overrides = {}): RPGNotesDataMaps => ({
        categoriesByParentId: new Map<unknown, CampaignsData['categories']>(),
        subjectsByCategory: new Map<unknown, CampaignsData['subjects']>(),
        notesBySubject: new Map<unknown, CampaignsData['subjectNotes']>(),
        tagsAttachmentsBySubject: new Map<unknown, CampaignsData['subjectTagsAttachments']>(),
        storyNotesByCampaign: new Map<unknown, CampaignsData['storyNotes']>(),
        ...overrides
    })

    it('should correctly create file structure', () => {
        const data = createMockData({
            campaigns: [{ id: 47, description: ':)', name: 'Cool Campaign' }],
        })
        const maps = createMockMaps({
            categoriesByParentId: new Map([
                [-1, [{ campaign_id: 47, parentCategory_id: -1, description: 'It should be inside campaign', id: 1, name: 'Root Category' }]],
                [1, [{ campaign_id: 47, parentCategory_id: 1, description: 'It should be inside Root Category', id: 2, name: 'Sub Category' }]]
            ]),
            subjectsByCategory: new Map([
                [1, [{ category_id: 1, fullDescription: 'Why he is inside Root Category', description: '???', id: 777, name: 'Mr. Mistery' }]],
                [2, [{ category_id: 2, fullDescription: 'The real hero of the Sub Category', description: 'His might is infinity', id: 8, name: 'Chuck' }]]
            ]),
            storyNotesByCampaign: new Map([[47, [{ campaign_id: 47, description: 'Single Story Note, but named as 100', id: 100 }]]])
        })
        const { vfs } = buildStructure(data, maps)
        expect(vfs).toMatchSnapshot()
    })
    it('should return empty object when gets empty data', () => {
        const data = createMockData()
        const maps = createMockMaps()
        const { vfs } = buildStructure(data, maps)
        expect(vfs).toEqual({})
    })
    it('should correctly integrate with PathRegistry', () => {
        const data = createMockData({
            campaigns: [{ id: 1, name: 'campaign' }]
        })
        const maps = createMockMaps({
            categoriesByParentId: new Map([[-1, [{ campaign_id: 1, parentCategory_id: -1, id: 1, name: 'category' }]]]),
            subjectsByCategory: new Map([
                [1, [
                    { category_id: 1, fullDescription: '', id: 1, name: 'subject' },
                    { category_id: 1, fullDescription: '', id: 2, name: 'subject' }
                ]],
            ])
        })
        const { vfs } = buildStructure(data, maps)
        expect('campaign/category/subject.md' in vfs).toBe(true)
        expect('campaign/category/subject-1.md' in vfs).toBe(true)
    })
    it('should correctly add subject notes to file', () => {
        const data = createMockData({
            campaigns: [{ id: 1, name: 'campaign' }]
        })
        const maps = createMockMaps({
            categoriesByParentId: new Map([[-1, [{ campaign_id: 1, parentCategory_id: -1, id: 1, name: 'category' }]]]),
            subjectsByCategory: new Map([[1, [{ category_id: 1, fullDescription: '', id: 1, name: 'subject' }]]]),
            notesBySubject: new Map([[1, [
                { subject_id: 1, name: 'subject_note_1' },
                { subject_id: 1, name: 'subject note 2 (without snake_case)' }
            ]]])
        })
        const { vfs } = buildStructure(data, maps)
        const subject = vfs['campaign/category/subject.md']
        expect(subject).toMatchInlineSnapshot(`
          "---
          tags: []
          ---

          # Description

          > subject_note_1
          > subject note 2 (without snake_case)
          # Connections"
        `)
    })
    it('should correctly add tags to file and add name of campaign to non-global tags', () => {
        const data = createMockData({
            campaigns: [{ id: 1, name: 'campaign' }],
            subjectTags: [
                { id: 1, isGlobal: true, name: 'Global tag' },
                { id: 2, isGlobal: false, name: 'Local tag' }
            ]
        })
        const maps = createMockMaps({
            categoriesByParentId: new Map([[-1, [{ campaign_id: 1, parentCategory_id: -1, id: 1, name: 'category' }]]]),
            subjectsByCategory: new Map([[1, [{ category_id: 1, fullDescription: '', id: 1, name: 'subject' }]]]),
            tagsAttachmentsBySubject: new Map([[1, [{ subject_id: 1, tag_id: 1 }, { subject_id: 1, tag_id: 2 }]]])
        })
        const { vfs } = buildStructure(data, maps)
        const subject = vfs['campaign/category/subject.md']
        expect(subject.startsWith('---\ntags: [Global tag, Local tag (campaign)]\n---')).toBe(true)
    })
    it('should correctly add connections to files', () => {
        const data = createMockData({
            campaigns: [{ id: 1, name: 'campaign' }],
            connections: [{ comment_1: 'link description', comment_2: undefined, subject1_id: 1, subject2_id: 2 }]
        })
        const maps = createMockMaps({
            categoriesByParentId: new Map([[-1, [{ campaign_id: 1, parentCategory_id: -1, id: 1, name: 'category' }]]]),
            subjectsByCategory: new Map([[1, [
                { category_id: 1, fullDescription: '', id: 1, name: 'subject1' },
                { category_id: 1, fullDescription: '', id: 2, name: 'subject2' }
            ]]]),
        })
        const { vfs } = buildStructure(data, maps)
        const subject1 = vfs['campaign/category/subject1.md']
        const subject2 = vfs['campaign/category/subject2.md']
        expect(subject1).toMatchInlineSnapshot(`
          "---
          tags: []
          ---

          # Description


          # Connections
          [[subject2]] - link description"
        `)
        expect(subject2).toMatchInlineSnapshot(`
          "---
          tags: []
          ---

          # Description


          # Connections
          [[subject1]] "
        `)
    })
})