import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TriageError } from '../utils/errors.ts';

const router = Router();

// Validation middleware
const validateTriage = [
  body('region').isString().notEmpty().trim(),
  body('specialty').isString().notEmpty().trim(),
  body('symptoms').isArray().notEmpty(),
  body('urgencyFactors').isObject(),
];

// Get triage questionnaire
router.get('/questionnaire', (req, res) => {
  const questionnaire = {
    sections: [
      {
        id: 'symptoms',
        title: 'Symptoms Assessment',
        questions: [
          {
            id: 'primary_symptom',
            type: 'select',
            label: 'What is your primary symptom?',
            options: ['chest_pain', 'shortness_of_breath', 'palpitations']
          }
        ]
      }
    ]
  };

  res.status(StatusCodes.OK).json(questionnaire);
});

// Submit triage assessment
router.post('/assess', validateTriage, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { region, specialty, symptoms, urgencyFactors } = req.body;

    // TODO: Implement triage logic
    const assessment = {
      urgencyLevel: 'routine',
      recommendedAction: 'schedule_appointment',
      estimatedWaitTime: 7,
      teleConsultationEligible: true
    };

    res.status(StatusCodes.OK).json(assessment);
  } catch (error) {
    next(new TriageError('Failed to process triage assessment', error));
  }
});

export default router;