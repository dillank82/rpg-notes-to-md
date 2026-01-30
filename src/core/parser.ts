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

export const getCampaignsData = (rawData: RPGNotesRequiredData): { maps: RPGNotesDataMaps, data: CampaignsData } => {
    const { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects } = rawData.campaignsData
    const categoriesByParentId = groupBy(categories, 'parentCategory_id')
    const subjectsByCategory = groupBy(subjects, 'category_id')
    const notesBySubject = groupBy(subjectNotes, 'subject_id')
    const tagsAttachmentsBySubject = groupBy(subjectTagsAttachments, 'subject_id')
    const storyNotesByCampaign = groupBy(storyNotes, 'campaign_id')
    return {
        maps: { categoriesByParentId, subjectsByCategory, notesBySubject, tagsAttachmentsBySubject, storyNotesByCampaign },
        data: { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects }
    }
}