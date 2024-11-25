const mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST || "localhost",
    user: process.env.MYSQL_ADDON_USER || "root",
    password: process.env.MYSQL_ADDON_PASSWORD || "",
    database: process.env.MYSQL_ADDON_DB|| "tienda",
    connectionLimit:5
});
conexion.connect((err)=>{
    if(err){
        console.error(err);
        return;
    }
    console.log("conectado");
})
module.exports = conexion;