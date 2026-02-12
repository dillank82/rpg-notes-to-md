export const generateNoteContent = (tags: string, description: string, body: string, notes: string) => {
    const tagsSection = tags ? [
        '---',
        `tags: [${tags}]`,
        '---',
    ].join('\n') : ''
    const parts = [
        tagsSection,
        description,
        '# Description',
        body,
        notes
    ]
    return parts.filter(Boolean).join('\n')
}