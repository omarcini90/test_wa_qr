import { Router } from 'express';
import { createUser, login } from './user.service';
import { loginSchema } from "./user.validator"
import { ValidationError } from 'joi';
import BaseError from '../utils/errors/base-error';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const user = await createUser(req.body)
    return res.status(201).json(user)
  } catch (error) {
    return next(error)
  }

})

router.post('/login', async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body)
    const token = await login(req.body.email, req.body.password)
    return res.status(200).json(token)
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BaseError(error.message, "app-001", 400))
    }
    return next(error)
  }

});

export default router;