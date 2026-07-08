//importar toda la funcionalida de express
import express from 'express';
import dotenv from 'dotenv'; 
import { conectarDB, supabase} from './config/supabase.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import heladoRoutes from './routes/helados.js';
import pedidoRoutes from './routes/pedidos.js';



//cargar variable de entorno 
dotenv.config();
conectarDB();

//creamos la aplicacion de express
const app = express();

// leer el json
app.use(express.json());

// creamos la ruta
app.get('/', (req, res) => {
    res.json({
        mensaje: 'bienvenido al backend de MIMOS',
        estado: 'en linea',
        version: '1.0.0'
    });
});
//ruta de autenticacion 
app.use('/auth', authRoutes);
app.use('/usuarios', userRoutes);
app.use('/helados',  heladoRoutes);
app.use('/pedidos', pedidoRoutes);
// configuramos el puerto
const PORT = 3000;

// poner a escuchar el servidor
app.listen(PORT, () => {
    conectarDB(); // Llama a la función para ver el mensaje en consola al iniciar
    console.log(`Servidor escuchando en el puerto ${PORT}`); // Corregido a backticks ``
    console.log(`http://localhost:${PORT}`);
});