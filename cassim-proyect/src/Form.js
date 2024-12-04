import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Form.css";

const Formulario = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del cliente
  const [loading, setLoading] = useState(false); // Estado para mostrar un indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Simula una llamada a la API
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${data.numeroCliente}`
      );
      if (!response.ok) throw new Error("Cliente no encontrado");
      const result = await response.json();
      setUserData(result); // Actualiza el estado con los datos del cliente
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="responsive-form">
        <h2>Formulario</h2>

        {/* Campo Número de Cliente */}
        <div className="form-group">
          <label>Número de Cliente:</label>
          <input
            {...register("numeroCliente", {
              required: "El número de cliente es obligatorio",
              pattern: {
                value: /^[0-9]{6}$/, // Valida que sean 6 dígitos
                message: "Debe ser un número de 6 dígitos",
              },
            })}
            type="text"
            placeholder="Ingresa tu número de cliente"
          />
          {errors.numeroCliente && (
            <span className="error">{errors.numeroCliente.message}</span>
          )}
        </div>

        {/* Campo Comentario */}
        <div className="form-group">
          <label>Comentario :</label>
          <input
            {...register("comentario", {
              required: "Deje un comentario",
            })}
            type="text"
            placeholder="Escribe un comentario"
          />
          {errors.comentario && (
            <span className="error">{errors.comentario.message}</span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Enviar"}
        </button>
      </form>

      {/* Mostrar resultados */}
      {error && <p className="error">{error}</p>}
      {userData && (
        <div className="user-data">
          <h3>Datos del Cliente:</h3>
          <p>
            <strong>Nombre:</strong> {userData.name}
          </p>
          <p>
            <strong>Correo:</strong> {userData.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {userData.phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default Formulario;
