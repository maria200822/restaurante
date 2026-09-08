export interface PremioRoleta {
  cor: string
  titulo: string
  descricao: string
  codigo: string
  usado: boolean
  data: string
}

const CHAVE_PREMIO = 'sahur_premio_diario'

const premios: PremioRoleta[] = [
  {
    cor: 'azul',
    titulo: '10% OFF em Doces',
    descricao: 'Ganhe 10% de desconto em uma sobremesa.',
    codigo: 'DOCE10',
    usado: false,
    data: ''
  },
  {
    cor: 'vermelho',
    titulo: '10% OFF em Lanches',
    descricao: 'Ganhe 10% de desconto em um lanche.',
    codigo: 'LANCHE10',
    usado: false,
    data: ''
  },
  {
    cor: 'verde',
    titulo: '10% OFF em Pratos',
    descricao: 'Ganhe 10% de desconto em um prato principal.',
    codigo: 'PRATO10',
    usado: false,
    data: ''
  },
  {
    cor: 'amarelo',
    titulo: '10% OFF em Pizzas',
    descricao: 'Ganhe 10% de desconto em uma pizza.',
    codigo: 'PIZZA10',
    usado: false,
    data: ''
  },
  {
    cor: 'roxo',
    titulo: 'Bebida Grátis',
    descricao: 'Ganhe uma bebida grátis no seu pedido.',
    codigo: 'BEBIDA01',
    usado: false,
    data: ''
  },
  {
    cor: 'laranja',
    titulo: 'Frete Grátis',
    descricao: 'Ganhe frete grátis no seu próximo pedido.',
    codigo: 'FRETEGRATIS',
    usado: false,
    data: ''
  }
]

function dataHoje(): string {
  const hoje = new Date()
  const data = hoje.toISOString().split('T')[0]

  return data ?? ''
}

export function obterPremioDiario(): PremioRoleta | null {
  const salvo = localStorage.getItem(CHAVE_PREMIO)

  if (!salvo) {
    return null
  }

  try {
    const premio: PremioRoleta = JSON.parse(salvo)
    return premio
  } catch {
    return null
  }
}

export function podeGirarHoje(): boolean {
  const premio = obterPremioDiario()

  if (!premio) {
    return true
  }

  return premio.data !== dataHoje()
}

export function sortearPremio(): PremioRoleta {
  const indice = Math.floor(Math.random() * premios.length)

  const premioBase = premios[indice]

  if (!premioBase) {
    throw new Error('Não foi possível sortear um prêmio.')
  }

  const premio: PremioRoleta = {
    ...premioBase,
    data: dataHoje(),
    usado: false
  }

  localStorage.setItem(
    CHAVE_PREMIO,
    JSON.stringify(premio)
  )

  return premio
}

export function marcarPremioUsado(): void {
  const premio = obterPremioDiario()

  if (!premio) {
    return
  }

  premio.usado = true

  localStorage.setItem(
    CHAVE_PREMIO,
    JSON.stringify(premio)
  )
}