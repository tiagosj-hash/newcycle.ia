/**
 * auctionService.js
 * Lógica de negócio dos leilões — validações, cálculos e regras.
 * Conecte estas funções ao seu backend/Supabase conforme necessário.
 */

export const COMMISSION_RATE = 0.05 // 5%

/**
 * Valida se um novo lance é válido.
 * Regras:
 *  - Lance inicial deve ser >= preço mínimo
 *  - Lance seguinte deve superar o atual pelo incremento mínimo
 */
export function validateBid({ newBid, currentBid, minPrice, minIncrement }) {
  if (!currentBid) {
    // primeiro lance — deve ser igual ou maior ao preço mínimo
    if (newBid < minPrice) {
      return { valid: false, message: `O lance inicial deve ser de no mínimo ${formatCurrency(minPrice)}` }
    }
  } else {
    const minAllowed = currentBid + minIncrement
    if (newBid < minAllowed) {
      return {
        valid: false,
        message: `Lance mínimo permitido: ${formatCurrency(minAllowed)} (incremento de ${formatCurrency(minIncrement)})`,
      }
    }
  }
  return { valid: true }
}

/**
 * Calcula o próximo lance mínimo permitido.
 */
export function nextMinBid({ currentBid, minPrice, minIncrement }) {
  if (!currentBid) return minPrice
  return currentBid + minIncrement
}

/**
 * Calcula o valor líquido que o vendedor recebe após a comissão.
 */
export function calculateSellerNet(finalBid) {
  const commission = finalBid * COMMISSION_RATE
  return { gross: finalBid, commission, net: finalBid - commission }
}

/**
 * Verifica se um leilão está ativo.
 */
export function isAuctionActive(auction) {
  return auction.status === 'active' && new Date(auction.endsAt) > new Date()
}

/**
 * Classifica a urgência do leilão pelo tempo restante.
 * Retorna: 'green' | 'amber' | 'red' | 'ended'
 */
export function auctionUrgency(endsAt) {
  const secsLeft = Math.max(0, (new Date(endsAt) - new Date()) / 1000)
  if (secsLeft <= 0) return 'ended'
  if (secsLeft < 3600) return 'red'      // < 1 hora
  if (secsLeft < 86400) return 'amber'   // < 24 horas
  return 'green'
}

/**
 * Formata valor em BRL.
 */
export function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Calcula a data de encerramento a partir de agora + duração em dias.
 */
export function calcEndsAt(durationDays) {
  const d = new Date()
  d.setDate(d.getDate() + durationDays)
  return d.toISOString()
}
