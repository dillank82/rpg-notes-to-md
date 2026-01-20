import { RPGNotesRequiredData } from './interfaces/RPGNotesData'

const joinPaths = (...parts: string[]) => parts.join('/').replace(/\/+/g, '/')
const sanitize = (name: string) => name.replace(/[\/:*?"<>|]/g, '-')

const buildStructure = (rawData: RPGNotesRequiredData): VirtualFileSystem => {
    const vfs: VirtualFileSystem = {}
    const { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects } = rawData.campaignsData

    campaigns.forEach(campaign => {
        const campaignPath = sanitize(campaign.name)

        storyNotes
            .filter(note => note.campaign_id === campaign.id)
            .forEach(note => {
                const storyNotePath = joinPaths(campaignPath, 'StoryNotes', `Note ${note.id}.md`)
                vfs[storyNotePath] = note.description
            })

        const buildCategories = (parentId: number, currentPath: string) => {
            categories
                .filter(c => c.campaign_id === campaign.id && c.parentCategory_id === parentId)
                .forEach(cat => {
                    const catPath = joinPaths(currentPath, sanitize(cat.name))

                    subjects
                        .filter(s => s.category_id === cat.id)
                        .forEach(sub => {
                            const notes = subjectNotes
                                .filter(note => note.subject_id === sub.id)
                                .map(note => `> ${note.name}`).join('\n')

                            const content = `
                            ${sub.description}
                            \n# Description\n${sub.fullDescription}
                            \n${notes}
                        `
                            const subjectPath = joinPaths(catPath, `${sanitize(sub.name)}.md`)
                            vfs[subjectPath] = content
                        })

                    buildCategories(cat.id, catPath)
                })
        }

        buildCategories(-1, campaignPath)
    })
    return vfs
}