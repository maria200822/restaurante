<template>
  <div class="checkout-container">
    <h1>Finalizar Pedido</h1>

    <div v-if="items.length === 0" class="checkout-empty">
      <p>Sua sacola está vazia.</p>
      <RouterLink to="/cardapio" class="btn-voltar">Ver cardápio</RouterLink>
    </div>

    <div v-else class="checkout-grid">
      <section class="checkout-resumo">
        <h2>Resumo do pedido</h2>

        <div class="resumo-item" v-for="item in items" :key="item.id">
          <img :src="item.image" :alt="item.name" />
          <div class="resumo-item-info">
            <h4>{{ item.name }}</h4>
            <span>{{ item.qty }}x {{ formatarPreco(item.price) }}</span>
          </div>
          <strong>{{ formatarPreco(item.price * item.qty) }}</strong>
        </div>

        <div class="cupom-box">
          <label>Cupom de desconto</label>
          <div class="cupom-input">
            <input
              v-model="codigoCupom"
              type="text"
              placeholder="Digite seu cupom"
              @keyup.enter="aplicarCupomHandler"
            />
            <button @click="aplicarCupomHandler">Aplicar</button>
          </div>
          <p v-if="mensagemCupom" :class="['cupom-msg', cupomValido ? 'sucesso' : 'erro']">
            {{ mensagemCupom }}
          </p>
          <div v-if="coupon" class="cupom-aplicado">
            <span>Cupom <strong>{{ coupon.code }}</strong> aplicado</span>
            <button @click="removerCupomHandler"><X :size="14" /></button>
          </div>
        </div>

        <div class="resumo-totais">
          <div class="linha-total">
            <span>Subtotal</span>
            <span>{{ formatarPreco(subtotal) }}</span>
          </div>
          <div class="linha-total" v-if="discountValue > 0">
            <span>Desconto</span>
            <span class="desconto">- {{ formatarPreco(discountValue) }}</span>
          </div>
          <div class="linha-total total-final">
            <span>Total</span>
            <span>{{ formatarPreco(total) }}</span>
          </div>
        </div>
      </section>

      <section class="checkout-pagamento">
        <h2>Forma de pagamento</h2>

        <div class="metodos-pagamento">
          <label
            v-for="metodo in metodosPagamento"
            :key="metodo.id"
            class="metodo-item"
            :class="{ selecionado: formaPagamento === metodo.id }"
          >
            <input type="radio" v-model="formaPagamento" :value="metodo.id" name="pagamento" />
            <component :is="metodo.icone" :size="20" />
            <span>{{ metodo.label }}</span>
          </label>
        </div>

        <div v-if="formaPagamento === 'dinheiro'" class="troco-box">
          <label>Precisa de troco para quanto?</label>
          <input v-model="trocoPara" type="text" placeholder="Ex: R$ 100,00" />
        </div>

        <button class="btn-confirmar" :disabled="!formaPagamento" @click="confirmarPedido">
          Confirmar Pedido — {{ formatarPreco(total) }}
        </button>
      </section>
    </div>

    <transition name="fade">
      <div v-if="pedidoConfirmado" class="modal-overlay">
        <div class="modal-sucesso">
          <CheckCircle2 :size="48" class="icone-sucesso" />
          <h2>Pedido confirmado!</h2>
          <p>Seu pedido foi enviado para a cozinha. Obrigado por escolher o Tung Tung!</p>
          <button @click="voltarParaHome">Voltar ao início</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { X, Wallet, CreditCard, QrCode, Banknote, CheckCircle2 } from 'lucide-vue-next'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { items, coupon, subtotal, total, discountValue, applyCoupon, removeCoupon, clearCart } = useCart()

const codigoCupom = ref('')
const mensagemCupom = ref('')
const cupomValido = ref(false)
const formaPagamento = ref('')
const trocoPara = ref('')
const pedidoConfirmado = ref(false)

const metodosPagamento = [
  { id: 'pix', label: 'Pix', icone: QrCode },
  { id: 'credito', label: 'Cartão de Crédito', icone: CreditCard },
  { id: 'debito', label: 'Cartão de Débito', icone: Wallet },
  { id: 'dinheiro', label: 'Dinheiro', icone: Banknote },
]

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function aplicarCupomHandler() {
  if (!codigoCupom.value.trim()) return
  const resultado = applyCoupon(codigoCupom.value)
  mensagemCupom.value = resultado.message
  cupomValido.value = resultado.success
}

function removerCupomHandler() {
  removeCoupon()
  codigoCupom.value = ''
  mensagemCupom.value = ''
}

function confirmarPedido() {
  if (!formaPagamento.value) return
  pedidoConfirmado.value = true
}

function voltarParaHome() {
  clearCart()
  pedidoConfirmado.value = false
  router.push('/')
}
</script>

<style scoped>
.checkout-container{
  max-width: 1100px;
  margin:auto;
  padding: 40px 30px;
  background:#fdfbf7;
}

.checkout-container h1{
  text-align:center;
  color:#2c1810;
  margin-bottom:40px;
}

.checkout-empty{
  text-align:center;
  padding:60px 0;
  color:#718096;
}

.btn-voltar{
  display:inline-block;
  margin-top:16px;
  background:#e67e22;
  color:white;
  padding:10px 20px;
  border-radius:8px;
  text-decoration:none;
  font-weight:600;
}

.checkout-grid{
  display:grid;
  grid-template-columns: 1.3fr 1fr;
  gap:30px;
  align-items:start;
}

.checkout-resumo, .checkout-pagamento{
  background:white;
  border-radius:12px;
  padding:24px;
  border:1px solid #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.checkout-resumo h2, .checkout-pagamento h2{
  color:#2c1810;
  margin-top:0;
  margin-bottom:20px;
  font-size:1.3rem;
}

.resumo-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding-bottom:14px;
  margin-bottom:14px;
  border-bottom:1px solid #f2f2f2;
}

.resumo-item img{
  width:54px;
  height:54px;
  object-fit:cover;
  border-radius:8px;
}

.resumo-item-info{
  flex:1;
}

.resumo-item-info h4{
  margin:0 0 4px;
  color:#2c1810;
  font-size:0.95rem;
}

.resumo-item-info span{
  font-size:0.85rem;
  color:#718096;
}

.cupom-box{
  margin: 20px 0;
  padding-top:16px;
  border-top:1px dashed #eee;
}

.cupom-box label{
  display:block;
  margin-bottom:8px;
  font-weight:600;
  color:#2c1810;
  font-size:0.9rem;
}

.cupom-input{
  display:flex;
  gap:8px;
}

.cupom-input input{
  flex:1;
  padding:10px 12px;
  border:1px solid #ddd;
  border-radius:8px;
  font-size:0.9rem;
}

.cupom-input button{
  background:#2c1810;
  color:white;
  border:none;
  padding:10px 16px;
  border-radius:8px;
  cursor:pointer;
  font-weight:600;
}

.cupom-msg{
  margin-top:8px;
  font-size:0.85rem;
}

.cupom-msg.sucesso{ color:#2e7d32; }
.cupom-msg.erro{ color:#c0392b; }

.cupom-aplicado{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:10px;
  background:#eafaf0;
  padding:8px 12px;
  border-radius:8px;
  font-size:0.85rem;
  color:#2e7d32;
}

.cupom-aplicado button{
  background:none;
  border:none;
  cursor:pointer;
  color:#2e7d32;
}

.resumo-totais{
  padding-top:16px;
  border-top:1px solid #eee;
}

.linha-total{
  display:flex;
  justify-content:space-between;
  margin-bottom:8px;
  color:#2c1810;
  font-size:0.95rem;
}

.desconto{
  color:#2e7d32;
}

.linha-total.total-final{
  font-size:1.2rem;
  font-weight:700;
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid #eee;
}

.metodos-pagamento{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom:20px;
}

.metodo-item{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  border:1px solid #eee;
  border-radius:10px;
  cursor:pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.metodo-item input{
  display:none;
}

.metodo-item.selecionado{
  border-color:#e67e22;
  background:#fdf1e3;
}

.metodo-item span{
  font-weight:500;
  color:#2c1810;
}

.troco-box{
  margin-bottom:20px;
}

.troco-box label{
  display:block;
  margin-bottom:8px;
  font-size:0.9rem;
  color:#2c1810;
  font-weight:600;
}

.troco-box input{
  width:100%;
  padding:10px 12px;
  border:1px solid #ddd;
  border-radius:8px;
}

.btn-confirmar{
  width:100%;
  background:#e67e22;
  color:white;
  border:none;
  padding:16px;
  border-radius:10px;
  font-weight:700;
  font-size:1rem;
  cursor:pointer;
  transition: background 0.2s ease;
}

.btn-confirmar:hover{
  background:#d35400;
}

.btn-confirmar:disabled{
  background:#ccc;
  cursor:not-allowed;
}

.modal-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.6);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:300;
}

.modal-sucesso{
  background:white;
  padding:40px;
  border-radius:16px;
  text-align:center;
  max-width:360px;
}

.icone-sucesso{
  color:#2e7d32;
  margin-bottom:12px;
}

.modal-sucesso h2{
  color:#2c1810;
  margin:0 0 10px;
}

.modal-sucesso p{
  color:#718096;
  margin-bottom:20px;
}

.modal-sucesso button{
  background:#e67e22;
  color:white;
  border:none;
  padding:12px 24px;
  border-radius:10px;
  font-weight:600;
  cursor:pointer;
}

.fade-enter-active, .fade-leave-active{
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to{
  opacity:0;
}

@media (max-width: 768px){
  .checkout-grid{
    grid-template-columns: 1fr;
  }
}
</style>