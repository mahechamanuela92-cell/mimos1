// Importa las funciones del modelo encargadas de interactuar directamente con la base de datos de Supabase
import { obtenerTodos, obtenerPorId, obtenerPorCategoria, crearHelado, actualizarHelado,
eliminarHelado } from '../models/heladoModel.js';

// Controlador para listar todos los helados; responde al cliente con los datos o un error 500
export const listarHelados = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los registros
        const { data, error } = await obtenerTodos();
        // Si hay un error en la consulta, responde con un código de estado 500 y un mensaje de error
        if (error) return res.status(500).json({ error: 'Error al obtener' });
        // Si todo sale bien, responde con un código de estado 200 y envía los datos de los helados
        return res.status(200).json(data);
    } catch (error) {
        // Captura cualquier fallo inesperado del servidor y devuelve el mensaje de la excepción con un código 500
        return res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener un helado específico utilizando su ID extraído de los parámetros de la URL
export const obtenerHelado = async (req, res) => {
    try {
        // Extrae el parámetro 'id' de los datos de la solicitud (req.params)
        const { id } = req.params;
        // Busca el helado correspondiente llamando a la función del modelo pasándole dicho ID
        const { data, error } = await obtenerPorId(id);
        // Si ocurre un error o el helado no existe (data está vacío), responde con un código 404 de "No encontrado"
        if (error || !data) return res.status(404).json({ error: 'No encontrado' });
        // Si lo encuentra correctamente, responde con un código de estado 200 y los datos del helado
        return res.status(200).json(data);
    } catch (error) {
        // Captura cualquier fallo imprevisto en el servidor y devuelve el mensaje del error con un código 500
        return res.status(500).json({ error: error.message });
    }
};

// Controlador para filtrar y obtener los helados que pertenecen a una categoría recibida por la URL
export const obtenerPorCat = async (req, res) => {
    try {
        // Extrae la propiedad 'categoria' de los parámetros de la ruta de la solicitud
        const { categoria } = req.params;
        // Solicita al modelo que busque los helados asociados a esa categoría específica
        const { data, error } = await obtenerPorCategoria(categoria);
        // Si se produce un error en la base de datos, responde con un código de estado 500
        if (error) return res.status(500).json({ error: 'Error' });
        // Si se ejecuta con éxito, responde con un código de estado 200 junto con el listado filtrado
        return res.status(200).json(data);
    } catch (error) {
        // Captura excepciones inesperadas en la ejecución y retorna el mensaje del error con un código 500
        return res.status(500).json({ error: error.message });
    }
};

// Controlador para crear un nuevo registro de helado en la base de datos
export const crear = async (req, res) => {
    try {
        // Extrae las propiedades enviadas por el cliente en el cuerpo de la petición (req.body)
        const { nombre, descripcion, precio, stock, imagen_url, categoria, sabor } = req.body;
        // Valida que los campos obligatorios (nombre, precio e imagen_url) no estén vacíos
        if (!nombre || !precio || !imagen_url) {
            // Si falta alguno de los campos obligatorios, responde con un código 400 (Bad Request) y un mensaje informativo
            return res.status(400).json({ error: 'nombre, precio e imagen_url requeridos' });
        }
        // Llama a la función crearHelado del modelo pasándole el objeto con las propiedades recibidas
        const { data, error } = await crearHelado({
            nombre, descripcion, precio, stock, imagen_url, categoria, sabor
        });
        // Si la base de datos devuelve un error durante la inserción, responde con un código de estado 500
        if (error) return res.status(500).json({ error: 'Error al crear' });
        // Si se crea con éxito, responde con un código 201 (Created) enviando el primer elemento insertado (data[0])
        return res.status(201).json({ message: 'Creado', helado: data[0] });
    } catch (error) {
        // Captura cualquier fallo imprevisto del código y responde con un código 500 y el mensaje de la excepción
        return res.status(500).json({ error: error.message });
    }
};

// Controlador para modificar o actualizar la información de un helado existente
export const editar = async (req, res) => {
    try {
        // Extrae el ID del helado desde los parámetros de la URL de la solicitud (req.params)
        const { id } = req.params;
        // Llama a la función actualizarHelado del modelo enviando el ID y todo el cuerpo recibido de la petición (req.body)
        const { data, error } = await actualizarHelado(id, req.body);
        // Si ocurre un problema en la actualización desde la base de datos, devuelve un código de estado 500
        if (error) return res.status(500).json({ error: 'Error al actualizar' });
        // Si la actualización es exitosa, responde con un código 200 (OK) enviando los nuevos datos del helado modificado (data[0])
        return res.status(200).json({ message: 'Actualizado', helado: data[0] });
    } catch (error) {
        // Captura errores inesperados durante el proceso de edición y retorna un código 500 junto al mensaje del fallo
        return res.status(500).json({ error: error.message });
    }
};


// Controlador para borrar permanentemente un registro de helado de la base de datos
export const eliminar = async (req, res) => {
    try {
        // Extrae el ID del helado desde los parámetros de la URL de la solicitud (req.params)
        const { id } = req.params;
        // Llama a la función eliminarHelado del modelo pasándole el ID del registro a borrar
        const { error } = await eliminarHelado(id);
        // Si ocurre un problema en la base de datos durante la eliminación, responde con un código 500 y un mensaje de error
        if (error) return res.status(500).json({ error: 'Error al eliminar' });
        // Si el borrado se completa con éxito, responde con un código de estado 200 (OK) y un mensaje confirmando la acción
        return res.status(200).json({ message: 'Eliminado' });
    } catch (error) {
        // Captura cualquier fallo inesperado del servidor y responde con un código 500 junto al mensaje de la excepción
        return res.status(500).json({ error: error.message });
    }
};