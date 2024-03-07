import { NextFunction, Request, Response } from 'express'
import path from 'path'
import HttpStatus from '~/constants/httpStatus'
import { UsersMessages } from '~/constants/messages'
import mediaService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadImage(req)

  return res.json({
    message: UsersMessages.UPLOAD_IMAGE_SUCCESS,
    result: url
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.handleUploadVideo(req)

  return res.json({
    message: UsersMessages.UPLOAD_IMAGE_SUCCESS,
    result: url
  })
}

export const uploadVideoHlsController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediaService.uploadVideoHls(req)
  return res.json({
    message: UsersMessages.UPLOAD_IMAGE_SUCCESS,
    result: url
  })
}

export const videoStatusController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await mediaService.getVideoStatus(id)
  return res.json({
    message: UsersMessages.UPLOAD_IMAGE_SUCCESS,
    result: result
  })
}
