document.getElementById('formEliminarCuenta').addEventListener('submit', async (event) => {
    event.preventDefault();

    const contraseñaActual = document.getElementById('contraseñaActual').value;

    console.log('Contraseña actual:', contraseñaActual);

    try {
        const response = await fetch('/eliminarCuenta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contraseñaActual
            })
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la cuenta.');
        }

        const result = await response.json();
        console.log("Respuesta del servidor: ", result);
        document.getElementById('mensaje').innerHTML = `<div class="alert alert-success">${result.mensaje}</div>`;
        session.clear();
        window.location.href = '/index.html';
    } catch (error) {
        console.log("Error en la solicitud: ", error);
        document.getElementById('mensaje').innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
});
