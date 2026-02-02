export const generateNoteContent = (tags: string, description: string, body: string, notes: string) => {
    const parts = [
        '---',
        `tags: [${tags}]`,
        '---',
        description,
        '# Description',
        body,
        notes,
        '# Connections'
    ]
    return parts.join('\n')
}