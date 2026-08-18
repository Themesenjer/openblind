'use client';

import React, { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [speechMessage, setSpeechMessage] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(true);

  // Función para reproducir el mensaje de voz (Accesibilidad Antigravity)
  const hablarMensaje = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Detener audios anteriores
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Cargar usuarios desde la API backend (GET)
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();

      if (data.success) {
        setUsuarios(data.data || []);
        setSpeechMessage(data.speechMessage);
        hablarMensaje(data.speechMessage);
      }
    } catch (error) {
      const msgError = 'Error al conectar con el servidor para obtener usuarios.';
      setSpeechMessage(msgError);
      hablarMensaje(msgError);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Actualizar un usuario (PUT)
  const handleEdit = async (usuario: Usuario) => {
    const nuevoNombre = prompt('Ingrese el nuevo nombre:', usuario.nombre);
    if (!nuevoNombre) return;

    const nuevoEmail = prompt('Ingrese el nuevo email:', usuario.email);
    if (!nuevoEmail) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          email: nuevoEmail,
          rol: usuario.rol,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSpeechMessage(data.speechMessage);
        hablarMensaje(data.speechMessage);
        cargarUsuarios(); // Recargar la lista
      }
    } catch (error) {
      const msgError = 'Ocurrió un error al intentar actualizar el usuario.';
      setSpeechMessage(msgError);
      hablarMensaje(msgError);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Gestión de Usuarios - OpenBlind</h1>

      {/* Banner de accesibilidad para mensajes de audio */}
      {speechMessage && (
        <div
          style={{
            backgroundColor: '#e6fffa',
            border: '1px solid #319795',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            color: '#234e52',
          }}
        >
          <strong>🔊 Respuesta del Servidor:</strong> {speechMessage}
        </div>
      )}

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Nombre</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Email</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Rol</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}>{u.id}</td>
                  <td style={{ padding: '12px' }}>{u.nombre}</td>
                  <td style={{ padding: '12px' }}>{u.email}</td>
                  <td style={{ padding: '12px' }}>{u.rol}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleEdit(u)}
                      style={{
                        backgroundColor: '#3182ce',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Editar (PUT)
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '12px', textAlign: 'center' }}>
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}