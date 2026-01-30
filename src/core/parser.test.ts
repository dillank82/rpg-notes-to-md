import { RPGNotesRequiredData } from "../interfaces/RPGNotesData"
import { getCampaignsData } from "./parser"

describe('getCampaignsData', () => {
    const createMockData = (overrides: Partial<RPGNotesRequiredData['campaignsData']> = {}): RPGNotesRequiredData => ({
        campaignsData: {
            campaigns: [],
            categories: [],
            connections: [],
            storyNotes: [],
            subjectNotes: [],
            subjectTags: [],
            subjectTagsAttachments: [],
            subjects: [],
            ...overrides
        }
    })
    it('should return empty maps when raw data arrays is empty', () => {
        const rawData = createMockData()
        const { data, maps } = getCampaignsData(rawData)
        expect(maps.subjectsByCategory.size).toBe(0)
        expect(data.subjects.length).toBe(0)
    })
    it('should groupping subjects by categories correctly ', () => {
        const rawData = createMockData({
            subjects: [
                { id: 1, name: 'Oor', category_id: 1, fullDescription: '' },
                { id: 2, name: 'Suan', category_id: 1, fullDescription: '' },
                { id: 3, name: 'Nefrit', category_id: 100, fullDescription: '' },
            ]
        })
        const { maps } = getCampaignsData(rawData)

        expect(maps.subjectsByCategory.get(1)).toHaveLength(2)
        expect(maps.subjectsByCategory.get(100)).toHaveLength(1)
        expect(maps.subjectsByCategory.get(100)[0].id).toBe(3)
    })
    it('should correctly associate notes with subjects', () => {
        const rawData = createMockData({
            subjectNotes: [
                { subject_id: 1, name: 'All around is fake' },
                { subject_id: 1, name: 'I love potato' }
            ]
        })

        const { maps } = getCampaignsData(rawData)

        expect(maps.notesBySubject.get(1)).toHaveLength(2)
        expect(maps.notesBySubject.get(1)[1].name).toBe('I love potato')
    })
    it('should keep original data unchanged', () => {
        const rawData = createMockData({
            campaigns: [{ id: 1, name: 'Forgotten Realms' }]
        })

        const { data } = getCampaignsData(rawData)

        expect(data.campaigns).toHaveLength(1)
        expect(data.campaigns[0].name).toBe('Forgotten Realms')
    })
})