import { parseRPGNotes } from "./parser"
import { generateBigPathsMessage } from "./utils"
import { buildStructure } from "./vfs/VFSBuilder"
import { generateZipFromVFS } from "./writer"

export const converterPipeline = async(file: File): Promise<{ blob: Blob, bigPathsMessage: string }> => {
    const { data, maps } = await parseRPGNotes(file)
    const { vfs, bigPathsWarnings } = buildStructure(data, maps)
    const blob = await generateZipFromVFS(vfs)
    
    const bigPathsMessage = generateBigPathsMessage(bigPathsWarnings)
    return { blob, bigPathsMessage }
}