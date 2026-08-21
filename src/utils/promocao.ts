export interface Premio {
  titulo: string
  descricao: string
  codigo: string
  categoria: string
  usado: boolean
}

const CHAVE_PREMIO = 'premio-sahur'

export function salvarPremio(premio: Premio): void {
  localStorage.setItem(CHAVE_PREMIO, JSON.stringify(premio))
}

export function obterPremio(): Premio | null {
  const premioSalvo = localStorage.getItem(CHAVE_PREMIO)

  if (!premioSalvo) {
    return null
  }

  try {
    return JSON.parse(premioSalvo) as Premio
  } catch {
    localStorage.removeItem(CHAVE_PREMIO)
    return null
  }
}

export function marcarPremioComoUsado(): void {
  const premio = obterPremio()

  if (!premio) {
    return
  }

  premio.usado = true

  localStorage.setItem(
    CHAVE_PREMIO,
    JSON.stringify(premio)
  )
}

export function apagarPremio(): void {
  localStorage.removeItem(CHAVE_PREMIO)
}