import { useState } from 'react';
import logo from './assets/logo.png';
import './App.css';

function App() {
    const [username, setUsername] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleValidateClick = async () => {
        if (!username.trim()) {
            setResultMessage("Por favor, ingrese un nombre de usuario.");
            setIsSuccess(false);
            return;
        }

        setIsLoading(true);
        setResultMessage(null);

        try {
            const response = await fetch(import.meta.env.VITE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY
                },
                body: JSON.stringify({ usernames: [username] })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.response && data.response.length > 0) {
                    const resultadoUsuario = data.response[0];
                    
                    if (resultadoUsuario.exists === "SI") {
                        setIsSuccess(true);
                        setResultMessage(`El usuario existe, es valido y pertenece al codigo ${resultadoUsuario.codigo}`);
                    } else {
                        setIsSuccess(false);
                        setResultMessage("El usuario no existe.");
                    }
                } else {
                    setIsSuccess(false);
                    setResultMessage("El servidor no devolvió datos legibles.");
                }
            } else {
                setIsSuccess(false);
                setResultMessage(data.message || "El usuario no se pudo validar.");
            }

        } catch (error) {
            console.error("Error en la petición:", error);
            setIsSuccess(false);
            setResultMessage("Error de conexión con el servidor. Intente de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-background">
            <div className="validation-card">

                <img src={logo} alt="Logo" className="logo" />

                <h2>Valide si su usuario existe</h2>

                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Escriba su usuario aquí"
                        value={username}
                        onChange={(e) => {
                            const textoEnMinusculas = e.target.value.toLowerCase();
                            const textoFiltrado = textoEnMinusculas.replace(/[^a-z.]/g, '');
                            setUsername(textoFiltrado);
                        }}
                        className="user-input"
                        disabled={isLoading}
                    />

                    <button
                        onClick={handleValidateClick}
                        className="validate-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Validando..." : "Validar usuario"}
                    </button>
                </div>

                {resultMessage && (
                    <div className={`message-box ${isSuccess ? 'success' : 'error'}`}>
                        {resultMessage}
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;