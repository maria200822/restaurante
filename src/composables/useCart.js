import { reactive, computed } from 'vue'

const state = reactive({
  items: [], // { id, name, price, image, qty, categoria }
  coupon: null, // { code, label, ... }
})

// Cupons alinhados com os prêmios da roleta da Home
const coupons = {
  DOCE10: { discount: 10, type: 'percent-categoria', categoria: 'sobremesas', label: '10% OFF em Doces' },
  LANCHE10: { discount: 10, type: 'percent-categoria', categoria: 'lanches', label: '10% OFF em Lanches' },
  PIZZA12: { discount: 12, type: 'percent', label: '12% OFF em Pizzas' },
  BEBIDA: { type: 'brinde-bebida', label: 'Bebida Grátis' },
  PRATO10: { discount: 10, type: 'percent-categoria', categoria: 'pratos', label: '10% OFF em Pratos' },
  SAHUR5: { discount: 5, type: 'percent', label: '5% OFF no Pedido' },
}

const nomesCategorias = {
  sobremesas: 'Sobremesas',
  lanches: 'Lanches',
  pratos: 'Pratos Principais',
  bebidas: 'Bebidas',
  entradas: 'Entradas',
  combos: 'Combos Especiais',
}

function dataHoje() {
  const agora = new Date()
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
}

export function useCart() {
  function addItem(product) {
    const existing = state.items.find(i => i.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      state.items.push({ ...product, qty: 1 })
    }
  }

  function removeItem(id) {
    const idx = state.items.findIndex(i => i.id === id)
    if (idx === -1) return
    if (state.items[idx].qty > 1) {
      state.items[idx].qty--
    } else {
      state.items.splice(idx, 1)
    }
  }

  function deleteItem(id) {
    state.items = state.items.filter(i => i.id !== id)
  }

  function getQty(id) {
    const item = state.items.find(i => i.id === id)
    return item ? item.qty : 0
  }

  function clearCart() {
    state.items = []
    state.coupon = null
  }

  function applyCoupon(code) {
    const upper = code.trim().toUpperCase()
    const found = coupons[upper]

    if (!found) {
      state.coupon = null
      return { success: false, message: 'Cupom inválido ou expirado.' }
    }

    state.coupon = { code: upper, ...found }

    if (found.type === 'percent-categoria') {
      const temItem = state.items.some(i => i.categoria === found.categoria)
      if (!temItem) {
        return {
          success: true,
          message: `Cupom aplicado! Adicione itens de ${nomesCategorias[found.categoria] || found.categoria} para aproveitar o desconto.`,
        }
      }
    }

    if (found.type === 'brinde-bebida') {
      const temBebida = state.items.some(i => i.categoria === 'bebidas')
      if (!temBebida) {
        return {
          success: true,
          message: 'Cupom aplicado! Adicione uma bebida ao carrinho para resgatar seu brinde.',
        }
      }
    }

    return { success: true, message: `Cupom aplicado: ${found.label}` }
  }

  function removeCoupon() {
    state.coupon = null
  }

  // Lê o prêmio ganho hoje na roleta (mesma chave usada na Home)
  function getPremioDoDia() {
    const salvo = localStorage.getItem('premioRoletaSahur')
    if (!salvo) return null

    try {
      const dados = JSON.parse(salvo)
      if (dados.data === dataHoje()) {
        return dados.premio // { cor, nome, codigo, descricao }
      }
      return null
    } catch {
      return null
    }
  }

  const subtotal = computed(() =>
    state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  )

  const totalItems = computed(() =>
    state.items.reduce((sum, i) => sum + i.qty, 0)
  )

  const discountValue = computed(() => {
    const c = state.coupon
    if (!c) return 0

    if (c.type === 'percent') {
      return subtotal.value * (c.discount / 100)
    }

    if (c.type === 'fixed') {
      return Math.min(c.discount, subtotal.value)
    }

    if (c.type === 'percent-categoria') {
      const baseCategoria = state.items
        .filter(i => i.categoria === c.categoria)
        .reduce((sum, i) => sum + i.price * i.qty, 0)
      return baseCategoria * (c.discount / 100)
    }

    if (c.type === 'brinde-bebida') {
      const bebidas = state.items.filter(i => i.categoria === 'bebidas')
      if (bebidas.length === 0) return 0
      const maisBarata = bebidas.reduce((menor, atual) => (atual.price < menor.price ? atual : menor))
      return maisBarata.price
    }

    return 0
  })

  const total = computed(() => Math.max(subtotal.value - discountValue.value, 0))

  return {
    items: computed(() => state.items),
    coupon: computed(() => state.coupon),
    addItem,
    removeItem,
    deleteItem,
    getQty,
    clearCart,
    applyCoupon,
    removeCoupon,
    getPremioDoDia,
    subtotal,
    total,
    discountValue,
    totalItems,
  }
}