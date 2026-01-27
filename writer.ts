import JSZip from 'jszip'
import { VirtualFileSystem } from './interfaces/VirtualFileSystem'
import { normalizePath } from './utils'

export const generateZipFromVFS = async (vfs: VirtualFileSystem): Promise<Blob> => {
  const zip = new JSZip()

  Object.entries(vfs).forEach(([filePath, content]) => {
    const normalizedPath = normalizePath(filePath)
    zip.file(normalizedPath, content)
  })

  return await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
}