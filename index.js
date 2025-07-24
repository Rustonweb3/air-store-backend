// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Plugin = require('./pluginModel');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/plugins', express.static(path.join(__dirname, 'public/plugins')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Conecta ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Configuração do Multer para salvar arquivos na pasta plugins
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/plugins/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Rota para listar plugins (GET)
app.get('/api/plugins', async (req, res) => {
  const plugins = await Plugin.find().sort({ data: -1 });
  res.json(plugins);
});

// Rota para upload de plugins (POST)
app.post('/api/plugins/upload', upload.fields([
  { name: 'arquivo', maxCount: 1 },
  { name: 'icone', maxCount: 1 }
]), async (req, res) => {
  const { nome, descricao } = req.body;
  const arquivo = req.files['arquivo'][0].originalname;
  const icone = req.files['icone'][0].originalname;

  const novo = new Plugin({
    nome,
    descricao,
    arquivo: `/plugins/${arquivo}`,
    icone: `/plugins/${icone}`
  });

  await novo.save();
  res.json({ ok: true, plugin: novo });
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
