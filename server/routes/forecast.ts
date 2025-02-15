import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { ForecastError } from '../utils/errors.ts';

const router = Router();

// Validation middleware
const validateGetForecast = [
  query('region').isString().notEmpty().trim(),
  query('specialty').isString().notEmpty().trim(),
  query('timeframe').isInt({ min: 1, max: 12 }).withMessage('Timeframe must be between 1 and 12 months'),
];

const validateCreateForecast = [
  body('region').isString().notEmpty().trim(),
  body('specialty').isString().notEmpty().trim(),
  body('historicalData').isArray().notEmpty(),
];

// Get forecast for a specific region and specialty
router.get('/', validateGetForecast, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { region, specialty, timeframe } = req.query;
    
    // TODO: Implement forecast logic
    const forecast = {
      region,
      specialty,
      predictions: [],
      confidence_intervals: []
    };

    res.status(StatusCodes.OK).json(forecast);
  } catch (error) {
    next(new ForecastError('Failed to generate forecast', error));
  }
});

// Create new forecast model
router.post('/', validateCreateForecast, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { region, specialty, historicalData } = req.body;

    // TODO: Implement forecast model creation
    const model = {
      id: Date.now().toString(),
      region,
      specialty,
      status: 'created'
    };

    res.status(StatusCodes.CREATED).json(model);
  } catch (error) {
    next(new ForecastError('Failed to create forecast model', error));
  }
});

export default router;