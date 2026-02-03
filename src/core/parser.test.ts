import { CampaignsData } from "../interfaces/RPGNotesData"
import { getRPGNotesDataMaps } from "./parser"

describe ('getRPGNotesDataMaps', () => {
    const createMockData = (overrides: Partial<CampaignsData> = {}): CampaignsData => ({
            campaigns: [],
            categories: [],
            connections: [],
            storyNotes: [],
            subjectNotes: [],
            subjectTags: [],
            subjectTagsAttachments: [],
            subjects: [],
            ...overrides
    })

    it('should return empty maps when raw data arrays is empty', () => {
        const mockData = createMockData()
        const maps = getRPGNotesDataMaps(mockData)
        expect(maps.subjectsByCategory.size).toBe(0)
    })
    it('should groupping subjects by categories correctly ', () => {
        const mockData = createMockData({
            subjects: [
                { id: 1, name: 'Oor', category_id: 1, fullDescription: '' },
                { id: 2, name: 'Suan', category_id: 1, fullDescription: '' },
                { id: 3, name: 'Nefrit', category_id: 100, fullDescription: '' },
            ]
        })
        const maps = getRPGNotesDataMaps(mockData)

        expect(maps.subjectsByCategory.get(1)).toHaveLength(2)
        expect(maps.subjectsByCategory.get(100)).toHaveLength(1)
        expect(maps.subjectsByCategory.get(100)[0].id).toBe(3)
    })
    it('should correctly associate notes with subjects', () => {
        const mockData = createMockData({
            subjectNotes: [
                { subject_id: 1, name: 'All around is fake' },
                { subject_id: 1, name: 'I love potato' }
            ]
        })

        const maps = getRPGNotesDataMaps(mockData)

        expect(maps.notesBySubject.get(1)).toHaveLength(2)
        expect(maps.notesBySubject.get(1)[1].name).toBe('I love potato')
    })
})