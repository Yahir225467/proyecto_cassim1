import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Asegúrate de que el archivo CSS esté en la misma carpeta o ajusta la ruta

function HomePage() {
    return (
        <div className="homepage">
            <h1 className="homepage-title">Sistema de Información Cortes de Agua Hidalgo CASSIM</h1>
            <div className="cards-container">
                <div className="card">
                    <img src="url-a-la-imagen-1" alt="Formulario de Reportes" className="card-image" />
                    <h2 className="card-title">Formulario de Reportes</h2>
                    <p className="card-description">
                        Plataforma para realizar los reportes de cortes de agua en Hidalgo.
                    </p>
                    <Link to="/formulario" className="card-button">
                        Entrar
                    </Link>
                </div>
                <div className="card">
                    <img src="url-a-la-imagen-2" alt="Mapa de Reportes" className="card-image" />
                    <h2 className="card-title">Mapa de Reportes</h2>
                    <p className="card-description">
                        Informacion sobre los reportes de cortes de agua en Hidalgo.
                    </p>
                    <Link to="/mapa" className="card-button">
                        Entrar
                    </Link>
                </div>
                <div className="card">
                    <img src="url-a-la-imagen-3" alt="EXTRA" className="card-image" />
                    <h2 className="card-title">EXTRA</h2>
                    <p className="card-description">
                        EXTRA.
                    </p>
                    <button className="card-button">Entrar</button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
