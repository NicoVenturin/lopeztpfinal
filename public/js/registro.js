const endpoint = '/registro';  
const formulario = document.forms['formularioRegistro'];

formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  let nombre = formulario.nombre.value;
  let contraseña = formulario.contraseña.value;
  let id_tip_usu = 0;  

  let newDatos = { nombre, contraseña, id_tip_usu };

  console.log("Datos enviados al servidor:", newDatos);  

  if (!newDatos.nombre || !newDatos.contraseña || newDatos.id_tip_usu === undefined) {
    document.querySelector('#mensaje').innerHTML = '*Complete todos los datos';
    return;
  } else {
    document.querySelector('#mensaje').innerHTML = 'Usuario creado';
  }

  let nuevosDatosJson = JSON.stringify(newDatos);

  const enviarRegistro = async () => {
    try {
      const enviarDatos = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: nuevosDatosJson,
      });

      if (!enviarDatos.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const respuesta = await enviarDatos.json();
      const idGenerado = respuesta.id;

      console.log('ID generado:', idGenerado);

      document.querySelector('#formularioRegistro').style.display = 'none';
      mostrarMensaje(respuesta.mensaje);

      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };
  enviarRegistro();
});