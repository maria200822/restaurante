```vue
<template>
  <div class="menu-container">
    <h1>Tung Tung Menu</h1>

    <section
      v-for="categoria in categorias"
      :key="categoria.nome"
      class="categoria"
    >
      <h2>{{ categoria.nome }}</h2>

      <div class="grid-itens">
        <div
          v-for="item in categoria.itens"
          :key="item.id"
          class="card"
        >
          <div class="card-info">
            <h3>{{ item.nome }}</h3>

            <p>{{ item.descricao }}</p>

            <span>{{ formatarPreco(item.preco) }}</span>

            <div class="card-actions">
              <button
                v-if="getQty(item.id) === 0"
                class="btn-add"
                @click="adicionarAoCarrinho(item)"
              >
                <Plus :size="16" />
                Adicionar
              </button>

              <div
                v-else
                class="qty-stepper"
              >
                <button
                  @click="removeItem(item.id)"
                  aria-label="Diminuir quantidade"
                >
                  <Minus :size="16" />
                </button>

                <span>{{ getQty(item.id) }}</span>

                <button
                  @click="adicionarAoCarrinho(item)"
                  aria-label="Aumentar quantidade"
                >
                  <Plus :size="16" />
                </button>
              </div>
            </div>
          </div>

          <img
            :src="resolveImagem(item.imagem)"
            :alt="item.nome"
            class="card-img"
          />
        </div>
      </div>
    </section>

    <!-- Barra flutuante -->
    <transition name="slide-up">
      <button
        v-if="totalItems > 0"
        class="floating-cart"
        @click="carrinhoAberto = true"
      >
        <span class="floating-cart-count">
          {{ totalItems }}
          {{ totalItems === 1 ? 'item' : 'itens' }}
        </span>

        <span class="floating-cart-total">
          {{ formatarPreco(subtotal) }}
        </span>

        <span class="floating-cart-label">
          <ShoppingBag :size="18" />
          Ver sacola
        </span>
      </button>
    </transition>

    <!-- Drawer da sacola -->
    <transition name="fade">
      <div
        v-if="carrinhoAberto"
        class="drawer-overlay"
        @click.self="carrinhoAberto = false"
      >
        <aside class="drawer">
          <div class="drawer-header">
            <h2>Sua sacola</h2>

            <button
              class="drawer-close"
              @click="carrinhoAberto = false"
              aria-label="Fechar sacola"
            >
              <X :size="22" />
            </button>
          </div>

          <div
            v-if="items.length === 0"
            class="drawer-empty"
          >
            <p>Sua sacola está vazia.</p>
          </div>

          <div
            v-else
            class="drawer-items"
          >
            <div
              v-for="item in items"
              :key="item.id"
              class="drawer-item"
            >
              <img
                :src="item.image || item.imagem"
                :alt="item.name || item.nome"
              />

              <div class="drawer-item-info">
                <h4>{{ item.name || item.nome }}</h4>

                <span>
                  {{ formatarPreco(item.price) }}
                </span>
              </div>

              <div class="qty-stepper small">
                <button
                  @click="removeItem(item.id)"
                  aria-label="Diminuir quantidade"
                >
                  <Minus :size="14" />
                </button>

                <span>{{ item.qty }}</span>

                <button
                  @click="addItem(item)"
                  aria-label="Aumentar quantidade"
                >
                  <Plus :size="14" />
                </button>
              </div>

              <button
                class="drawer-item-remove"
                @click="deleteItem(item.id)"
                aria-label="Excluir item"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <div
            v-if="items.length > 0"
            class="drawer-footer"
          >
            <div class="drawer-total">
              <span>Subtotal</span>

              <strong>
                {{ formatarPreco(subtotal) }}
              </strong>
            </div>

            <button
              class="btn-checkout"
              @click="irParaCheckout"
            >
              Finalizar Pedido
            </button>
          </div>
        </aside>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Trash2,
} from 'lucide-vue-next'

import { useCart } from '@/composables/useCart'

const router = useRouter()

const {
  items,
  addItem,
  removeItem,
  deleteItem,
  getQty,
  subtotal,
  totalItems,
} = useCart()

const carrinhoAberto = ref(false)

// =====================================================
// RESOLVER IMAGENS
// =====================================================

function resolveImagem(caminho) {
  if (!caminho) {
    return ''
  }

  if (
    caminho.startsWith('http://') ||
    caminho.startsWith('https://')
  ) {
    return caminho
  }

  return new URL(
    `../assets/${caminho}`,
    import.meta.url,
  ).href
}

// =====================================================
// FORMATAR PREÇO
// =====================================================

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    },
  )
}

// =====================================================
// ADICIONAR AO CARRINHO
// =====================================================

function adicionarAoCarrinho(item) {
  addItem({
    id: item.id,

    name: item.nome,

    nome: item.nome,

    price: item.preco,

    categoria: item.categoria,

    description: item.descricao,

    descricao: item.descricao,

    image: resolveImagem(item.imagem),

    imagem: resolveImagem(item.imagem),
  })
}

// =====================================================
// IR PARA CHECKOUT
// =====================================================

function irParaCheckout() {
  carrinhoAberto.value = false

  router.push('/checkout')
}

// =====================================================
// CARDÁPIO
// =====================================================

const categorias = [
  {
    nome: 'Entradas',

    itens: [
      {
        id: 'entrada-abacajulias',
        nome: 'Abacajúlias',
        descricao:
          'Creme de abacate com nachos caseiros.',
        preco: 22.90,
        imagem: 'abacate.webp',
      },

      {
        id: 'entrada-empanadinha',
        nome: 'Emilinha Empanadinha',
        descricao:
          'Empada de frango artesanal.',
        preco: 18.90,
        imagem:
          'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'entrada-saladur',
        nome: 'Sahur Saladur',
        descricao:
          'Salada fresca de alface e tomate.',
        preco: 16.90,
        imagem:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'entrada-pastelino',
        nome: 'Patapim Pastelino',
        descricao:
          'Pastéis recheados com queijo e presunto.',
        preco: 21.90,
        imagem: 'pastel.jpg',
      },

      {
        id: 'entrada-batatina',
        nome: 'Caputina Batatina',
        descricao:
          'Batata frita crocante com tempero especial.',
        preco: 19.90,
        imagem:
          'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'entrada-corndog',
        nome: 'Corn dog estilo coreano',
        descricao:
          'Salsinha empanada com queijo e massa caseira.',
        preco: 13.90,
        imagem: 'corn.jpg',
      },
    ],
  },

  {
    nome: 'Pratos Principais',

    itens: [
      {
        id: 'prato-monifeijao',
        nome: 'Monifeijão',
        descricao:
          'Feijoada completa com arroz, couve e farofa caprichada.',
        preco: 44.90,
        imagem: 'feijoada.webp',
      },

      {
        id: 'prato-wemacarrao',
        nome: 'Wemacarrão',
        descricao:
          'Macarrão artesanal ao molho pomodoro com manjericão fresco.',
        preco: 39.90,
        imagem:
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'prato-mariapure',
        nome: 'Maria Purê',
        descricao:
          'Purê de batata cremoso servido com tiras de filé grelhado.',
        preco: 28.90,
        imagem:
          'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'prato-parmegiana',
        nome: 'Parmegiana Emiliana',
        descricao:
          'Filé de frango empanado, coberto com muito queijo e molho artesanal.',
        preco: 47.90,
        imagem: 'parmegiana.jpg',
      },

      {
        id: 'prato-juliaassada',
        nome: 'Julia Assada',
        descricao:
          'Costelinha de porco assada lentamente ao molho barbecue.',
        preco: 52.90,
        imagem:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'prato-emiliafrita',
        nome: 'Emilia Frita',
        descricao:
          'Iscas de peixe crocantes acompanhadas de molho tártaro.',
        preco: 42.90,
        imagem:
          'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },

  {
    nome: 'Lanches',

    itens: [
      {
        id: 'lanche-xpatapim',
        nome: 'X-Patapim',
        descricao:
          'Hambúrguer clássico com queijo derretido, alface, tomate e maionese especial.',
        preco: 24.90,
        imagem:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'lanche-burgerina',
        nome: 'Caputina Burgerina',
        descricao:
          'Blend da casa com queijo cheddar, cebola caramelizada e pão australiano.',
        preco: 27.90,
        imagem:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'lanche-smashur',
        nome: 'Sahur Smashur',
        descricao:
          'Dois ultra-smash burgers com queijo prato e molho secreto.',
        preco: 25.90,
        imagem:
          'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'lanche-meltilia',
        nome: 'Emilia Meltilia',
        descricao:
          'Sanduíche de frango desfiado com muito requeijão cremoso na chapa.',
        preco: 26.90,
        imagem: 'emilia.jpg',
      },

      {
        id: 'lanche-baconzao',
        nome: 'Julião Baconzão',
        descricao:
          'Hambúrguer robusto com tripla camada de bacon crocante e barbecue.',
        preco: 29.90,
        imagem:
          'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },

  {
    nome: 'Bebidas',

    itens: [
      {
        id: 'bebida-caputino',
        nome: 'Capuchino Caputino',
        descricao:
          'Capuccino cremoso com chocolate.',
        preco: 12.90,
        imagem:
          'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'bebida-abacajulia',
        nome: 'Suco de Abacajúlia',
        descricao:
          'Suco natural de abacaxi com hortelã.',
        preco: 11.90,
        imagem:
          'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'bebida-cola',
        nome: 'Patapim Cola',
        descricao:
          'Refrigerante de cola gelado.',
        preco: 8.90,
        imagem:
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'bebida-guarana',
        nome: 'Guaraná Sahurá',
        descricao:
          'Guaraná especial da casa.',
        preco: 8.90,
        imagem: 'guarana.png',
      },

      {
        id: 'bebida-emilimonada',
        nome: 'Emilimonada',
        descricao:
          'Limonada suíça refrescante.',
        preco: 10.90,
        imagem:
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'bebida-juicedeluxe',
        nome: 'Julia Juice Deluxe',
        descricao:
          'Suco misto de frutas tropicais.',
        preco: 13.90,
        imagem:
          'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },

  {
    nome: 'Sobremesas',

    itens: [
      {
        id: 'sobremesa-brigadeirao',
        nome: 'Brigadeirão Patapimão',
        descricao:
          'Brigadeirão cremoso coberto com granulado.',
        preco: 18.90,
        imagem: 'briga.jpg',
      },

      {
        id: 'sobremesa-pudim',
        nome: 'Pudim da Dona Emilia',
        descricao:
          'Pudim de leite condensado tradicional.',
        preco: 16.90,
        imagem: 'pudim.jpg',
      },

      {
        id: 'sobremesa-bolo',
        nome: 'Julia de Leite Condensadulia',
        descricao:
          'Bolo recheado com leite condensado.',
        preco: 19.90,
        imagem: 'bolo.jpg',
      },

      {
        id: 'sobremesa-cheesecake',
        nome: 'Caputina Cheesecakinha',
        descricao:
          'Cheesecake com cobertura de frutas vermelhas.',
        preco: 22.90,
        imagem: 'chesse.jpg',
      },

      {
        id: 'sobremesa-tiramissahur',
        nome: 'Tiramissahur',
        descricao:
          'Tiramisù especial da casa.',
        preco: 24.90,
        imagem:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'sobremesa-brownie',
        nome: 'Patapim Browniepim',
        descricao:
          'Brownie de chocolate servido quente.',
        preco: 20.90,
        imagem:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },

  {
    nome: 'Combos Especiais',

    itens: [
      {
        id: 'combo-emiliasahur',
        nome: 'Combo Emilia Sahur',
        descricao:
          'Cachorro-quente tamanho família.',
        preco: 64.90,
        imagem: 'chachorro.webp',
      },

      {
        id: 'combo-cydao',
        nome: 'Combo Cydão Patapim',
        descricao:
          'Batata frita gigante com molhos especiais.',
        preco: 34.90,
        imagem:
          'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'combo-maismais',
        nome: 'Combo das Mais Mais',
        descricao:
          'O maior combo do restaurante.',
        preco: 129.90,
        imagem:
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'combo-brainrot',
        nome: 'Combo Brainrot Supremo',
        descricao:
          'Hambúrguer, fritas, bebida e sobremesa.',
        preco: 49.90,
        imagem:
          'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'combo-tralalero',
        nome: 'Combo Tralalero Sahurino',
        descricao:
          'Pizza grande, refrigerante e sobremesa.',
        preco: 74.90,
        imagem:
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'combo-bombardiro',
        nome: 'Combo Bombardiro Caputino',
        descricao:
          'Dois hambúrgueres, fritas e bebida.',
        preco: 59.90,
        imagem:
          'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&w=300&q=80',
      },

      {
        id: 'combo-tungtung',
        nome: 'Combo Tung Tung Patapim',
        descricao:
          'Combo premium com os mais vendidos.',
        preco: 79.90,
        imagem:
          'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
]
</script>

<style scoped>
.menu-container {
  max-width: 1200px;
  margin: auto;
  padding: 30px;
  background: #fdfbf7;
  min-height: 100vh;
}

h1 {
  text-align: center;
  color: #2c1810;
  margin-bottom: 40px;
  font-size: 2.8rem;
  font-weight: bold;
}

.categoria {
  margin-bottom: 50px;
}

h2 {
  color: #2c1810;
  margin-bottom: 25px;
  font-size: 1.8rem;
  font-weight: 600;
}

.grid-itens {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(500px, 1fr)
  );
  gap: 20px;
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: white;
  border-radius: 12px;
  padding: 20px;

  border: 1px solid #eee;

  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04);

  transition: 0.2s ease-in-out;
  gap: 15px;
}

.card:hover {
  transform: translateY(-2px);
  border-color: #d7c3ad;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-info {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 6px;
}

.card h3 {
  margin: 0;
  color: #2c1810;
  font-size: 1.2rem;
}

.card p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.card > .card-info > span {
  color: #e67e22;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 4px;
}

.card-img {
  width: 110px;
  height: 110px;

  object-fit: cover;
  border-radius: 8px;

  background-color: #f5efe6;
}

.card-actions {
  margin-top: 8px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;

  background: #e67e22;
  color: white;

  border: none;
  padding: 8px 14px;
  border-radius: 8px;

  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-add:hover {
  background: #d35400;
  transform: translateY(-1px);
}

.qty-stepper {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  background: #fdf1e3;
  border: 1px solid #f0d9bd;

  border-radius: 8px;
  padding: 4px 10px;
}

.qty-stepper button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 26px;
  height: 26px;

  border: none;
  background: #e67e22;
  color: white;

  border-radius: 6px;

  cursor: pointer;

  transition: background 0.2s ease;
}

.qty-stepper button:hover {
  background: #d35400;
}

.qty-stepper span {
  font-weight: 600;
  color: #2c1810;

  min-width: 16px;
  text-align: center;
}

.qty-stepper.small button {
  width: 22px;
  height: 22px;
}

/* =====================================================
   BARRA FLUTUANTE
===================================================== */

.floating-cart {
  position: fixed;

  bottom: 24px;
  left: 50%;

  transform: translateX(-50%);

  display: flex;
  align-items: center;
  gap: 16px;

  background: #2c1810;
  color: white;

  border: none;

  padding: 14px 26px;

  border-radius: 50px;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.25);

  cursor: pointer;

  z-index: 90;

  font-family: inherit;
}

.floating-cart-count {
  background: rgba(255, 255, 255, 0.15);

  padding: 4px 10px;

  border-radius: 20px;

  font-size: 0.85rem;
}

.floating-cart-total {
  font-weight: 700;
  color: #ffd8a8;
}

.floating-cart-label {
  display: flex;
  align-items: center;
  gap: 6px;

  font-weight: 600;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;

  transform:
    translateX(-50%)
    translateY(20px);
}

/* =====================================================
   DRAWER
===================================================== */

.drawer-overlay {
  position: fixed;

  inset: 0;

  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: flex-end;

  z-index: 200;
}

.drawer {
  width: 420px;
  max-width: 90vw;
  height: 100%;

  background: #fdfbf7;

  display: flex;
  flex-direction: column;

  box-shadow:
    -8px 0 24px rgba(0, 0, 0, 0.2);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px;

  border-bottom: 1px solid #eee;
}

.drawer-header h2 {
  margin: 0;
  color: #2c1810;
}

.drawer-close {
  background: none;
  border: none;

  cursor: pointer;

  color: #2c1810;
}

.drawer-empty {
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #718096;
}

.drawer-items {
  flex: 1;

  overflow-y: auto;

  padding: 16px 20px;

  display: flex;
  flex-direction: column;

  gap: 14px;
}

.drawer-item {
  display: flex;
  align-items: center;

  gap: 12px;
}

.drawer-item img {
  width: 56px;
  height: 56px;

  object-fit: cover;

  border-radius: 8px;
}

.drawer-item-info {
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 2px;
}

.drawer-item-info h4 {
  margin: 0;

  font-size: 0.95rem;

  color: #2c1810;
}

.drawer-item-info span {
  font-size: 0.85rem;

  color: #e67e22;

  font-weight: 600;
}

.drawer-item-remove {
  background: none;
  border: none;

  color: #b23b3b;

  cursor: pointer;
}

.drawer-footer {
  padding: 20px;

  border-top: 1px solid #eee;
}

.drawer-total {
  display: flex;
  justify-content: space-between;

  margin-bottom: 14px;

  font-size: 1.05rem;

  color: #2c1810;
}

.btn-checkout {
  width: 100%;

  background: #e67e22;
  color: white;

  border: none;

  padding: 14px;

  border-radius: 10px;

  font-weight: 700;
  font-size: 1rem;

  cursor: pointer;

  transition: background 0.2s ease;
}

.btn-checkout:hover {
  background: #d35400;
}

/* =====================================================
   TRANSIÇÃO
===================================================== */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =====================================================
   RESPONSIVO
===================================================== */

@media (max-width: 768px) {
  .menu-container {
    padding: 20px 15px;
  }

  .grid-itens {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 15px;
  }

  .card-img {
    width: 90px;
    height: 90px;
  }

  .drawer {
    width: 100%;
  }

  .floating-cart {
    width: calc(100% - 30px);

    justify-content: center;

    gap: 10px;

    padding: 13px 15px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2.1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .card {
    align-items: flex-start;
  }

  .card-img {
    width: 80px;
    height: 80px;
  }

  .floating-cart {
    font-size: 12px;
  }
}
</style>
```
