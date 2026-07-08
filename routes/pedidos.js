import express from 'express';
import { crearPedidoConDetalles, obtenerPedidoUsuario, misPedidos } from
'../controllers/pedidoController.js';

const router = express.Router();

// POST - Crear pedido (con correo automático)
router.post('/', crearPedidoConDetalles);

// GET - Obtener pedido por ID
router.get('/:id', obtenerPedidoUsuario);

// GET - Mis pedidos (por usuario)
router.get('/mis-pedidos', misPedidos);

export default router;