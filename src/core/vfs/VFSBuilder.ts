import { RPGNotesDataMaps } from '../../interfaces/RPGNotesData'
import { VirtualFileSystem } from '../../interfaces/VirtualFileSystem'
import { CampaignsData } from '../../schemas/RPGNotesData.schema'
import { normalizePath, sanitizeName } from '../utils'
import { generateNoteContent } from './generateNoteContent'
import { PathRegistry } from './pathRegistry'


export const buildStructure = (data: CampaignsData, maps: RPGNotesDataMaps): { vfs: VirtualFileSystem, bigPathsWarnings: string[] } => {
    const joinPaths = (...parts: string[]) => normalizePath(parts.join('/'))

    const vfs: VirtualFileSystem = {}

    const { campaigns, connections, subjectTags } = data
    const { categoriesByParentId, subjectsByCategory, notesBySubject, tagsAttachmentsBySubject, storyNotesByCampaign } = maps

    const subjectIdToPath = new Map<number, string>()
    const subjectIdToName = new Map<number, string>()

    const registry = new PathRegistry()
    const regFile = (path: string, content: string) => {
        const finalPath = registry.resolve(path)
        vfs[finalPath] = content
        return finalPath
    }

    campaigns.forEach(campaign => {
        const campaignPath = sanitizeName(campaign.name, 'campaign');

        (storyNotesByCampaign.get(campaign.id) || []).forEach(note => {
            const storyNotePath = joinPaths(campaignPath, 'StoryNotes', `Note ${note.id}.md`)
            regFile(storyNotePath, note.description)
        })

        const buildCategories = (parentId: number, currentPath: string) => {
            (categoriesByParentId.get(parentId) || []).forEach(cat => {
                const catPath = joinPaths(currentPath, sanitizeName(cat.name, 'category'));

                (subjectsByCategory.get(cat.id) || []).forEach(sub => {
                    const notes = (notesBySubject.get(sub.id) || []).map(note => `> ${note.name}`).join('\n')
                    const tags = (tagsAttachmentsBySubject.get(sub.id) || []).map(att => {
                        const tag = subjectTags.find(tag => tag.id === att.tag_id)
                        return `${tag?.isGlobal ? tag.name : `${tag?.name}_${campaign.name}`}`
                    }).join(', ')

                    const content = generateNoteContent(tags, sub.description, sub.fullDescription, notes)
                    const subjectPath = joinPaths(catPath, `${sanitizeName(sub.name, 'note')}.md`)
                    const finalSubjectPath = regFile(subjectPath, content)
                    subjectIdToPath.set(sub.id, finalSubjectPath)
                    subjectIdToName.set(sub.id, sub.name)
                })
                buildCategories(cat.id, catPath)
            })
        }
        buildCategories(-1, campaignPath)
    })
    const addConections = () => {
        connections?.forEach((c) => {
            const path1 = subjectIdToPath.get(c.subject1_id)
            const path2 = subjectIdToPath.get(c.subject2_id)
            const name1 = subjectIdToName.get(c.subject1_id)
            const name2 = subjectIdToName.get(c.subject2_id)

            if (path1 && name2) {
                if (!vfs[path1].includes('\n# Connections')) vfs[path1] += '\n# Connections'
                vfs[path1] += `\n[[${name2}]] ${c.comment_1 ? ('- ' + c.comment_1) : ''}`
            }
            if (path2 && name1) {
                if (!vfs[path2].includes('\n# Connections')) vfs[path2] += '\n# Connections'
                vfs[path2] += `\n[[${name1}]] ${c.comment_2 ? ('- ' + c.comment_2) : ''}`
            }
        })
    }
    addConections()
    return { vfs, bigPathsWarnings: registry.bigPaths } 
}