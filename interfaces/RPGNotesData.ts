export interface RPGNotesRequiredData {
    campaignsData: {
        campaigns: Campaign[]
        categories: Category[]
        connections: Connection[]
        storyNotes: StoryNote[]
        subjectNotes: SubjectNote[]
        subjectTags: SubjectTag[]
        subjectTagsAttachments: SubjectTagAttachment[]
        subjects: Subject[]
    }
}

interface Campaign {
    description: string
    name: string
    id: number
}

interface Category {
    campaign_id: number
    parentCategory_id: number
    description: string
    id: number
    name: string
}

interface Connection {
    comment_1: string
    comment_2: string
    // id: number
    subject1_id: number
    subject2_id: number
}

interface StoryNote {
    campaign_id: number
    description: string
    id: number
}

interface SubjectNote {
    // id: number
    name: string
    subject_id: number
}

interface SubjectTag {
    id: number
    campaign_id: number
    isGlobal: boolean
    name: string
}

interface SubjectTagAttachment {
    subject_id: number
    tag_id: number
}

interface Subject {
    category_id: number
    fullDescription: string
    description: string
    id: number
    name: string
}