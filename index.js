const express = require("express");
const path = require("path");
const supabase = require("./supabaseClient");

const app = express();

async function getUsuarios() {
  const { data, error } = await supabase.from("usuarios").select("*");

  if (error) {
    throw error;
  }

  return data;
}

app.use(express.static(path.join(__dirname, "public")));

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
