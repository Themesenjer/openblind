const loginForm = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Petición al endpoint 2 de tu archivo express
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.style.color = 'green';
      mensaje.textContent = `¡Bienvenido ${data.user.nombre}!`;
      
      // Guardar datos de sesión en el navegador
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      mensaje.style.color = 'red';
      mensaje.textContent = data.message; // Muestra el mensaje enviado por AppError
    }
  } catch (error) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Error al conectar con el servidor backend.';
  }
});