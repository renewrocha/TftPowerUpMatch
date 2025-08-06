const fs = require('fs');
const fetch = require('node-fetch');

const token = process.env.GIST_UPLOAD_TOKEN;
const gistId = process.env.GIST_ID;

if (!token) {
  console.error("❌ Defina GITHUB_TOKEN como variável de ambiente");
  process.exit(1);
}

const files = [
  'tft_powerups_pt.json',
  'tft_powerup_desc_pt.json',
  'tft_powerup_ranking_pt.json',
  'tft_powerups_en.json',
  'tft_powerup_desc_en.json',
  'tft_powerup_ranking_en.json'
];

const payload = {
  description: "Arquivos JSON do projeto Powerup TFT",
  public: false,
  files: {}
};

for (const filename of files) {
  if (fs.existsSync(filename)) {
    payload.files[filename] = {
      content: fs.readFileSync(filename, 'utf8')
    };
  } else {
    console.warn(`⚠️ Arquivo não encontrado: ${filename}`);
  }
}

const url = `https://api.github.com/gists/${gistId}`;

fetch(url, {
  method: 'PATCH',
  headers: {
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(json => {
    if (json.id) {
      console.log(`✅ Gist atualizado com sucesso: ${json.html_url}`);
    } else {
      console.error("❌ Erro ao atualizar gist:", json);
    }
  });
