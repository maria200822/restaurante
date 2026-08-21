<script setup lang="ts">
import { ref } from 'vue'

const nome = ref('')
const pessoas = ref('2 pessoas')
const data = ref('')
const horario = ref('19:00')

const reservaConfirmada = ref(false)

// Estados para o alerta customizado
const erroVisivel = ref(false)
const mensagemErro = ref('')

// Estado para a lista de reservas e painel de histórico
const listaReservas = ref<Array<{ nome: string; pessoas: string; data: string; horario: string }>>([])
const historicoVisivel = ref(false)

// Pega a data atual no formato YYYY-MM-DD para travar o input HTML e validações
const hoje = new Date().toISOString().split('T')[0]

function mostrarErro(mensagem: string) {
  mensagemErro.value = mensagem
  erroVisivel.value = true
}

function fecharErro() {
  erroVisivel.value = false
}

function fazerReserva() {
  if (!nome.value.trim()) {
    mostrarErro('Por favor, informe seu nome.')
    return
  }

  if (!data.value) {
    mostrarErro('Por favor, escolha uma data.')
    return
  }

  if (data.value < hoje) {
    mostrarErro('Não é permitido fazer reservas para anos ou datas anteriores.')
    return
  }

  // Adiciona a reserva na lista geral
  listaReservas.value.push({
    nome: nome.value,
    pessoas: pessoas.value,
    data: data.value,
    horario: horario.value
  })

  reservaConfirmada.value = true
}

function novaReserva() {
  nome.value = ''
  pessoas.value = '2 pessoas'
  data.value = ''
  horario.value = '19:00'
  reservaConfirmada.value = false
}

function alternarHistorico() {
  historicoVisivel.value = !historicoVisivel.value
}
</script>

<template>
  <div class="reservas-container">

    <div class="cabecalho">
      <h1>Reservas</h1>
      <p>
        Reserve sua mesa no Restaurante Sahur
      </p>
    </div>

    <!-- FORMULÁRIO -->
    <div v-if="!reservaConfirmada" class="reserva-card">

      <div class="card-topo">
        <div class="titulo-card">
          <h2>Reserve sua mesa</h2>
          <p>
            Escolha a data, o horário e a quantidade de pessoas.
          </p>
        </div>
        <!-- BOTÃO DE TRÊS PONTINHOS -->
        <button class="btn-tres-pontinhos" @click="alternarHistorico" title="Ver reservas feitas">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <form @submit.prevent="fazerReserva">

        <!-- NOME -->
        <div class="campo-grupo">
          <label for="nome">Nome</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            placeholder="Digite seu nome"
            maxlength="50"
          />
        </div>

        <!-- PESSOAS -->
        <div class="campo-grupo">
          <label for="pessoas">Quantidade de pessoas</label>
          <select id="pessoas" v-model="pessoas">
            <option>1 pessoa</option>
            <option>2 pessoas</option>
            <option>3 pessoas</option>
            <option>4 pessoas</option>
            <option>5 pessoas</option>
            <option>6 pessoas</option>
            <option>Mais de 6 pessoas</option>
          </select>
        </div>

        <!-- DATA -->
        <div class="campo-grupo">
          <label for="data">Data da reserva</label>
          <input
            id="data"
            v-model="data"
            type="date"
            :min="hoje"
          />
        </div>

        <!-- HORÁRIO -->
        <div class="campo-grupo">
          <label for="horario">Horário</label>
          <select id="horario" v-model="horario">
            <option>11:00</option>
            <option>12:00</option>
            <option>13:00</option>
            <option>14:00</option>
            <option>18:00</option>
            <option>19:00</option>
            <option>20:00</option>
            <option>21:00</option>
            <option>22:00</option>
          </select>
        </div>

        <button
          type="submit"
          class="btn-reservar"
        >
          Confirmar Reserva
        </button>

      </form>
    </div>

    <!-- CONFIRMAÇÃO -->
    <div
      v-else
      class="confirmacao"
    >
      <div class="confirmacao-icone">
        ✓
      </div>

      <h2>Reserva confirmada</h2>

      <p class="mensagem-confirmacao">
        Sua mesa foi reservada com sucesso.
      </p>

      <div class="dados-reserva">
        <div class="dado">
          <span>Nome</span>
          <strong>{{ nome }}</strong>
        </div>

        <div class="dado">
          <span>Pessoas</span>
          <strong>{{ pessoas }}</strong>
        </div>

        <div class="dado">
          <span>Data</span>
          <strong>{{ data }}</strong>
        </div>

        <div class="dado">
          <span>Horário</span>
          <strong>{{ horario }}</strong>
        </div>
      </div>

      <p class="rodape-confirmacao">
        Aguardamos você no Restaurante Sahur.
      </p>

      <button
        class="btn-nova"
        @click="novaReserva"
      >
        Fazer nova reserva
      </button>
    </div>

    <!-- MODAL / PAINEL DE HISTÓRICO DE RESERVAS -->
    <div v-if="historicoVisivel" class="modal-overlay">
      <div class="modal-alerta modal-historico">
        <div class="historico-cabecalho">
          <h3>Reservas Realizadas</h3>
          <button class="btn-fechar-historico" @click="alternarHistorico">✕</button>
        </div>

        <div v-if="listaReservas.length === 0" class="sem-reservas">
          <p>Nenhuma reserva registrada ainda.</p>
        </div>

        <div v-else class="lista-historico">
          <div v-for="(res, index) in listaReservas" :key="index" class="item-historico">
            <p><strong>Nome:</strong> {{ res.nome }}</p>
            <p><strong>Pessoas:</strong> {{ res.pessoas }}</p>
            <p><strong>Data:</strong> {{ res.data }} às {{ res.horario }}</p>
          </div>
        </div>

        <button type="button" class="btn-alerta" @click="alternarHistorico" style="margin-top: 15px;">Fechar</button>
      </div>
    </div>

    <!-- MODAL DE ALERTA CUSTOMIZADO -->
    <div v-if="erroVisivel" class="modal-overlay">
      <div class="modal-alerta">
        <div class="alerta-icone">!</div>
        <h3>Atenção</h3>
        <p>{{ mensagemErro }}</p>
        <button type="button" class="btn-alerta" @click="fecharErro">Entendi</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.reservas-container {
  min-height: 100vh;
  background: #f5efe6;
  padding: 50px 20px;
  box-sizing: border-box;
}

/* CABEÇALHO */

.cabecalho {
  text-align: center;
  margin-bottom: 35px;
}

.cabecalho h1 {
  color: #5a3825;
  font-size: 38px;
  margin: 0 0 10px;
}

.cabecalho p {
  color: #806b5b;
  font-size: 16px;
  margin: 0;
}

/* CARD */

.reserva-card {
  max-width: 650px;
  margin: 0 auto;
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 5px 20px rgba(80, 50, 30, 0.12);
}

.card-topo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.titulo-card {
  margin-bottom: 0;
}

.titulo-card h2 {
  color: #5a3825;
  margin: 0 0 8px;
  font-size: 25px;
}

.titulo-card p {
  color: #777;
  margin: 0;
}

/* BOTÃO TRÊS PONTINHOS */
.btn-tres-pontinhos {
  background: #f5efe6;
  border: 1px solid #d8c5b3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: 0.2s;
  flex-shrink: 0;
}

.btn-tres-pontinhos span {
  width: 4px;
  height: 4px;
  background-color: #5a3825;
  border-radius: 50%;
}

.btn-tres-pontinhos:hover {
  background-color: #ebdacf;
  border-color: #8b5e3c;
}

/* CAMPOS */

.campo-grupo {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.campo-grupo label {
  color: #5a3825;
  font-weight: bold;
  margin-bottom: 8px;
}

.campo-grupo input,
.campo-grupo select {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #d8c5b3;
  border-radius: 9px;
  background: #fff;
  color: #3d291d;
  font-size: 15px;
  outline: none;
}

.campo-grupo input:focus,
.campo-grupo select:focus {
  border-color: #8b5e3c;
  box-shadow: 0 0 0 2px rgba(139, 94, 60, 0.12);
}

/* BOTÃO */

.btn-reservar {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 9px;
  background: #5a3825;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 5px;
}

.btn-reservar:hover {
  background: #7a4d32;
  transform: translateY(-1px);
}

/* CONFIRMAÇÃO */

.confirmacao {
  max-width: 650px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(80, 50, 30, 0.12);
}

.confirmacao-icone {
  width: 55px;
  height: 55px;
  margin: 0 auto 15px;
  border-radius: 50%;
  background: #8b5e3c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.confirmacao h2 {
  color: #5a3825;
  margin-bottom: 8px;
}

.mensagem-confirmacao {
  color: #777;
}

/* DADOS */

.dados-reserva {
  margin: 25px 0;
  background: #f5efe6;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
}

.dado {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid #dfd1c3;
}

.dado:last-child {
  border-bottom: none;
}

.dado span {
  color: #806b5b;
}

.dado strong {
  color: #5a3825;
}

.rodape-confirmacao {
  color: #5a3825;
  font-weight: bold;
  margin-bottom: 25px;
}

/* MODAL / HISTÓRICO */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(90, 56, 37, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-alerta {
  background: white;
  max-width: 400px;
  width: 100%;
  padding: 30px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(80, 50, 30, 0.2);
  animation: modalEntrada 0.3s ease;
}

.modal-historico {
  max-width: 500px;
  text-align: left;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.historico-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #dfd1c3;
  padding-bottom: 10px;
}

.historico-cabecalho h3 {
  color: #5a3825;
  margin: 0;
  font-size: 20px;
}

.btn-fechar-historico {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #806b5b;
}

.lista-historico {
  overflow-y: auto;
  max-height: 40vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 5px;
}

.item-historico {
  background: #f5efe6;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dfd1c3;
}

.item-historico p {
  margin: 0 0 4px;
  color: #3d291d;
  font-size: 14px;
}

.item-historico p:last-child {
  margin-bottom: 0;
}

.sem-reservas {
  text-align: center;
  color: #777;
  padding: 20px 0;
}

@keyframes modalEntrada {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.alerta-icone {
  width: 45px;
  height: 45px;
  margin: 0 auto 15px;
  border-radius: 50%;
  background: #d97757;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
}

.modal-alerta h3 {
  color: #5a3825;
  margin: 0 0 8px;
  font-size: 22px;
}

.modal-alerta p {
  color: #777;
  margin: 0 0 20px;
  font-size: 15px;
}

.btn-alerta {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 9px;
  background: #5a3825;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.btn-alerta:hover {
  background: #7a4d32;
}

/* NOVA RESERVA */

.btn-nova {
  padding: 12px 25px;
  border: none;
  border-radius: 9px;
  background: #8b5e3c;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.btn-nova:hover {
  background: #6f472d;
}

/* RESPONSIVO */

@media (max-width: 600px) {
  .reservas-container {
    padding: 30px 15px;
  }

  .reserva-card,
  .confirmacao {
    padding: 25px 20px;
  }

  .cabecalho h1 {
    font-size: 32px;
  }

  .dado {
    flex-direction: column;
    gap: 4px;
  }
}
</style>