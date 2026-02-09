import { CampaignsData } from "../schemas/RPGNotesData.schema";

export interface RPGNotesDataMaps {
    categoriesByParentId: Map<unknown, CampaignsData['categories']>,
    subjectsByCategory: Map<unknown, CampaignsData['subjects']>,
    notesBySubject: Map<unknown, CampaignsData['subjectNotes']>,
    tagsAttachmentsBySubject: Map<unknown, CampaignsData['subjectTagsAttachments']>,
    storyNotesByCampaign: Map<unknown, CampaignsData['storyNotes']>,
}