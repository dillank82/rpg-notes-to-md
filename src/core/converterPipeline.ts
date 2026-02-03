import { parseRPGNotes } from "./parser"
import { buildStructure } from "./vfs/VFSBuilder"
import { generateZipFromVFS } from "./writer"

export const converterPipeline = async(file: File): Promise<Blob> => {
    const { data, maps } = await parseRPGNotes(file)
    const vfs = buildStructure(data, maps)
    const blob = await generateZipFromVFS(vfs)
    console.log(vfs)

    return blob
}