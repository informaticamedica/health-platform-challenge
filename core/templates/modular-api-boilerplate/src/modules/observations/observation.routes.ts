import { Router } from 'express';

import { ObservationController } from './observation.controller';

import { authenticate } from '../../shared/auth/auth.middleware';

const router = Router();
const controller = new ObservationController();

router.get('/categories', authenticate, controller.categories);
router.get('/loinc', authenticate, controller.loincSuggestions);
router.get('/:id/fhir', authenticate, controller.fhir);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);

export { router as observationRoutes };
