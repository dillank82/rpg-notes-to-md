import { RPGNotesRequiredData } from '../interfaces/RPGNotesData'
import { VirtualFileSystem } from '../interfaces/VirtualFileSystem'
import { normalizePath } from './utils'

const joinPaths = (...parts: string[]) => parts.join('/')
const sanitize = (name: string) => name.replace(/[\/:*?"<>|]/g, '-')

export const buildStructure = (rawData: RPGNotesRequiredData): VirtualFileSystem => {
    const vfs: VirtualFileSystem = {}
    const { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects } = rawData.campaignsData
    const subjectIdToPath = new Map<number, string>()
    const subjectIdToName = new Map<number, string>()

    campaigns.forEach(campaign => {
        const campaignPath = sanitize(campaign.name)

        storyNotes
            .filter(note => note.campaign_id === campaign.id)
            .forEach(note => {
                const storyNotePath = normalizePath(
                    joinPaths(campaignPath, 'StoryNotes', `Note ${note.id}.md`),
                    true
                )
                vfs[storyNotePath] = note.description
            })

        const buildCategories = (parentId: number, currentPath: string) => {
            categories
                .filter(c => c.campaign_id === campaign.id && c.parentCategory_id === parentId)
                .forEach(cat => {
                    const catPath = normalizePath(
                        joinPaths(currentPath, sanitize(cat.name)),
                        false
                    )

                    subjects
                        .filter(s => s.category_id === cat.id)
                        .forEach(sub => {
                            const notes = subjectNotes
                                .filter(note => note.subject_id === sub.id)
                                .map(note => `> ${note.name}`).join('\n')
                            const tags = subjectTagsAttachments
                                .filter(att => att.subject_id === sub.id)
                                .map(att => {
                                    const tag = subjectTags.find(tag => tag.id === att.tag_id)
                                    return `#${tag?.isGlobal ? tag.name : `${tag?.name} from ${campaign.name}`}`
                                }).join('\n')

                            const content = `
                            ${sub.description}
                            \n# Description\n${sub.fullDescription}
                            \n${notes}
                            \n${tags}
                        `
                            const subjectPath = normalizePath(
                                joinPaths(catPath, `${sanitize(sub.name)}.md`),
                                true
                            )
                            vfs[subjectPath] = content
                            subjectIdToPath.set(sub.id, subjectPath)
                            subjectIdToName.set(sub.id, sub.name)
                        })

                    buildCategories(cat.id, catPath)
                })
        }
        buildCategories(-1, campaignPath)
    })
    const addConections = () => {
        connections.forEach((c) => {
            const path1 = subjectIdToPath.get(c.subject1_id)
            const path2 = subjectIdToPath.get(c.subject2_id)
            const name1 = subjectIdToName.get(c.subject1_id)
            const name2 = subjectIdToName.get(c.subject2_id)

            if (path1 && name2) {
                vfs[path1] += `[${name2}] ${c.comment_1 && ('- ' + c.comment_1)} \n`
            }
            if (path2 && name1) {
                vfs[path2] += `[${name1}] ${c.comment_2 && ('- ' + c.comment_2)} \n`
            }
        })
    }
    addConections()
    return vfs
}