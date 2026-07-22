// Importa el framework Express para poder utilizar sus funciones, como el enrutador
import express from 'express';
// Importa las funciones controladoras que ejecutarán la lógica de negocio para cada ruta de los helados
import { listarHelados, obtenerHelado, obtenerPorCat, crear, editar, eliminar } from
'../controllers/heladoController.js';

import { verificarToken, verificarAdmin } from '../middlewares/authmiddlewares.js';

// Inicializa el enrutador de Express para agrupar y definir las rutas de la aplicación
const router = express.Router();

// // GET - Obtener todos
// Define una ruta HTTP GET que sirve para solicitar y listar todos los helados existentes
router.get('/helados', listarHelados);

// // GET - Obtener por ID
// Define una ruta HTTP GET con un parámetro variable ':id' que sirve para buscar un helado específico por su identificador único
router.get('/helados/:id', obtenerHelado);

// // GET - Obtener por categoría
// Define una ruta HTTP GET con un parámetro ':categoria' que sirve para filtrar y traer todos los helados pertenecientes a esa categoría
router.get('/helados/categoria/:categoria', obtenerPorCat);

// // POST - Crear helado
// Define una ruta HTTP POST que sirve para enviar información en el cuerpo de la petición y dar de alta un nuevo helado
router.post('/helados', verificarToken, verificarAdmin, crear);


// // PUT - Actualizar helado
// Define una ruta HTTP PUT que utiliza el ':id' del helado para identificarlo y modificar o reemplazar sus datos actuales
router.put('/helados/:id', verificarToken, verificarAdmin, editar);

// // DELETE - Eliminar helado
// Define una ruta HTTP DELETE que utiliza el ':id' para localizar un helado específico y removerlo permanentemente de la base de datos
router.delete('/eliminar/:id', verificarToken, verificarAdmin, eliminar);

// Exporta el enrutador configurado para que pueda ser importado e integrado en el archivo principal de la aplicación (como app.js o index.js)
export default router;
