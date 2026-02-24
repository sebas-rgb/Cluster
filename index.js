const express = require("express");
const supabase = require("./supabaseClient");

const app = express();

async function getUsuarios() {
  const { data, error } = await supabase.from("Usuarios").select("*");

  if (error) {
    throw error;
  }

  return data;
}

app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Usuarios - Supabase</title>
    <style>
      :root {
        --bg: #0f172a;
        --panel: #111827;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --accent: #22c55e;
        --danger: #ef4444;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Segoe UI, system-ui, sans-serif;
        background: radial-gradient(circle at top, #1e293b, #0f172a 60%);
        color: var(--text);
      }
      .container { max-width: 1000px; margin: 0 auto; padding: 24px; }
      .card {
        background: rgba(17, 24, 39, 0.9);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 18px;
      }
      h1 { margin: 0 0 8px; }
      .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
      button {
        background: var(--accent);
        color: #052e16;
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        cursor: pointer;
        font-weight: 700;
      }
      .muted { color: var(--muted); }
      .error { color: var(--danger); }
      .table-wrap {
        overflow: auto;
        max-height: 60vh;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.06);
      }
      table { width: 100%; border-collapse: collapse; }
      th, td {
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding: 10px;
        text-align: left;
        vertical-align: top;
        font-size: 0.95rem;
      }
      th { background: rgba(255,255,255,0.03); position: sticky; top: 0; }
      pre { white-space: pre-wrap; word-break: break-word; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>Tabla usuarios (Supabase)</h1>
        <div class="row">
          <button id="reloadBtn">Recargar</button>
          <span id="status" class="muted">Cargando...</span>
          <span id="count" class="muted"></span>
        </div>
        <div id="tableContainer" class="table-wrap"></div>
      </div>
    </div>
    <script>
      const statusEl = document.getElementById("status");
      const countEl = document.getElementById("count");
      const tableContainer = document.getElementById("tableContainer");
      const reloadBtn = document.getElementById("reloadBtn");

      function escapeHtml(text) {
        return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      function renderTable(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
          tableContainer.innerHTML = "<p style='padding:12px'>No hay registros en la tabla <strong>usuarios</strong>.</p>";
          countEl.textContent = "0 registros";
          return;
        }

        const columns = Array.from(rows.reduce((set, row) => {
          Object.keys(row || {}).forEach((key) => set.add(key));
          return set;
        }, new Set()));

        const thead = "<thead><tr>" + columns.map((c) => "<th>" + escapeHtml(c) + "</th>").join("") + "</tr></thead>";
        const tbody = "<tbody>" + rows.map((row) => {
          const tds = columns.map((column) => {
            const value = row && row[column];
            const text = value == null ? "" : (typeof value === "object" ? JSON.stringify(value) : String(value));
            return "<td><pre>" + escapeHtml(text) + "</pre></td>";
          }).join("");
          return "<tr>" + tds + "</tr>";
        }).join("") + "</tbody>";

        tableContainer.innerHTML = "<table>" + thead + tbody + "</table>";
        countEl.textContent = rows.length + " registro(s)";
      }

      async function loadUsuarios() {
        statusEl.className = "muted";
        statusEl.textContent = "Cargando...";

        try {
          const response = await fetch("/usuarios");
          const data = await response.json();

          if (!response.ok) {
            throw new Error((data && data.error) || "Error consultando /usuarios");
          }

          renderTable(data);
          statusEl.textContent = "Datos cargados";
        } catch (error) {
          tableContainer.innerHTML = "";
          countEl.textContent = "";
          statusEl.className = "error";
          statusEl.textContent = error.message;
        }
      }

      reloadBtn.addEventListener("click", loadUsuarios);
      loadUsuarios();
    </script>
  </body>
</html>`);
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
