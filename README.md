TFT PowerUp Match

Ferramenta para analisar Powerups do TFT e identificar quais campeões podem usar um determinado Powerup, com suporte a PT-BR e EN.

O projeto combina:

Frontend estático (index.html) para consulta/análise

Scrapers em Node.js + Puppeteer para coletar dados do MetaTFT

JSONs gerados automaticamente (PT/EN)

GitHub Actions para atualização recorrente e envio para Gist

✨ Funcionalidades

Seleção de campeão e powerup

Sugestão de melhores campeões para usar antes (análise no frontend)

Exibição de informações do powerup (nome/descrição)

Favoritos no navegador

Suporte a idiomas PT / EN

Pipeline automatizado para manter os JSONs atualizados

🧱 Estrutura do projeto
TftPowerUpMatch/
├── .github/workflows/
│   └── update-jsons.yml          # automação (scrape + gist)
├── scripts/
│   ├── gerar_frutas.js           # campeão -> lista de powerups
│   ├── gerar_descricao.js        # powerup -> descrição
│   ├── gerar_ranking.js          # powerup -> tier/ranking
│   └── upload_gist.js            # envia arquivos para Gist
├── index.html                    # interface web
├── package.json
├── tft_powerups_pt.json
├── tft_powerups_en.json
├── tft_powerup_desc_pt.json
└── tft_powerup_desc_en.json

Observação: os scripts também geram tft_powerup_ranking_pt.json e tft_powerup_ranking_en.json (quando executados), usados no fluxo de automação.

⚙️ Tecnologias usadas

HTML + JavaScript (frontend)

Node.js (CommonJS)

Puppeteer (scraping)

node-fetch (integração com API do GitHub/Gist)

GitHub Actions (automação)

📦 Requisitos

Node.js 18+ (recomendado Node 20)

npm

Acesso à internet (para ler dados do MetaTFT)
