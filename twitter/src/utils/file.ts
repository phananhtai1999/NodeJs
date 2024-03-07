import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import { DIR_UPLOAD_IMAGE_TEMP, DIR_UPLOAD_VIDEO } from './dir'
import { File } from 'formidable'

export const initFolder = () => {
  ;[DIR_UPLOAD_VIDEO, DIR_UPLOAD_IMAGE_TEMP].forEach((element) => {
    if (!fs.existsSync(element)) {
      fs.mkdirSync(element, {
        recursive: true
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: DIR_UPLOAD_IMAGE_TEMP,
    maxFiles: 4,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return true
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const nanoId = (await import('nanoid')).nanoid
  const idName = nanoId()
  const folderPath = path.resolve(DIR_UPLOAD_VIDEO, idName)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }

      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtenstion(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (name: string) => {
  const nameArr = name.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtenstion = (name: string) => {
  const ext = name.split('.')
  return ext[ext.length - 1]
}
