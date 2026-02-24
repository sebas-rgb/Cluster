const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");
const tableContainer = document.getElementById("tableContainer");
const reloadBtn = document.getElementById("reloadBtn");

function renderTable(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    tableContainer.innerHTML = "<p style='padding:12px'>No hay registros en la tabla <strong>usuarios</strong>.</p>";
    countEl.textContent = "0 registros";
    return;
  }

  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => set.add(key));
      return set;
    }, new Set())
  );

  const thead = `<thead><tr>${columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((row) => {
      const tds = columns
        .map((column) => {
          const value = row?.[column];
          const text =
            value === null || value === undefined
              ? ""
              : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);
          return `<td><pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></td>`;
        })
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("")}</tbody>`;

  tableContainer.innerHTML = `<table>${thead}${tbody}</table>`;
  countEl.textContent = `${rows.length} registro(s)`;
}

async function loadUsuarios() {
  statusEl.className = "muted";
  statusEl.textContent = "Cargando...";

  try {
    const response = await fetch("/usuarios");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Error consultando /usuarios");
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
