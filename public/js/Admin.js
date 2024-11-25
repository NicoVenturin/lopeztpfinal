const endpoint = '/productos'

// Event listener para el botón "Añadir Producto"
document.getElementById('añadir').addEventListener('click', function () {
  const formulario = document.getElementById('prodNuevo');
  formulario.classList.toggle('new');
});
mostrarMensaje = (mensaje) =>{
  document.querySelector('#mensajeConfirmacion').className += " bg-warning";
  document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
}
 //Eliminar Producto
 const eliminar = (id) =>{
  if(confirm('Seguro que quiere eliminar?')){
  console.log(id);
  console.log(endpoint+"/"+id);
  const eliminarProd = async() =>{
    try{
      const res = await fetch(endpoint+'/'+id, {
        method:'delete'
      })
      //Obtengo Respuesta
      const respuesta = await res.json();
      console.log("qaa")
      mostrarMensaje(respuesta.mensaje);
    }catch{
      mostrarMensaje('Error al borrar')
    }
    setTimeout(()=>{location.reload();},1000);
  }
  eliminarProd()
}
}

editar = (id) =>{
  console.log(id)
  document.querySelector('#contFormEditar').style.display='block';
  //contenedor de datos del producto
  let prodEditar = {};
  //recorre el array para buscar producto a editar
  productosRecibidos.filter(prod => {
    if(prod.id == id){
      prodEditar = prod;
    }
    
  })
  console.log(prodEditar);
  const formEditar = document.forms['formEditar'];
  formEditar.Titulo.value = prodEditar.titulo;
  formEditar.Descripcion.value = prodEditar.descripcion;
  formEditar.Precio.value = prodEditar.precio;
  formEditar.idEditar.value = prodEditar.id;
}

  formEditar.addEventListener('submit',(event)=>{
    event.preventDefault();
    // Creo objeto con nuevos datos
    const nuevosDatos ={
      titulo:formEditar.Titulo.value,
      descripcion:formEditar.Descripcion.value,
      precio:formEditar.Precio.value,
      id:formEditar.idEditar.value,
    }
    if (!nuevosDatos.titulo || !nuevosDatos.descripcion || !nuevosDatos.precio) {
      document.querySelector('#mensajeEditar').innerHTML = '*Complete todos los datos'
      return
    }
    else {
      document.querySelector('#mensajeEditar').innerHTML = ''
      // return
    }  
    //Validación de Campos Vacios Igual Anterior
    let nuevosDatosJson = JSON.stringify(nuevosDatos);
    // console.log(nuevosDatosJson)
    const enviarDatosNuevos = async () => {
      try {
        const enviarDatos = await fetch(endpoint,{
          method:'put',
          headers:{
            'content-type':'application/json'
           },
           body:nuevosDatosJson
        })
        const respuesta = await enviarDatos.json();
        // console.log(respuesta);
        mostrarMensaje(respuesta.mensaje);
      } catch (error) {
        mostrarMensaje("Error al modificar datos");     
        console.log(error);   
      }
    }
    
      enviarDatosNuevos();
     setTimeout(()=>{location.reload();}, 1000)
    }
  )


// fetch(endpoint)
//   .then(respuesta => respuesta.json())
//   .then(datos => mostrarProductos(datos))
let productos = ''
const contenedor = document.querySelector('#contProducAdmin')
const obtenerDatos = async() =>{
  try{
    const respuesta = await fetch(endpoint)
    productosRecibidos = await respuesta.json()
    productosRecibidos.forEach(prod =>{
      productos +=
      `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
            style="width: 100%; max-width: 300px; margin:30px">
            <img src="${prod.imagen}" class="card-img-top" alt="...">
            <div class="card-body ">
                <h4>${prod.titulo}</h4>
                <p class="card-text ">${prod.descripcion}</p>
            </div>
<div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2">
  <p class="card-text border border-secondary rounded p-2 mb-0">
    <strong>${prod.precio}</strong>
  </p>
  <div class="d-flex ms-auto">
    <a href="#prodEditar" onClick="editar(${prod.id})" class="btn btn-outline-warning me-2 edit">
      <i class="bi bi-pencil"></i>
    </a>
    <a class="btn btn-outline-danger" onClick="eliminar(${prod.id})" type="submit">
      <i class="bi bi-trash"></i>
    </a>
  </div>
</div>


        </div>`;
    })
    contenedor.innerHTML = productos;
  }catch(error){
    mostrarMensaje('Error al cargar productos');
  }
}
obtenerDatos();


const formulario = document.forms['formAñadir']
console.log(formulario)
formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  let titulo = formulario.Titulo.value
  let descripcion = formulario.Descripcion.value
  let precio = formulario.Precio.value
  let imagen = "https://picsum.photos/200/300?random=1"
  // console.log(titulo,descripcion,precio);

  // Objetos con los datos obtenidos en el formulario
  let newDatos = { titulo: titulo, descripcion: descripcion, precio: precio, imagen: imagen }


  if (!newDatos.titulo || !newDatos.descripcion || !newDatos.precio) {
    document.querySelector('#mensaje').innerHTML = '*Complete todos los datos'
    return
  }
  else {
    document.querySelector('#mensaje').innerHTML = ''
    // return
  }
 

  let nuevosDatosJson = JSON.stringify(newDatos)
  console.log(nuevosDatosJson)
  const enviarNewProducto = async() =>{ //enviar datos al back
    try{
      const enviarDatos = await fetch(endpoint, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: nuevosDatosJson
      })
      //obtengo la respuesta del back
      const respuesta = await enviarDatos.json()
      console.log(respuesta)
      // let mensajeConf = document.querySelector('#mensajeConfirmacion');
      // mensajeConf.className+= ' bg-warning';
      // mensajeConf.innerHTML = respuesta.mensaje;
      try{
        //document.querySelector('#formAñadir').reset();
        document.querySelector('#formAñadir').style.display='none';
        mostrarMensaje(respuesta.mensaje);
        setTimeout(()=>{location.reload();},1000);
      }
      catch(error){
        console.log(error);
      }
    }
    catch(error){
      console.log(error)
    }
  }
  enviarNewProducto()
})
