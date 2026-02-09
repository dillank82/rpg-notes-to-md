import z from "zod";

const CampaignSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string()
})

const CategorySchema = z.object({
  id: z.number(),
  campaign_id: z.number(),
  parentCategory_id: z.number(),
  name: z.string(),
  description: z.string()
})

const ConnectionSchema = z.object({
  subject1_id: z.number(),
  subject2_id: z.number(),
  comment_1: z.string(),
  comment_2: z.string()
})

const StoryNoteSchema = z.object({
  id: z.number(),
  campaign_id: z.number(),
  description: z.string(),
})

const SubjectNoteSchema = z.object({
  subject_id: z.number(),
  name: z.string()
})

const SubjectTagSchema = z.object({
  id: z.number(),
  isGlobal: z.boolean(),
  name: z.string()
})

const SubjectTagAttachmentSchema = z.object({
  subject_id: z.number(),
  tag_id: z.number(),
})

const SubjectSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  name: z.string(),
  fullDescription: z.string(),
  description: z.string()
})

const CampaignsDataSchema = z.object({
  campaigns: z.array(CampaignSchema),
  categories: z.array(CategorySchema),
  connections: z.array(ConnectionSchema),
  storyNotes: z.array(StoryNoteSchema),
  subjectNotes: z.array(SubjectNoteSchema),
  subjectTags: z.array(SubjectTagSchema),
  subjectTagsAttachments: z.array(SubjectTagAttachmentSchema),
  subjects: z.array(SubjectSchema)
})

export const RPGNotesRequiredDataSchema = z.object({
  campaignsData: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str)
      return CampaignsDataSchema.parse(parsed)
    } catch {
      ctx.addIssue({
        code: 'custom',
        message: "campaignsData is not a valid JSON string or matches the expected schema",
      })
      return z.NEVER;
    }
  }),
})

export type CampaignsData = z.infer<typeof CampaignsDataSchema>
export type RPGNotesRequiredData = z.infer<typeof RPGNotesRequiredDataSchema>