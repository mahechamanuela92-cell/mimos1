import { crearCodigoRecuperacion } from "../models/recuperar.js";
import { obtenerPorEmail } from "../models/user.js";
import nodemailer from 'nodemailer';

//configuramos el transporte de nodemailer

const transporter =nodemailer.createtransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//configurar la logica para enviar el correo de recuperacion 
export const forgotpassword = async (req, res)=>{
    try {

    const {email} = req.body;
     
    if  (!email){
        return res.status(400).json({error: 'El correo es requerido'});
    }

    //verificar si el usuario existe
    const {data: usuario, error: errorusuario}= await obtenerPorEmail(email);

    if (errorusuario || !usuario){
        return res.status(404).json({error: 'Usuario no encontrado'});
    }
 //generar codigo de recuperacion 
 const codigo = math.floor(100000 + math.random() * 900000).toString(); //codigo de 6 digitos

 


    }catch (error){}
}

