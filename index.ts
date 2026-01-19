import fs from 'fs'
import path from 'path'
import { RPGNotesRequiredData } from './interfaces/RPGNotesData'

const DATA_SOURCE = './mydata.json'
const OUTPUT_DIR = './output'

const rawData: RPGNotesRequiredData = JSON.parse(fs.readFileSync(DATA_SOURCE, 'utf-8'))
const { campaigns, categories, connections, storyNotes, subjectNotes, subjectTags, subjectTagsAttachments, subjects } = rawData.campaignsData
const sanitize = (name: string) => name.replace(/[\/:*?"<>|]/g, '-')
const makeDir = (path: string) => { if (!fs.existsSync(path)) fs.mkdirSync(path) }

const buildStructure = () => {
    makeDir(OUTPUT_DIR)

    campaigns.forEach(campaign => {
        const campaignPath = path.join(OUTPUT_DIR, sanitize(campaign.name))
        makeDir(campaignPath)

        const storyNotesPath = path.join(campaignPath, 'StoryNotes')
        makeDir(storyNotesPath)

        storyNotes
            .filter(note => note.campaign_id === campaign.id)
            .forEach(note => {
                fs.writeFileSync(
                    path.join(storyNotesPath, `Note ${note.id}`),
                    note.description
                )
            })
        
        const buildCategories = (parentId: number, currentPath: string) => {
            const children = categories.filter(c => c.campaign_id === campaign.id && c.parentCategory_id === parentId)

            children.forEach(cat => {
                const catPath = path.join(currentPath, sanitize(cat.name))
                makeDir(catPath)

                subjects
                    .filter(s => s.category_id === cat.id)
                    .forEach(sub => {
                        const notes = subjectNotes
                            .filter(note => note.subject_id === sub.id)
                            .map(note => `> ${note.name}`)
                            .join('\n')

                        const content = `
                            ${sub.description}
                            \n# Description\n${sub.fullDescription}
                            \n${notes}
                        `
                        fs.writeFileSync(path.join(catPath, `${sanitize(sub.name)}.md`), content)
                    })

                buildCategories(cat.id, catPath)
            })
        }

        buildCategories(-1, campaignPath)
    })
}

buildStructure()