// pluginModel.js
const mongoose = require('mongoose');

const PluginSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  icone: String,
  arquivo: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plugin', PluginSchema);
