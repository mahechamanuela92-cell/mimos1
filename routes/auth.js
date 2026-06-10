import express from 'express';
import { registro, login} from '../controllers/auth.js';

const router = express.Router();

///ruta de autenticacion 
router.post('/register', registro);
router.post('/login', login);

export default router;