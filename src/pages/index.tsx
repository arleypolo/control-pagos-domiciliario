import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Si ya está logueado, redirige al dashboard
        window.location.href = "/dashboard";
      } else {
        // Si no, redirige al login
        window.location.href = "/login";
      }
    };

    checkSession();
  }, []);

  return <p>Cargando...</p>;
}
