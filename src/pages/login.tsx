import { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message);
        else alert("Revisa tu correo para iniciar sesión ✅");
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
                <h1 style={{ margin: 0, fontWeight: 700, fontSize: "2rem", color: "#222" }}>Iniciar sesión</h1>
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
                <button
                    onClick={handleLogin}
                    style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                >
                    Ingresar
                </button>
                <p style={{ fontSize: "0.95rem", color: "#555", textAlign: "center", margin: 0 }}>
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/register"
                        style={{
                            color: "#6366f1",
                            textDecoration: "none",
                            fontWeight: 500,
                        }}
                    >
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}