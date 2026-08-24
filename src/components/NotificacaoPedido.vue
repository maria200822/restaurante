<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  obterPedido,
  atualizarStatusPedido,
  type Pedido
} from '../utils/pedido'

const pedido = ref<Pedido | null>(null)
const mostrarNotificacao = ref(false)

let intervalo: number | undefined

function verificarPedido() {
  const pedidoAnterior = pedido.value?.status

  const atualizado = atualizarStatusPedido()

  pedido.value = atualizado

  if (
    atualizado &&
    atualizado.status === 'pronto' &&
    pedidoAnterior !== 'pronto'
  ) {
    mostrarNotificacao.value = true

    setTimeout(() => {
      mostrarNotificacao.value = false
    }, 7000)
  }
}

function fecharNotificacao() {
  mostrarNotificacao.value = false
}

onMounted(() => {
  pedido.value = obterPedido()

  verificarPedido()

  intervalo = window.setInterval(() => {
    verificarPedido()
  }, 1000)
})

onUnmounted(() => {
  if (intervalo) {
    clearInterval(intervalo)
  }
})
</script>

<template>
  <div
    v-if="mostrarNotificacao && pedido"
    class="notificacao-pedido"
  >
    <div class="icone">
      ✓
    </div>

    <div class="texto">
      <strong>Seu pedido está pronto!</strong>

      <span>
        O Restaurante Sahur terminou de preparar seu pedido.
      </span>
    </div>

    <button
      class="fechar"
      @click="fecharNotificacao"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.notificacao-pedido {
  position: fixed;
  top: 25px;
  right: 25px;
  width: 360px;
  max-width: calc(100vw - 40px);

  display: flex;
  align-items: center;
  gap: 14px;

  background: white;
  border-radius: 16px;
  padding: 16px 18px;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.18);

  z-index: 99999;

  animation: aparecer 0.4s ease;
}

.icone {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #5a3825;
  color: white;

  font-size: 22px;
  font-weight: bold;
}

.texto {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.texto strong {
  color: #5a3825;
  font-size: 15px;
}

.texto span {
  color: #777;
  font-size: 13px;
  line-height: 1.4;
}

.fechar {
  border: none;
  background: transparent;

  font-size: 22px;
  color: #999;

  cursor: pointer;
}

.fechar:hover {
  color: #5a3825;
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateX(40px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 500px) {
  .notificacao-pedido {
    top: 15px;
    right: 15px;
    width: calc(100vw - 30px);
  }
}
</style>