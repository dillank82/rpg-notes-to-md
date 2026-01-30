export const generateNoteContent = (tags: string, description: string, body: string, notes: string) => {
    return `
        ---
        tags: [${tags}]
        ---
        ${description}
        \n# Description\n${body}
        \n${notes}
        \n#Connections
    `
}