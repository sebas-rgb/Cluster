require("dotenv").config();
const express = require("express");
const supabase = require("./supabaseClient");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

async function getUsuarios() {
  const { data, error } = await supabase.schema("public").from("usuarios").select("*");

  if (error) {
    throw error;
  }

  return data;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.get("/Usuarios", async (req, res) => {
  try {
    const Usuarios = await getUsuarios();
    res.json(Usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
