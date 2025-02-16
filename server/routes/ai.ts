import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { generateAIResponse } from '../services/openai.js';
import { BaseError } from '../utils/errors.ts';

const router = Router();

// Validation middleware
const validateEmergencyData = [
  body('emergencyData').isString().notEmpty().trim(),
];

// Generate AI response for emergency data
router.post('/analyze', validateEmergencyData, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { emergencyData } = req.body;
    const response = await generateAIResponse(emergencyData);

    res.status(StatusCodes.OK).json({ response });
  } catch (error) {
    next(new BaseError('Failed to generate AI response', StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

export default router;
