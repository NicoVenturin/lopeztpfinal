const formularioLogin = document.forms['formularioLogin'];  
formularioLogin.addEventListener('submit', (event) => {
  event.preventDefault();

  const nombre = formularioLogin.nombre.value;
  const contraseña = formularioLogin.contraseña.value;

  if (!nombre || !contraseña) {
    document.querySelector('#mensaje').innerHTML = '*Complete todos los datos';
    return;
  }

  const datosLogin = { nombre, contraseña };

  const login = async () => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosLogin),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log('Datos del usuario:', data);

      loginUsuario(data);  
       if (data.id_tip_usu==1) {
        window.location.href = '/productosadmin.html'; 
      } 
      else{
        window.location.href = '/index.html';  
      }
    } catch (error) {
      console.error('Error de login:', error);
      document.querySelector('#mensaje').innerHTML = 'Error al intentar iniciar sesión';
    }
  };

  login();
});

function loginUsuario(usuario) {
  localStorage.setItem('usuarioLogueado', JSON.stringify(usuario)); 
  mostrarNavbar();
}

function logOut() {
  localStorage.removeItem('usuarioLogueado'); 
  mostrarNavbar();
}

function mostrarNavbar() {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
  
  if (usuarioLogueado) {
      document.getElementById('salir').style.display = 'block';
      document.getElementById('botonIngresar').style.display = 'none';
      document.getElementById('usuarioDropdown').querySelector('.nav-link').innerText = `Hola, ${usuarioLogueado.nombre}`; 
  } else {
      document.getElementById('salir').style.display = 'none';
      document.getElementById('botonIngresar').style.display = 'block';
  }
}

mostrarNavbar();