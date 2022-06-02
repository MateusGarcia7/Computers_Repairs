const {body, validationResult} = require('express-validator')
const { AppError } = require('../Utils/appError')

const createRepairValidations = [
    body ('date').notEmpty().withMessage('Enter a valid date'),
    body('computerNumber').notEmpty().withMessage('Enter a valid computer number'),
    body('comments').notEmpty().withMessage('provide valid comments')
]

const createUserValidations = [
    body('name').notEmpty().withMessage('Enter a valid name'),
    body('email').notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Must provide a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
    body('role').notEmpty().withMessage('Enter a valid role'),
]

const checkValidations = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      const messages =   errors.array().map(err => err.msg)

      const errorMsg = messages.join('.')

      return next(new AppError(errorMsg, 400))
    }
    next()
}

module.exports = {createRepairValidations,createUserValidations, checkValidations}

