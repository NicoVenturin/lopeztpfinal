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

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`)
});