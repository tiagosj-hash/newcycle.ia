/**
 * aiService.js
 * Integração com a API da Anthropic (Claude) para análise de equipamentos por imagem.
 * A chave de API é lida de import.meta.env.VITE_ANTHROPIC_API_KEY
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT = `
Você é um especialista em avaliação de equipamentos corporativos usados para o marketplace newcycle.ia.
Analise a imagem fornecida e retorne SOMENTE um objeto JSON válido, sem markdown, sem explicações, sem texto fora do JSON.

O JSON deve ter exatamente estas chaves:
- title: string — título do anúncio conciso e profissional (ex: "Servidor Dell PowerEdge R740 — 2x Xeon Gold")
- description: string — 2 a 3 frases descrevendo o equipamento, estado aparente e possíveis usos
- category: string — uma das: "TI & Informática", "Escritório", "Industrial", "AV & Telecom", "Saúde", "Outros"
- condition: string — uma das: "Excelente", "Bom", "Regular", "Para retirada de peças"
- tags: array de strings — 3 a 5 características como marca, modelo, especificações visíveis, estado
- suggestedPrice: number — preço de mercado estimado em reais (somente o número, sem formatação)
- suggestedMinPrice: number — preço mínimo sugerido para leilão (70% do suggestedPrice)
`

/**
 * Analisa uma imagem de equipamento e retorna os dados estruturados.
 * @param {string} base64 - imagem em base64
 * @param {string} mimeType - tipo MIME da imagem (ex: "image/jpeg")
 * @returns {Promise<Object>} dados do equipamento
 */
export async function analyzeEquipmentImage(base64, mimeType = 'image/jpeg') {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY não definida no .env')
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: base64 },
            },
            {
              type: 'text',
              text: 'Analise este equipamento corporativo e retorne o JSON conforme instruído.',
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error: ${err}`)
  }

  const data = await response.json()
  const text = data.content.map(b => b.text || '').join('')

  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    // fallback caso o JSON venha malformado
    return {
      title: 'Equipamento corporativo usado',
      description: 'Equipamento em bom estado de conservação, pronto para uso.',
      category: 'Outros',
      condition: 'Bom',
      tags: ['Usado', 'Corporativo'],
      suggestedPrice: 500,
      suggestedMinPrice: 350,
    }
  }
}
