export type StatusPedido =
  | 'recebido'
  | 'preparando'
  | 'pronto'

export interface Pedido {
  id: number
  status: StatusPedido
  criadoEm: number
  prontoEm: number
}

const CHAVE_PEDIDO = 'pedido_sahur'

export function salvarPedido(pedido: Pedido) {
  localStorage.setItem(CHAVE_PEDIDO, JSON.stringify(pedido))
}

export function obterPedido(): Pedido | null {
  const dados = localStorage.getItem(CHAVE_PEDIDO)

  if (!dados) {
    return null
  }

  try {
    return JSON.parse(dados)
  } catch {
    return null
  }
}

export function criarPedido(): Pedido {
  const agora = Date.now()

  const pedido: Pedido = {
    id: agora,
    status: 'recebido',
    criadoEm: agora,
    prontoEm: agora + 60000
  }

  salvarPedido(pedido)

  return pedido
}

export function atualizarStatusPedido(): Pedido | null {
  const pedido = obterPedido()

  if (!pedido) {
    return null
  }

  const agora = Date.now()

  if (
    agora >= pedido.prontoEm &&
    pedido.status !== 'pronto'
  ) {
    pedido.status = 'pronto'
    salvarPedido(pedido)
  } else if (
    agora >= pedido.criadoEm + 3000 &&
    pedido.status === 'recebido'
  ) {
    pedido.status = 'preparando'
    salvarPedido(pedido)
  }

  return pedido
}

export function limparPedido() {
  localStorage.removeItem(CHAVE_PEDIDO)
}