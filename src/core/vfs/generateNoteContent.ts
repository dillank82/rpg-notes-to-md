import i18n from "../../locales/i18n"
import { CampaignsData } from "../../schemas/RPGNotesData.schema"

export const normalizeTagName = (tag: CampaignsData['subjectTags'][number], campaignName: string) => {
    let tagName = String(tag.name.trim())
    const cleanName = (name: string) => {
        let n = name
        while (n.startsWith('#') || n.startsWith('/') || n.startsWith(' ')) n = n.slice(1);
        n = n
            .replace(/^[\p{N}]/gu, match => `_${match}`)
            .replace(/[^\p{L}\p{N}/_-]/gu, '_')
        n = n
            .replace(/[/]{2,}/g, match => match[0])
            .trim()
            .replace(/[/]+$/g, '')
        return n
    }
    if (!tag.isGlobal) tagName += `/${cleanName(campaignName)}`
    return cleanName(tagName)
}

export const generateNoteContent = (tags: string, description: string, body: string, notes: string) => {
    const t = i18n.t
    const tagsSection = tags ? [
        '---',
        `tags: [${tags}]`,
        '---',
    ].join('\n') : ''
    const parts = [
        tagsSection,
        description,
        `# ${t('vfs:description')}`,
        body,
        notes
    ]
    return parts.filter(Boolean).join('\n')
}