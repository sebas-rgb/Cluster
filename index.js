const express = require("express");
const supabase = require("./supabaseClient");

const app = express();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function getUsuarios() {
  const { data, error } = await supabase.from("usuarios").select("*");

  if (error) {
    throw error;
  }

  return data;
}

app.get("/", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.send(`
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Usuarios (Supabase)</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; }
            pre { background: #f4f4f4; padding: 16px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Contenido de la tabla usuarios</h1>
          <p>Total registros: ${usuarios.length}</p>
          <p>Endpoint JSON: <a href="/usuarios">/usuarios</a></p>
          <pre>${escapeHtml(JSON.stringify(usuarios, null, 2))}</pre>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error consultando Supabase: ${escapeHtml(error.message)}`);
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
