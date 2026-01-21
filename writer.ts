import JSZip from 'jszip'
import { VirtualFileSystem } from './interfaces/VirtualFileSystem'

export const generateZipFromVFS = async (vfs: VirtualFileSystem): Promise<Blob> => {
  const zip = new JSZip()

  Object.entries(vfs).forEach(([filePath, content]) => {
    const normalizedPath = filePath.replace(/\/+/g, '/')
    zip.file(normalizedPath, content)
  })

  return await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
}