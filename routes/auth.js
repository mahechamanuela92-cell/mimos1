import express from 'express';
import { registro, login} from '../controllers/auth.js';
import { forgotpassword, verifyCode } from '../controllers/recuperar.js';

const router = express.Router();

///ruta de autenticacion 
router.post('/register', registro);
router.post('/login', login);

//ruta de olvido de contraseña
router.post('/forgot-password',forgotpassword);
router.post('/verify-code', verifyCode);

export default router;