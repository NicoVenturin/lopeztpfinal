//modulos
const express = require('express');
const db = require('./db/conexion');
const fs = require('fs'); //Permite trabajar con archivos (file system) incluida con node, no se instala
const cors = require('cors');
require('dotenv/config');
const app = express();
const port = process.env.MYSQL_ADDON_PORT || 3000;


//Middleware
app.use(express.json())
app.use(express.static('./public')) //Ejecuta directamente el front al correr el servidor
app.use(cors())



app.get('/productos', (req, res) => {
   // res.send('Listado de productos')
   const sql = "SELECT * FROM datos";
   db.query(sql,(err,result)=>{
    if(err){
        console.error("error de lectura");
        return;
    }
    //console.log(result);
    res.json(result);
   })
})

app.get('/productos/:id', (req, res) => {
    //res.send('Buscar producto por ID')
    const datos = leerDatos();
    const prodEncontrado= datos.productos.find ((p) => p.id == req.params.id)
    if (!prodEncontrado) { // ! (no) o diferente
        return res.status(404).json(`No se encuentra el producto`)
    }
    res.json({
        mensaje: "producto encontrado",
        producto: prodEncontrado
    })
})

app.post('/productos', (req, res) => {
    //console.log(req.body);
    //console.log(Object.values(req.body));
    const sql = "INSERT INTO datos (titulo, descripcion, precio, imagen) VALUES (?,?,?,?)";
    const values = Object.values(req.body);
    db.query(sql,values,(err,result)=>{
        if(err){
            console.error("error al guardar", err);
            return;
        }
        //console.log(result);
        res.json({mensaje:"nuevo producto agregado"});
       })
    })


app.put('/productos', (req, res) => {
    const valores = Object.values(req.body);
    //console.log(valores);
    const sql = "UPDATE datos SET titulo=?, descripcion=?, precio=? WHERE id=?";
    db.query(sql,valores,(err,result)=>{
        if(err){
            console.error("error al modificar: ",err);
            return;
        }
        res.json({mensaje:'Producto actualizado', data:result});
    })
})

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    sql = "DELETE FROM datos WHERE id=?";
    db.query(sql,[id],(err,result)=>{
        if(err){
            console.error("error al borrar", err);
            return;
        }
        //console.log(result);
        res.json({mensaje:"producto borrado"});
       })

})
app.post('/registro', (req, res) => {
    console.log("Datos recibidos en el registro:", req.body);

    const { nombre, contraseña, id_tip_usu } = req.body;

    if (!nombre || !contraseña || id_tip_usu === undefined) {
        console.log("Datos faltantes en la solicitud");
        return res.status(400).send('Faltan datos');
    }

    if (typeof id_tip_usu !== 'number' || id_tip_usu < 0) {
        console.log("Valor de id_tip_usu inválido");
        return res.status(400).send('id_tip_usu inválido');
    }

    const query = 'INSERT INTO usuarios (nombre, contraseña, id_tip_usu) VALUES (?, ?, ?)';
    db.query(query, [nombre, contraseña, id_tip_usu], (err, result) => {
        if (err) {
            console.error("Error al registrar el usuario:", err);
            return res.status(500).send('Error al registrar el usuario');
        }

        const idGenerado = result.insertId;  
        console.log("Usuario registrado con ID:", idGenerado);

        res.status(200).json({
            mensaje: 'Usuario registrado correctamente',
            id: idGenerado 
        });
    });
});
app.post('/login', (req, res) => {
    const { nombre, contraseña } = req.body;

    if (!nombre || !contraseña) {
        return res.status(400).send('Faltan datos');
    }

    const query = 'SELECT * FROM usuarios WHERE nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            return res.status(500).send('Error al realizar la consulta');
        }

        if (results.length === 0) {
            return res.status(400).send('Usuario no encontrado');
        }

        const usuario = results[0];

        if (contraseña === usuario.contraseña) {
            req.session.id_usuario = usuario.id_usuario;  

            return res.status(200).json({
                mensaje: 'Login exitoso',
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                id_tip_usu: usuario.id_tip_usu
            });
        } else {
            return res.status(400).send('Contraseña incorrecta');
        }
    });
});

app.post('/modificarContra', (req, res) => {
    const { contraseñaActual, nuevaContraseña } = req.body;

    console.log("Datos recibidos: ", req.body);  

    if (!contraseñaActual || !nuevaContraseña || !req.session.id_usuario) {
        console.log("Faltan datos: ", { contraseñaActual, nuevaContraseña, id_usuario: req.session.id_usuario });
        return res.status(400).json({ mensaje: 'Faltan datos: contraseña actual, nueva contraseña o id_usuario en sesión.' });
    }

    const usuarioId = req.session.id_usuario; 

    const query = 'SELECT contraseña FROM usuarios WHERE id_usuario = ?';
    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.log("Error en la base de datos: ", err);
            return res.status(500).json({ mensaje: 'Error al consultar la base de datos.' });
        }

        if (results.length === 0) {
            console.log("Usuario no encontrado.");
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        if (contraseñaActual !== results[0].contraseña) {
            console.log("Contraseña actual incorrecta.");
            return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta.' });
        }

        const updateQuery = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';
        db.query(updateQuery, [nuevaContraseña, usuarioId], (err, result) => {
            if (err) {
                console.log("Error al actualizar la contraseña: ", err);
                return res.status(500).json({ mensaje: 'Error al actualizar la contraseña.' });
            }

            console.log("Contraseña actualizada correctamente.");
            return res.status(200).json({ mensaje: 'Contraseña cambiada correctamente.' });
        });
    });
});

app.post('/eliminarCuenta', (req, res) => {
    const { contraseñaActual } = req.body;

    if (!contraseñaActual || !req.session.id_usuario) {
        console.log("Faltan datos: ", { contraseñaActual, id_usuario: req.session.id_usuario });
        return res.status(400).json({ mensaje: 'Faltan datos: contraseña actual o id_usuario en sesión.' });
    }

    const usuarioId = req.session.id_usuario;  
    
    const query = 'SELECT contraseña FROM usuarios WHERE id_usuario = ?';
    db.query(query, [usuarioId], (err, results) => {
        if (err) {
            console.log("Error en la base de datos: ", err);
            return res.status(500).json({ mensaje: 'Error al consultar la base de datos.' });
        }

        if (results.length === 0) {
            console.log("Usuario no encontrado.");
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        if (contraseñaActual !== results[0].contraseña) {
            console.log("Contraseña actual incorrecta.");
            return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta.' });
        }

        const deleteQuery = 'DELETE FROM usuarios WHERE id_usuario = ?';
        db.query(deleteQuery, [usuarioId], (err, result) => {
            if (err) {
                console.log("Error al eliminar la cuenta: ", err);
                return res.status(500).json({ mensaje: 'Error al eliminar la cuenta.' });
            }

            req.session.destroy((err) => {
                if (err) {
                    console.log("Error al destruir la sesión: ", err);
                    return res.status(500).json({ mensaje: 'Error al destruir la sesión.' });
                }
                console.log("Cuenta eliminada correctamente.");
                return res.status(200).json({ mensaje: 'Cuenta eliminada correctamente.' });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});
