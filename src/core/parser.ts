import { CampaignsData, RPGNotesDataMaps, RPGNotesRequiredData } from "../interfaces/RPGNotesData"

const groupBy = <T>(array: T[], key: keyof T): Map<unknown, T[]> => {
    const map = new Map<unknown, T[]>()
    array.forEach(item => {
        const groupKey = item[key]
        if (!map.has(groupKey)) map.set(groupKey, [])
        map.get(groupKey).push(item)
    })
    return map
}

const readJSONFile = async <T>(file: File): Promise<T> => {
    return JSON.parse(await file.text())
}
const normalizeRPGNotesData = (raw: RPGNotesRequiredData): CampaignsData => {
    return JSON.parse(raw.campaignsData)
}
export const getRPGNotesDataMaps = (data: CampaignsData): RPGNotesDataMaps => {
    const { categories, storyNotes, subjectNotes, subjectTagsAttachments, subjects } = data
    const categoriesByParentId = groupBy(categories, 'parentCategory_id')
    const subjectsByCategory = groupBy(subjects, 'category_id')
    const notesBySubject = groupBy(subjectNotes, 'subject_id')
    const tagsAttachmentsBySubject = groupBy(subjectTagsAttachments, 'subject_id')
    const storyNotesByCampaign = groupBy(storyNotes, 'campaign_id')
    return { categoriesByParentId, subjectsByCategory, notesBySubject, tagsAttachmentsBySubject, storyNotesByCampaign }
}

export const parseRPGNotes = async(file: File): Promise<{ maps: RPGNotesDataMaps, data: CampaignsData }> => {
    const rawData = await readJSONFile<RPGNotesRequiredData>(file)
    const data = normalizeRPGNotesData(rawData)
    const maps = getRPGNotesDataMaps(data)
    return { maps, data }
}  