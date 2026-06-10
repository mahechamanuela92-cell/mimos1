import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { crearusuario, obtenerPorEmail } from '../models/user.js';

//registro
export const registro = async (req,  res)=>{
    try{
        const {nombre,email,password}= req.body

        //validamos los datos 
        
        if (!nombre || !email || !password){
            return res.status (400).json({
              error:'faltan usuarios'
            });
        }

        //verificamos el gmail si ya existe 

        const {data: usuarioExiste }= await obtenerPorEmail (email);
        if (usuarioExiste){
            return res.status (400).json({
                error: 'el email ya existe'
            });
        }

        //encriptar el password
        const hashedpassword = await  bcrypt.hash(password,10);

        //crear la constante para rol po defautl
        const roldefecto ='usuario' 

        //guardar l base de datos 
        const {data, error}=await crearusuario(
            nombre, 
            email,
            hashedpassword,
            roldefecto
        );

        if (error){
            return res.status(500).json({
                error:"error al crear el usuario"

            });
        }
        return res.status(201).json({
            menssage:'usuario creado correctamente',
            usuario:{
                id: data[0].id,
                nombre: data[0].nombre,
                email: data[0].email,
                rol: data[0].rol
            }
        });


    }catch(error){
        console.error("error en el registro", error);
        return res.status(500).json({
            error: error.message 
        });


    }
};



//crear el LOGIN
export const login = async(req,res)=>{

    try {
       const {email,password}  = req.body;

       //validar que los campos esten llenos 
       if (!email || !password){
        return res.status(400).json({
            error: 'Todos los campos son requeridos : email y password'
        });
       }

       //validamos si existe el correo 

       const {data: usuario} = await obtenerPorEmail(email)
       if(!usuario){
        return res.status(400).json({
            error: 'El email no esta  registrado'
        });

        //validamos la contraseña
           const passwordvalida = await bcrypt.compare(password, usuario.contrasena);
           if(!passwordvalida){
            return res.status(400).json({
                error : 'password incorrecto'
            })
           };

       }
       //generamos el token JWT
       const token = jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        },
        process.env.jwt_secret,
        {expiresIn: '1h'}
       );
       return res.status(200).json({
        message: 'Login exitoso',
        token
       });


    } catch (error){
        console.error("Error en el login", error);
        return res.status(500).json({
            error: error.message
        });

    }
};