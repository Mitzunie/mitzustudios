import { v2 as cloudinary } from 'cloudinary'
import { env } from './env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  url: string
  publicId: string
}

export async function uploadImage(
  file: File,
  folder: string = 'mitzustudios/projects',
): Promise<CloudinaryUploadResult> {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('La imagen supera el tamaño máximo de 10MB')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new Error('Error al subir la imagen a Cloudinary'))
          return
        }
        if (!result) {
          reject(new Error('No se recibió respuesta de Cloudinary'))
          return
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      },
    )

    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch {
    // Best-effort: no lanzamos error si falla la eliminación
    console.error('Error al eliminar imagen de Cloudinary')
  }
}

export function extractPublicId(url: string): string | null {
  const matches = url.match(/\/v\d+\/(.+)\.\w+$/)
  return matches ? matches[1] : null
}
