import React, { useState } from 'react';
import './ReporteForm.css'; // Estilos para el formulario

const ReporteForm = () => {
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado');
    setShowForm(false); // Ocultar el formulario al enviarlo
  };

  return (
    <div className="reporte-form-wrapper">
      {/* Botón Crear Reporte */}
      <button
        className={`crear-reporte-btn ${showForm ? 'hidden' : ''}`} // Oculta el botón al mostrar el formulario
        onClick={() => setShowForm(true)}
      >
        Crear reporte
      </button>

      {/* Formulario con animación */}
      <div className={`form-container ${showForm ? 'show-form' : 'hide-form'}`}>
        {showForm && (
          <>
            {/* Botón cerrar */}
            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>
            <h2>Reporte de escasez</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Número de cuenta del cliente"
                required
                className="form-input"
              />
              <textarea
                placeholder="Observaciones"
                className="form-textarea"
                rows="4"
              ></textarea>
              <button type="submit" className="submit-btn">
                Enviar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReporteForm;
