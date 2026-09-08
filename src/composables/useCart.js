import { reactive, computed } from 'vue'

const state = reactive({
  items: [],
  coupon: null,
})

// =====================================================
// CUPONS
// =====================================================

const coupons = {
  DOCE10: {
    discount: 10,
    type: 'percent-categoria',
    categoria: 'sobremesas',
    label: '10% OFF em Doces',
  },

  LANCHE10: {
    discount: 10,
    type: 'percent-categoria',
    categoria: 'lanches',
    label: '10% OFF em Lanches',
  },

  PIZZA12: {
    discount: 12,
    type: 'percent-categoria',
    categoria: 'pizzas',
    label: '12% OFF em Pizzas',
  },

  BEBIDA: {
    type: 'brinde-bebida',
    label: 'Bebida Grátis',
  },

  PRATO10: {
    discount: 10,
    type: 'percent-categoria',
    categoria: 'pratos',
    label: '10% OFF em Pratos',
  },

  SAHUR5: {
    discount: 5,
    type: 'percent',
    label: '5% OFF no Pedido',
  },
}

// =====================================================
// NOMES DAS CATEGORIAS
// =====================================================

const nomesCategorias = {
  sobremesas: 'Sobremesas',
  lanches: 'Lanches',
  pizzas: 'Pizzas',
  pratos: 'Pratos Principais',
  bebidas: 'Bebidas',
  entradas: 'Entradas',
  combos: 'Combos Especiais',
}

// =====================================================
// NORMALIZAR CATEGORIA
// =====================================================

function normalizarCategoria(categoria) {
  if (!categoria) return ''

  return String(categoria)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// =====================================================
// DESCOBRIR CATEGORIA PELA ID DO PRODUTO
// =====================================================

function descobrirCategoriaPorId(id) {
  if (!id) return ''

  const valor = String(id).toLowerCase()

  if (valor.startsWith('lanche-')) {
    return 'lanches'
  }

  if (valor.startsWith('pizza-')) {
    return 'pizzas'
  }

  if (valor.startsWith('prato-')) {
    return 'pratos'
  }

  if (valor.startsWith('bebida-')) {
    return 'bebidas'
  }

  if (valor.startsWith('sobremesa-')) {
    return 'sobremesas'
  }

  if (valor.startsWith('entrada-')) {
    return 'entradas'
  }

  if (valor.startsWith('combo-')) {
    return 'combos'
  }

  return ''
}

// =====================================================
// OBTER CATEGORIA REAL DO ITEM
// =====================================================

function obterCategoriaItem(item) {
  // Primeiro tenta usar a categoria enviada pelo Cardápio
  if (item?.categoria) {
    return normalizarCategoria(item.categoria)
  }

  // Se não tiver categoria, descobre pela ID
  return normalizarCategoria(
    descobrirCategoriaPorId(item?.id)
  )
}

// =====================================================
// COMPARAR CATEGORIAS
// =====================================================

function categoriasIguais(categoriaProduto, categoriaCupom) {
  const produto = normalizarCategoria(categoriaProduto)
  const cupom = normalizarCategoria(categoriaCupom)

  if (!produto || !cupom) return false

  const grupos = {
    sobremesas: [
      'sobremesa',
      'sobremesas',
      'doce',
      'doces',
    ],

    lanches: [
      'lanche',
      'lanches',
      'sanduiche',
      'sanduiches',
    ],

    pizzas: [
      'pizza',
      'pizzas',
    ],

    pratos: [
      'prato',
      'pratos',
      'prato principal',
      'pratos principais',
      'principais',
    ],

    bebidas: [
      'bebida',
      'bebidas',
    ],

    entradas: [
      'entrada',
      'entradas',
    ],

    combos: [
      'combo',
      'combos',
      'combo especial',
      'combos especiais',
    ],
  }

  const grupoProduto = Object.entries(grupos).find(
    ([, valores]) => valores.includes(produto)
  )?.[0]

  const grupoCupom = Object.entries(grupos).find(
    ([, valores]) => valores.includes(cupom)
  )?.[0]

  return grupoProduto === grupoCupom
}

// =====================================================
// DATA DE HOJE
// =====================================================

function dataHoje() {
  const agora = new Date()

  return `${agora.getFullYear()}-${String(
    agora.getMonth() + 1
  ).padStart(2, '0')}-${String(
    agora.getDate()
  ).padStart(2, '0')}`
}

// =====================================================
// ADICIONAR ITEM
// =====================================================

function addItem(product) {
  const categoriaDetectada =
    product.categoria ||
    descobrirCategoriaPorId(product.id)

  const produtoCompleto = {
    ...product,
    categoria: categoriaDetectada,
  }

  const existing = state.items.find(
    (item) => item.id === produtoCompleto.id
  )

  if (existing) {
    existing.qty++
  } else {
    state.items.push({
      ...produtoCompleto,
      qty: 1,
    })
  }
}

// =====================================================
// REMOVER ITEM
// =====================================================

function removeItem(id) {
  const index = state.items.findIndex(
    (item) => item.id === id
  )

  if (index === -1) return

  const item = state.items[index]

  if (!item) return

  if (item.qty > 1) {
    item.qty--
  } else {
    state.items.splice(index, 1)
  }
}

// =====================================================
// EXCLUIR ITEM
// =====================================================

function deleteItem(id) {
  const index = state.items.findIndex(
    (item) => item.id === id
  )

  if (index === -1) return

  state.items.splice(index, 1)
}

// =====================================================
// QUANTIDADE
// =====================================================

function getQty(id) {
  const item = state.items.find(
    (item) => item.id === id
  )

  return item ? item.qty : 0
}

// =====================================================
// LIMPAR CARRINHO
// =====================================================

function clearCart() {
  state.items.splice(0, state.items.length)
  state.coupon = null
}

// =====================================================
// APLICAR CUPOM
// =====================================================

function applyCoupon(code) {
  const upper = String(code || '')
    .trim()
    .toUpperCase()

  if (!upper) {
    return {
      success: false,
      message: 'Digite um cupom.',
    }
  }

  const found = coupons[upper]

  if (!found) {
    state.coupon = null

    return {
      success: false,
      message: 'Cupom inválido ou expirado.',
    }
  }

  // ===================================================
  // CUPOM DE CATEGORIA
  // ===================================================

  if (found.type === 'percent-categoria') {
    const temItem = state.items.some((item) => {
      const categoria = obterCategoriaItem(item)

      return categoriasIguais(
        categoria,
        found.categoria
      )
    })

    if (!temItem) {
      state.coupon = null

      const nomeCategoria =
        nomesCategorias[found.categoria] ||
        found.categoria ||
        'categoria específica'

      return {
        success: false,
        message: `Esse cupom só funciona em ${nomeCategoria}. Adicione um item dessa categoria ao carrinho.`,
      }
    }
  }

  // ===================================================
  // BEBIDA GRÁTIS
  // ===================================================

  if (found.type === 'brinde-bebida') {
    const temBebida = state.items.some((item) => {
      const categoria = obterCategoriaItem(item)

      return categoriasIguais(
        categoria,
        'bebidas'
      )
    })

    if (!temBebida) {
      state.coupon = null

      return {
        success: false,
        message:
          'Adicione uma bebida ao carrinho para usar o cupom BEBIDA.',
      }
    }
  }

  // ===================================================
  // CUPOM VÁLIDO
  // ===================================================

  state.coupon = {
    code: upper,
    ...found,
  }

  return {
    success: true,
    message: `Cupom aplicado: ${found.label}`,
  }
}

// =====================================================
// REMOVER CUPOM
// =====================================================

function removeCoupon() {
  state.coupon = null
}

// =====================================================
// PRÊMIO DA ROLETA
// =====================================================

function getPremioDoDia() {
  const salvo = localStorage.getItem(
    'premioRoletaSahur'
  )

  if (!salvo) return null

  try {
    const dados = JSON.parse(salvo)

    if (
      dados.data === dataHoje() &&
      dados.premio
    ) {
      return dados.premio
    }

    return null
  } catch {
    return null
  }
}

// =====================================================
// SUBTOTAL
// =====================================================

const subtotal = computed(() => {
  return state.items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.qty || 0),
    0
  )
})

// =====================================================
// QUANTIDADE TOTAL
// =====================================================

const totalItems = computed(() => {
  return state.items.reduce(
    (sum, item) =>
      sum + Number(item.qty || 0),
    0
  )
})

// =====================================================
// DESCONTO
// =====================================================

const discountValue = computed(() => {
  const cupom = state.coupon

  if (!cupom) {
    return 0
  }

  // ===================================================
  // DESCONTO NO PEDIDO INTEIRO
  // ===================================================

  if (cupom.type === 'percent') {
    const desconto =
      subtotal.value *
      ((cupom.discount || 0) / 100)

    return Math.min(
      desconto,
      subtotal.value
    )
  }

  // ===================================================
  // DESCONTO POR CATEGORIA
  // ===================================================

  if (cupom.type === 'percent-categoria') {
    const valorCategoria =
      state.items
        .filter((item) => {
          const categoria =
            obterCategoriaItem(item)

          return categoriasIguais(
            categoria,
            cupom.categoria
          )
        })
        .reduce(
          (sum, item) =>
            sum +
            Number(item.price || 0) *
              Number(item.qty || 0),
          0
        )

    const desconto =
      valorCategoria *
      ((cupom.discount || 0) / 100)

    return Math.min(
      desconto,
      valorCategoria
    )
  }

  // ===================================================
  // DESCONTO FIXO
  // ===================================================

  if (cupom.type === 'fixed') {
    return Math.min(
      Number(cupom.discount || 0),
      subtotal.value
    )
  }

  // ===================================================
  // BEBIDA GRÁTIS
  // ===================================================

  if (cupom.type === 'brinde-bebida') {
    const bebidas =
      state.items.filter((item) => {
        const categoria =
          obterCategoriaItem(item)

        return categoriasIguais(
          categoria,
          'bebidas'
        )
      })

    if (bebidas.length === 0) {
      return 0
    }

    const bebidaMaisBarata =
      bebidas.reduce((menor, atual) => {
        const precoMenor =
          Number(menor?.price || 0)

        const precoAtual =
          Number(atual?.price || 0)

        return precoAtual < precoMenor
          ? atual
          : menor
      }, bebidas[0])

    return Math.min(
      Number(
        bebidaMaisBarata?.price || 0
      ),
      subtotal.value
    )
  }

  return 0
})

// =====================================================
// TOTAL FINAL
// =====================================================

const total = computed(() => {
  return Math.max(
    subtotal.value -
      discountValue.value,
    0
  )
})

// =====================================================
// EXPORTAÇÃO
// =====================================================

export function useCart() {
  return {
    items: computed(() => state.items),

    coupon: computed(
      () => state.coupon
    ),

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