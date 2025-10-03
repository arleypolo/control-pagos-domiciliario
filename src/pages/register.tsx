import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);
        if (error) alert(error.message);
        else alert("Revisa tu correo para confirmar el registro ✅");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                fontFamily: "Inter, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "2.5rem 2rem",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    minWidth: "320px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                }}
            >
                <h1 style={{ margin: 0, fontWeight: 700, fontSize: "2rem", color: "#222" }}>Registro</h1>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border 0.2s",
                    }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border 0.2s",
                    }}
                />
                <button
                    onClick={handleRegister}
                    disabled={loading}
                    style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        transition: "background 0.2s, opacity 0.2s",
                    }}
                >
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
                <p style={{ fontSize: "0.95rem", color: "#555", textAlign: "center", margin: 0 }}>
                    ¿Ya tienes cuenta?{" "}
                    <a
                        href="/login"
                        style={{
                            color: "#6366f1",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                    >
                        Inicia sesión
                    </a>
                </p>
            </div>
        </div>
    );
}