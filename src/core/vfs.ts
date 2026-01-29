import { RPGNotesRequiredData } from '../interfaces/RPGNotesData'
import { VirtualFileSystem } from '../interfaces/VirtualFileSystem'
import { normalizePath, sanitizeName } from './utils'

const joinPaths = (...parts: string[]) => normalizePath(parts.join('/'))
const groupBy = <T>(array: T[], key: keyof T): Map<unknown, T[]> => {
    const map = new Map<unknown, T[]>()
    array.forEach(item => {
        const groupKey = item[key]
        if (!map.has(groupKey)) map.set(groupKey, [])
        map.get(groupKey).push(item)
    })
    return map
}

export const buildStructure = (rawData: RPGNotesRequiredData): VirtualFileSystem => {
    const vfs: VirtualFileSystem = {}
    const { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects } = rawData.campaignsData

    const categoriesByParentId = groupBy(categories, 'parentCategory_id')
    const subjectsByCategory = groupBy(subjects, 'category_id')
    const notesBySubject = groupBy(subjectNotes, 'subject_id')
    const tagsAttachmentsBySubject = groupBy(subjectTagsAttachments, 'subject_id')
    const storyNotesByCampaign = groupBy(storyNotes, 'campaign_id')

    const subjectIdToPath = new Map<number, string>()
    const subjectIdToName = new Map<number, string>()

    const occupiedPaths = new Set<string>()

    const registerPath = (path: string, content: string) => {
        let finalPath = path
        let counter = 1
        while(occupiedPaths.has(finalPath.toLowerCase())) {
            finalPath = path.replace(/\.md$/, `-${counter}.md`)
            counter++
        }
        occupiedPaths.add(finalPath.toLowerCase())
        vfs[finalPath] = content
        return finalPath
    }

    campaigns.forEach(campaign => {
        const campaignPath = sanitizeName(campaign.name, 'campaign');

        (storyNotesByCampaign.get(campaign.id) || []).forEach(note => {
            const storyNotePath = joinPaths(campaignPath, 'StoryNotes', `Note ${note.id}.md`)
            registerPath(storyNotePath, note.description)
        })

        const buildCategories = (parentId: number, currentPath: string) => {
            (categoriesByParentId.get(parentId) || []).forEach(cat => {
                const catPath = joinPaths(currentPath, sanitizeName(cat.name, 'category'));

                (subjectsByCategory.get(cat.id) || []).forEach(sub => {
                    const notes = (notesBySubject.get(sub.id) || []).map(note => `> ${note.name}`).join('\n')
                    const tags = (tagsAttachmentsBySubject.get(sub.id) || []).map(att => {
                        const tag = subjectTags.find(tag => tag.id === att.tag_id)
                        return `${tag?.isGlobal ? tag.name : `${tag?.name} (${campaign.name})`}`
                    }).join(', ')

                    const content = `
                        ---
                        tags: [${tags}]
                        ---
                        ${sub.description}
                        \n# Description\n${sub.fullDescription}
                        \n${notes}
                    `
                    const subjectPath = joinPaths(catPath, `${sanitizeName(sub.name, 'note')}.md`)
                    const finalSubjectPath = registerPath(subjectPath, content)
                    subjectIdToPath.set(sub.id, finalSubjectPath)
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
                vfs[path1] += `[[${name2}]] ${c.comment_1 && ('- ' + c.comment_1)} \n`
            }
            if (path2 && name1) {
                vfs[path2] += `[[${name1}]] ${c.comment_2 && ('- ' + c.comment_2)} \n`
            }
        })
    }
    addConections()
    return vfs
}