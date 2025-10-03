import { useEffect, useState, useMemo } from "react";
import { supabase } from "./lib/supabaseClient";
import { isWorkingDay } from "../utils/schedule";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Pago {
    id: string;
    fecha: string;
    monto: number;
    total: number;
}

type PagosPorMes = {
    [mes: string]: Pago[];
};

function agruparPagosPorMes(pagos: Pago[]) {
    const grupos: PagosPorMes = {};
    pagos.forEach((pago) => {
        const fecha = parseISO(pago.fecha);
        const mes = format(fecha, "MMMM yyyy", { locale: es });
        if (!grupos[mes]) grupos[mes] = [];
        grupos[mes].push(pago);
    });
    return grupos;
}

export default function Dashboard() {
    const [pagos, setPagos] = useState<Pago[]>([]);
    const [comisiones, setComisiones] = useState("");
    const [montoBase, setMontoBase] = useState(50000);
    const [total, setTotal] = useState(0);
    const [abierto, setAbierto] = useState<{ [mes: string]: boolean }>({});
    const hoy = useMemo(() => new Date(), []);

    useEffect(() => {
        if (isWorkingDay(hoy)) {
            setMontoBase(50000);
        } else {
            setMontoBase(0);
        }
    }, [hoy]);

    useEffect(() => {
        setTotal(montoBase + Number(comisiones || 0));
    }, [comisiones, montoBase]);

    const fetchPagos = async () => {
        const { data, error } = await supabase
            .from("pagos")
            .select("*")
            .order("fecha", { ascending: false });

        if (!error && data) setPagos(data);
    };

    const addPago = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return alert("Debes iniciar sesión");

        const { error } = await supabase.from("pagos").insert([
            {
                fecha: hoy.toISOString().split("T")[0],
                monto: montoBase,
                total: total,
                user_id: user.id,
            },
        ]);

        if (error) alert(error.message);
        else {
            setComisiones("");
            fetchPagos();
        }
    };

    useEffect(() => {
        fetchPagos();
    }, []);

    const pagosPorMes = agruparPagosPorMes(pagos);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
                fontFamily: "Inter, Arial, sans-serif",
                padding: "2rem 0",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: "1rem",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    padding: "2.5rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    boxSizing: "border-box",
                }}
            >
                <h1 style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "2rem",
                    color: "#222",
                    textAlign: "center",
                    wordBreak: "break-word"
                }}>
                    Control de Pagos
                </h1>

                {isWorkingDay(hoy) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ margin: 0, color: "#6366f1", fontWeight: 600 }}>Hoy trabajas</p>
                        <p style={{ margin: 0, color: "#222" }}>
                            Monto base: <b>{montoBase.toLocaleString("es-CO")} COP</b>
                        </p>

                        <input
                            type="number"
                            placeholder="Comisiones de domicilios"
                            value={comisiones}
                            onChange={(e) => setComisiones(e.target.value)}
                            style={{
                                padding: "0.75rem 1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid #e5e7eb",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border 0.2s",
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                        />

                        <p style={{ margin: 0, color: "#222" }}>
                            Total del día: <b>{total.toLocaleString("es-CO")} COP</b>
                        </p>

                        <button
                            onClick={addPago}
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
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                        >
                            Registrar
                        </button>
                    </div>
                ) : (
                    <p style={{ color: "#94a3b8", textAlign: "center", fontSize: "1.1rem" }}>
                        Hoy descansas <span role="img" aria-label="descanso">😴</span>
                    </p>
                )}

                <div>
                    <h2 style={{
                        fontSize: "1.2rem",
                        color: "#222",
                        marginBottom: "1rem",
                        marginTop: 0,
                        fontWeight: 600,
                        textAlign: "center"
                    }}>
                        Historial por mes
                    </h2>
                    {Object.keys(pagosPorMes).length === 0 && (
                        <div style={{ color: "#94a3b8", fontSize: "1rem", textAlign: "center" }}>Sin registros aún.</div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {Object.entries(pagosPorMes).map(([mes, pagosMes]) => (
                            <div
                                key={mes}
                                style={{
                                    background: "#f1f5f9",
                                    borderRadius: "0.75rem",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                    padding: "1rem",
                                    width: "100%",
                                    boxSizing: "border-box"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        setAbierto((prev) => ({
                                            ...prev,
                                            [mes]: !prev[mes],
                                        }))
                                    }
                                >
                                    <span style={{
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                        color: "#6366f1",
                                        wordBreak: "break-word"
                                    }}>
                                        {mes.charAt(0).toUpperCase() + mes.slice(1)}
                                    </span>
                                    <span style={{ fontSize: "1.3rem", color: "#6366f1" }}>
                                        {abierto[mes] ? "▲" : "▼"}
                                    </span>
                                </div>
                                {abierto[mes] && (
                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "1rem 0 0 0",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.75rem"
                                    }}>
                                        {pagosMes.map((p) => (
                                            <li
                                                key={p.id}
                                                style={{
                                                    background: "#fff",
                                                    borderRadius: "0.5rem",
                                                    padding: "0.75rem 1rem",
                                                    color: "#222",
                                                    fontSize: "1rem",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.2rem",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                <span style={{ fontWeight: 500 }}>
                                                    {format(parseISO(p.fecha), "d 'de' MMMM 'del' yyyy", { locale: es })}
                                                </span>
                                                <span style={{ fontSize: "0.95rem", color: "#6366f1" }}>
                                                    Base: {p.monto.toLocaleString("es-CO")} | Total: {p.total.toLocaleString("es-CO")}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>
                {`
                @media (max-width: 600px) {
                    div[style*="max-width: 420px"] {
                        max-width: 98vw !important;
                        padding: 1.5rem 0.5rem !important;
                    }
                    h1, h2 {
                        font-size: 1.3rem !important;
                    }
                }
                `}
            </style>
        </div>
    );
}