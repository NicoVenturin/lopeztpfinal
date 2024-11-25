import { navbar } from './navbar.js'; 
document.querySelector('#contenedornav').innerHTML = navbar;  
let botonIngresar = document.querySelector('#botonIngresar');  
var usuarioDropdown = document.querySelector('#salir');  

function actualizarNavbar() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')); 

    if (usuarioLogueado) {
        document.querySelector('#usuarioDropdown .nav-link').innerText = `Hola, ${usuarioLogueado.nombre}`;
        botonIngresar.style.display = "none"; 
        usuarioDropdown.style.display = "block"; 
    } else {
        botonIngresar.style.display = "block";
        usuarioDropdown.style.display = "none";
    }
}

actualizarNavbar();

botonIngresar.addEventListener('click', () => {
 window.location.href = 'login.html';
});

let botonLogOut = document.querySelector('#botonLogOut');
botonLogOut.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');
    actualizarNavbar();
});

import{footer} from './footer.js';
document.querySelector('#contenedorfooter').innerHTML = footer;
botonLogOut = document.querySelector('#botonLogOut');
botonLogOut.addEventListener('click', ()=>{
    botonIngresar.style.display = "block";
    usuarioDropdown.style.display = "none";
});
