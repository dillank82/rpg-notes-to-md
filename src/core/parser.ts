import { RPGNotesDataMaps } from "../interfaces/RPGNotesData"
import { CampaignsData, RPGNotesRequiredDataSchema } from "../schemas/RPGNotesData.schema"

const groupBy = <T>(array: T[], key: keyof T): Map<unknown, T[]> => {
    const map = new Map<unknown, T[]>()
    array.forEach(item => {
        const groupKey = item[key]
        if (!map.has(groupKey)) map.set(groupKey, [])
        map.get(groupKey).push(item)
    })
    return map
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
    const text = await file.text()
    const rawData = JSON.parse(text)
    const validated = await RPGNotesRequiredDataSchema.parseAsync(rawData)
    const data = validated.campaignsData
    const maps = getRPGNotesDataMaps(data)
    return { maps, data }
}  