import express from 'express';
import { crearPedidoConDetalles, obtenerPedidoUsuario, misPedidos, actualizarEstado, eliminarPedido } from
'../controllers/pedidoController.js';

const router = express.Router();

// POST - Crear pedido (con correo automático)
router.post('/crear', crearPedidoConDetalles);

// GET - Obtener pedido por ID
router.get('/:id', obtenerPedidoUsuario);

//actualizar el estado del pedido
router.put('/estado/:id', actualizarEstado);

// GET - Mis pedidos (por usuario)
router.get('/mis-pedidos', misPedidos);

//eliminar un pedido por id
router.delete('/eliminar/:id', eliminarPedido);

export default router;