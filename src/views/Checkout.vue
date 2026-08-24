<template>
  
  <div class="checkout-container">
    <h1>Finalizar Pedido</h1>

    <div v-if="items.length === 0 && !pedidoConfirmado" class="checkout-empty">
      <p>Sua sacola está vazia.</p>
      <RouterLink to="/cardapio" class="btn-voltar">Ver cardápio</RouterLink>
    </div>

    <div v-else-if="!pedidoConfirmado" class="checkout-grid">
      <section class="checkout-resumo">
        <h2>Resumo do pedido</h2>

        <div v-if="premio && !coupon" class="premio-box">
          <span class="premio-emoji">🎁</span>
          <div class="premio-texto">
            <strong>Você ganhou um prêmio hoje!</strong>
            <p>{{ premio.nome }} — código <strong>{{ premio.codigo }}</strong></p>
          </div>
          <button class="btn-usar-premio" @click="usarPremio">Usar</button>
        </div>

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

        <!-- QR CODE PIX -->
        <div v-if="formaPagamento === 'pix'" class="pix-box">
          <p class="pix-instrucao">Escaneie o QR Code abaixo para pagar</p>

          <div class="qrcode-wrapper">
            <img :src="qrCodeUrl" alt="QR Code Pix" class="qrcode-img" />
          </div>

          <p class="pix-valor">{{ formatarPreco(total) }}</p>

          <button class="btn-simular-leitura" @click="simularLeituraQr">
            <ScanLine :size="18" /> Simular leitura do QR Code
          </button>
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

    <!-- TELA DE ACOMPANHAMENTO DO PEDIDO -->
    <section v-else class="acompanhamento">
      <div class="acompanhamento-card">

        <div class="acompanhamento-header">
          <component :is="etapaAtual.icone" :size="40" class="acompanhamento-icone" :class="{ girando: !pedidoPronto && etapaAtual.girar }" />
          <h2>{{ etapaAtual.titulo }}</h2>
          <p>{{ etapaAtual.descricao }}</p>
        </div>

        <div class="barra-progresso">
          <div class="barra-progresso-preenchida" :style="{ width: progressoPercentual + '%' }"></div>
        </div>

        <div class="etapas-lista">
          <div
            v-for="(etapa, index) in etapas"
            :key="etapa.titulo"
            class="etapa-item"
            :class="{
              concluida: index < etapaIndex,
              ativa: index === etapaIndex
            }"
          >
            <div class="etapa-bolinha">
              <Check v-if="index < etapaIndex" :size="14" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="etapa-label">{{ etapa.titulo }}</span>
          </div>
        </div>

        <div v-if="pedidoPronto" class="acompanhamento-footer">
          <p class="tempo-estimado">Pedido pronto! Obrigado por comprar no Tung Tung.</p>
          <button class="btn-voltar-inicio" @click="voltarParaHome">Voltar ao início</button>
        </div>
        <div v-else class="acompanhamento-footer">
          <p class="tempo-estimado">Isso é apenas uma demonstração — nenhum pedido real está sendo preparado.</p>
        </div>
       
      </div>
    </section>
    

    <!-- MODAL AGRADECIMENTO QR CODE -->
    <transition name="fade">
      <div v-if="qrLido" class="modal-overlay">
        <div class="modal-sucesso">
          <ScanLine :size="48" class="icone-sucesso" />
          <h2>QR Code lido!</h2>
          <p>Obrigado pela atenção dedicada a este trabalho. Este QR Code é apenas uma simulação para fins de demonstração do projeto.</p>
          <button @click="qrLido = false">Fechar</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  X, Wallet, CreditCard, QrCode, Banknote, ScanLine,
  ClipboardCheck, ChefHat, PackageCheck, Check
} from 'lucide-vue-next'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const { items, coupon, subtotal, total, discountValue, applyCoupon, removeCoupon, clearCart, getPremioDoDia } = useCart()

const codigoCupom = ref('')
const mensagemCupom = ref('')
const cupomValido = ref(false)
const formaPagamento = ref('')
const trocoPara = ref('')
const pedidoConfirmado = ref(false)
const qrLido = ref(false)
const premio = ref(null)

onMounted(() => {
  premio.value = getPremioDoDia()
})

const metodosPagamento = [
  { id: 'pix', label: 'Pix', icone: QrCode },
  { id: 'credito', label: 'Cartão de Crédito', icone: CreditCard },
  { id: 'debito', label: 'Cartão de Débito', icone: Wallet },
  { id: 'dinheiro', label: 'Dinheiro', icone: Banknote },
]

const qrCodeUrl = computed(() => {
  const codigoFake = `00020126360014BR.GOV.BCB.PIX0114SAHURBOT-DEMO520400005303986540${total.value.toFixed(2)}5802BR5913Restaurante Sahur6009SaoPaulo62070503***6304ABCD`
  const texto = encodeURIComponent(codigoFake)
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${texto}`
})

function simularLeituraQr() {
  qrLido.value = true
}

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

function usarPremio() {
  if (!premio.value) return
  codigoCupom.value = premio.value.codigo
  aplicarCupomHandler()
}

// ===== ACOMPANHAMENTO DO PEDIDO (SIMULAÇÃO) =====

const etapas = [
  {
    titulo: 'Pedido recebido',
    descricao: 'Seu pedido chegou até a cozinha do Tung Tung.',
    icone: ClipboardCheck,
    duracao: 2500,
    girar: false,
  },
  {
    titulo: 'Em preparo',
    descricao: 'Nossos chefs estão preparando tudo com carinho.',
    icone: ChefHat,
    duracao: 3500,
    girar: true,
  },
  {
    titulo: 'Pronto',
    descricao: 'Seu pedido está pronto!',
    icone: PackageCheck,
    duracao: 0,
    girar: false,
  },
]

const etapaIndex = ref(0)
let timeoutId = null

const etapaAtual = computed(() => etapas[etapaIndex.value])
const pedidoPronto = computed(() => etapaIndex.value === etapas.length - 1)

const progressoPercentual = computed(() => {
  return (etapaIndex.value / (etapas.length - 1)) * 100
})

function iniciarSimulacaoPreparo() {
  etapaIndex.value = 0
  avancarEtapa()
}

function avancarEtapa() {
  const etapa = etapas[etapaIndex.value]
  if (!etapa || etapa.duracao === 0) return

  timeoutId = setTimeout(() => {
    if (etapaIndex.value < etapas.length - 1) {
      etapaIndex.value++
      avancarEtapa()
    }
  }, etapa.duracao)
}

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})

function confirmarPedido() {
  if (!formaPagamento.value) return
  pedidoConfirmado.value = true
  iniciarSimulacaoPreparo()
}

function voltarParaHome() {
  clearCart()
  pedidoConfirmado.value = false
  etapaIndex.value = 0
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

.premio-box{
  display:flex;
  align-items:center;
  gap:12px;
  background: linear-gradient(135deg, #fff4e0, #ffe6c7);
  border: 1px dashed #e67e22;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
}

.premio-emoji{
  font-size: 1.8rem;
}

.premio-texto{
  flex:1;
}

.premio-texto strong{
  display:block;
  color:#2c1810;
  font-size:0.95rem;
}

.premio-texto p{
  margin:2px 0 0;
  font-size:0.85rem;
  color:#8b5e3c;
}

.btn-usar-premio{
  background:#e67e22;
  color:white;
  border:none;
  padding:10px 16px;
  border-radius:8px;
  font-weight:600;
  cursor:pointer;
  white-space:nowrap;
}

.btn-usar-premio:hover{
  background:#d35400;
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

.pix-box{
  text-align:center;
  background:#fafafa;
  border:1px solid #eee;
  border-radius:12px;
  padding:20px;
  margin-bottom:20px;
}

.pix-instrucao{
  color:#2c1810;
  font-weight:600;
  margin:0 0 14px;
  font-size:0.95rem;
}

.qrcode-wrapper{
  display:inline-block;
  background:white;
  padding:12px;
  border-radius:12px;
  border:1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.qrcode-img{
  display:block;
  width:180px;
  height:180px;
}

.pix-valor{
  margin:14px 0 0;
  font-size:1.3rem;
  font-weight:700;
  color:#e67e22;
}

.btn-simular-leitura{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin:16px auto 0;
  background:#2c1810;
  color:white;
  border:none;
  padding:10px 18px;
  border-radius:8px;
  font-weight:600;
  font-size:0.9rem;
  cursor:pointer;
  transition: background 0.2s ease;
}

.btn-simular-leitura:hover{
  background:#4a2e1e;
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

/* ===== TELA DE ACOMPANHAMENTO ===== */

.acompanhamento{
  display:flex;
  justify-content:center;
  padding: 30px 0;
}

.acompanhamento-card{
  background:white;
  border-radius:20px;
  padding:40px 30px;
  max-width:480px;
  width:100%;
  text-align:center;
  border:1px solid #eee;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
}

.acompanhamento-header{
  margin-bottom:30px;
}

.acompanhamento-icone{
  color:#e67e22;
  margin-bottom:14px;
}

.acompanhamento-icone.girando{
  animation: balancar 1.2s ease-in-out infinite;
}

@keyframes balancar{
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

.acompanhamento-header h2{
  color:#2c1810;
  margin:0 0 8px;
  font-size:1.5rem;
}

.acompanhamento-header p{
  color:#718096;
  margin:0;
  font-size:0.95rem;
}

.barra-progresso{
  width:100%;
  height:8px;
  background:#f2ede5;
  border-radius:10px;
  overflow:hidden;
  margin-bottom:30px;
}

.barra-progresso-preenchida{
  height:100%;
  background: linear-gradient(90deg, #e67e22, #f39c4c);
  border-radius:10px;
  transition: width 0.6s ease;
}

.etapas-lista{
  display:flex;
  justify-content:space-between;
  margin-bottom:20px;
}

.etapa-item{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  flex:1;
}

.etapa-bolinha{
  width:32px;
  height:32px;
  border-radius:50%;
  background:#f2ede5;
  color:#a08a72;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:0.85rem;
  transition: all 0.3s ease;
}

.etapa-item.ativa .etapa-bolinha{
  background:#e67e22;
  color:white;
  box-shadow: 0 0 0 6px rgba(230, 126, 34, 0.15);
}

.etapa-item.concluida .etapa-bolinha{
  background:#2e7d32;
  color:white;
}

.etapa-label{
  font-size:0.78rem;
  color:#718096;
  font-weight:500;
}

.etapa-item.ativa .etapa-label{
  color:#2c1810;
  font-weight:700;
}

.acompanhamento-footer{
  border-top:1px solid #f2f2f2;
  padding-top:20px;
}

.tempo-estimado{
  color:#8b5e3c;
  font-size:0.85rem;
  margin:0 0 14px;
}

.btn-voltar-inicio{
  background:#e67e22;
  color:white;
  border:none;
  padding:12px 24px;
  border-radius:10px;
  font-weight:700;
  cursor:pointer;
  transition: background 0.2s ease;
}

.btn-voltar-inicio:hover{
  background:#d35400;
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

  .acompanhamento-card{
    padding: 30px 20px;
  }

  .etapa-label{
    font-size:0.7rem;
  }
}
</style>