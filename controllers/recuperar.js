import { crearCodigoRecuperacion ,obtenerCodigoValido , marcarComoUsado } from "../models/recuperar.js";
import { obtenerPorEmail ,actualizarUsuario } from "../models/user.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// configuramos el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// configurar la logica para enviar el correo de recuperacion 
export const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
         
        if (!email) {
            return res.status(400).json({ error: 'El correo es requerido' });
        }

        // 1. Verificar si el usuario existe (Usando tu modelo con .single())
        const { data: usuario, error: errorusuario } = await obtenerPorEmail(email);

        // Si Supabase devuelve un error (como PGRST116 de que no encontró filas) o 'usuario' es undefined
        if (errorusuario || !usuario) {
            console.log("Aviso: Usuario no encontrado o error en consulta:", errorusuario?.message || "Sin datos");
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Generar codigo de recuperacion 
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // codigo de 6 digitos

        // 3. Guardar el codigo en la base de datos
        const { error: errorCodigo } = await crearCodigoRecuperacion(usuario.id, codigo);

        if (errorCodigo) {
            console.error("Error al insertar el código en la base de datos:", errorCodigo);
            return res.status(500).json({ error: 'error al generar el codigo de recuperacion' });
        }

        // 4. Creamos el email de codigo de recuperacion 
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Tu código de recuperación es: ${codigo}`,
            html: `
                <h2> recuperacion de contraseña </h2>
                <p>Hola ${usuario.nombre || 'usuario'},</p>
                <p>Tu código de recuperación es:</p>
                <h1 style="color: #de15a2; font-size: 36px;">${codigo}</h1>
                <p> este codigo es valido por 15 minutos. si no solicitaste este correo, por favor ignóralo. </p>
                <p> gracias,</p>
                <p>el equipo de soporte </p>
                <p>no compartas este codigo con nadie </p>
            `
        });

        return res.status(200).json({ message: 'codigo de recuperacion enviado al correo' });

    } catch (error) {
        console.error('error en forgotPassword:', error);
        return res.status(500).json({ error: 'error al enviar el correo ' });
    }
};

//cambiar contraseña y verificar el codigo 
export const verifyCode = async (req, res) => {
    try {
        const { email, codigo, newPassword } = req.body;

        //verificamos la entrada de datos


        if (!email || !codigo || !newPassword) {
            return res.status(400).json({ error: 'El correo, el código y la nueva contraseña son requeridos' });
        }

        // verificar si el usuraio esta en la base de datos

        // 1. Buscar el usuario por correo
        const { data:usuario } = await obtenerPorEmail(email);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Verificar el código de recuperacion
        const { data: codigoRecord} = await obtenerCodigoValido(usuario.id, codigo);

        if (!codigoRecord) {
            return res.status(400).json({ error: 'Código inválido o expirado' });
        }

        // 3. encriptamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Actualizamos la contraseña en la base de datos
        const { error: updateError } = await actualizarUsuario(usuario.id, { password: hashedPassword });
// O si se llama contrasena: { contrasena: hashedPassword }

        if (updateError) throw updateError;

        //5. marcamos el codigo como usado para que no se pueda reutilizar
    
        await marcarComoUsado (codigoRecord.id); 

        //6. respondemos al cliente que la contraseña se cambio correctamente

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Contraseña cambiada exitosamente',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; padding: 20px; border-radius: 5px; ">
                <h2 style="color: #333;">notificacion de cambio de contraseña</h2>
                <p> hola ${usuario.nombre || 'usuario'},</p>
                <p> Tu contraseña ha sido cambiada exitosamente.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #39a900; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px color : #555;">
                Si no realizaste este cambio, te recomendamos que contactes a nuestro soporte inmediatamente.</p>
                </div>
                <p style=color: #555; font-size: 14px;margin-top: 30px;">
                >gracias,</p>
                </div>
            `
        });
        return res.status(200).json({ message: 'contraseña cambiada exitosamente' });

    } catch (error) {
        console.error('error en verifyCode:', error);
        return res.status(500).json({ error: 'error al verificar el código' });
    }
};