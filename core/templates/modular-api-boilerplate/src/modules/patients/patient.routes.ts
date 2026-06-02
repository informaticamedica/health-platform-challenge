import { Router } from 'express';

import { PatientController } from './patient.controller';

import { authenticate } from '../../shared/auth/auth.middleware';
import { ObservationController } from '../observations/observation.controller';

const router = Router();
const patientController = new PatientController();
const observationController = new ObservationController();

router.get('/', authenticate, patientController.findAll);
router.get('/:id', authenticate, patientController.findById);
router.get('/:id/observations', authenticate, observationController.findByPatientId);
router.post('/:id/observations', authenticate, observationController.createForPatient);
router.post('/', authenticate, patientController.create);
router.delete('/:id', authenticate, patientController.delete);
router.put('/:id', authenticate, patientController.update);

export { router as patientRoutes };
