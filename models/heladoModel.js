import {supabase} from "../config/supabase.js";

// Sirve para consultar y traer TODOS los registros que existan en la tabla 'helados'
export const obtenerTodos = async () => {
    const { data, error } = await supabase.from('helados').select('*');
    return { data, error };
};

// Sirve para buscar un único helado en la tabla utilizando su 'id' único
export const obtenerPorId = async (id) => {
    const { data, error } = await supabase
        .from('helados').select('*').eq('id', id).single();
    return { data, error };
};

// Sirve para filtrar y traer todos los helados que pertenezcan a una 'categoria' específica
export const obtenerPorCategoria = async (categoria) => {
    const { data, error } = await supabase
        .from('helados').select('*').eq('categoria', categoria);
    return { data, error };
};

// Sirve para insertar (guardar) un nuevo helado en la base de datos con los datos recibidos en 'heladoData'
export const crearHelado = async (datos) => {
    return await supabase
        .from('helados')
        .insert([datos])
        .select(); // 👈 OBLIGATORIO para que devuelva la fila insertada en 'data'
};

// Sirve para modificar o actualizar los datos de un helado existente buscando por su 'id'
export const actualizarHelado = async (id, heladoData) => {
    const { data, error } = await supabase
        .from('helados').update(heladoData).eq('id', id).select();
    return { data, error };
};

// Sirve para borrar permanentemente un helado de la base de datos utilizando su 'id'
export const eliminarHelado = async (id) => {
    const { data, error } = await supabase
        .from('helados').delete().eq('id', id);
    return { data, error };
};