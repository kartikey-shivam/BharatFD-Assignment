import { NextFunction, Request, Response } from 'express'
import { Schema, ValidationOptions } from 'joi'

const options: ValidationOptions = {
  errors: {
    wrap: {
      label: false,
    },
  },
}

const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, options)
      const valid = error == null

      if (valid) {
        next()
      } else {
        const { details } = error
        const message = details.map((i) => i.message).join(',')
        throw new Error(message)
      }
    } catch (error) {
      next(error)
    }
  }
}

export default validateRequest
