# newcycle.ia

Marketplace B2B de leilões de equipamentos corporativos com IA.

Empresas que precisam se desfazer de equipamentos tiram uma foto — a IA identifica, descreve e sugere preço automaticamente. Compradores disputam os itens via leilão com preço mínimo público e prazo definido pelo vendedor.

## Funcionalidades

- Upload de foto → IA gera título, descrição, categoria e preço sugerido
- Sistema de leilão com preço mínimo público, incremento mínimo e prazo livre
- Painel do vendedor: dashboard, gestão de leilões, acompanhamento de lances em tempo real
- Verificação de CNPJ para empresas vendedoras
- Financeiro: repasses, comissões e histórico de transações
- Categorias: TI & Informática, Escritório, Industrial, AV & Telecom, Saúde

## Stack sugerida

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express (ou Next.js fullstack)
- **Banco de dados:** PostgreSQL
- **IA:** Anthropic Claude API (claude-sonnet-4-20250514) — análise de imagens
- **Storage:** AWS S3 ou Cloudflare R2 (fotos dos equipamentos)
- **Auth:** Clerk ou Supabase Auth
- **Pagamentos:** Stripe ou Pagar.me

## Estrutura do projeto

```
newcycle.ia/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── AuctionCard.jsx
│   │   ├── BidList.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── ImageUpload.jsx
│   │   └── AIDescriptionForm.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── AuctionDetail.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyAuctions.jsx
│   │   │   ├── Bids.jsx
│   │   │   ├── NewAuction.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Financial.jsx
│   ├── services/
│   │   ├── aiService.js
│   │   └── auctionService.js
│   └── styles/
│       └── globals.css
├── .env.example
├── package.json
└── README.md
```

## Instalação

```bash
git clone https://github.com/seu-usuario/newcycle-ia
cd newcycle-ia
npm install
cp .env.example .env
# preencha as variáveis no .env
npm run dev
```

## Variáveis de ambiente

Veja `.env.example` para todas as variáveis necessárias.

## Regras de negócio — leilões

- Preço mínimo é **público** — compradores veem e lances partem dele
- Lance inicial = preço mínimo
- Cada novo lance deve superar o anterior pelo incremento mínimo definido
- Prazo é livre — vendedor escolhe de 1 a 30 dias
- Encerramento automático (opcional) — vende ao maior lance ao fim do prazo
- Comissão da plataforma: **8%** sobre o lance vencedor
- Leilão sem lances encerra sem venda — vendedor pode relançar

## Licença

MIT
