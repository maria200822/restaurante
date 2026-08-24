<script setup lang="ts">
import { ref } from 'vue'

// Referência para o elemento do chat para fazer o scroll
const chatSection = ref<HTMLElement | null>(null)

// Função para rolar até o chat suavemente
function irParaOChat() {
  chatSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// --- LÓGICA DO CHAT (MANTIDA) ---
const mensagem = ref('')
const mostrarReserva = ref(false)

const nomeReserva = ref('')
const pessoasReserva = ref('2 pessoas')
const dataReserva = ref('')
const horarioReserva = ref('19:00')

const mensagens = ref([
  {
    autor: 'bot',
    texto:
      'Olá! Sou o SahurBot, assistente virtual do Restaurante Sahur. Posso ajudar com cardápio, preços, reservas, horários de funcionamento e recomendações.'
  }
])

function confirmarReserva() {
  if (!nomeReserva.value || !dataReserva.value) {
    alert('Por favor, preencha o nome e a data da reserva.')
    return
  }

  mensagens.value.push({
    autor: 'bot',
    texto:
      `Reserva confirmada!\n\n` +
      `Nome: ${nomeReserva.value}\n` +
      `Pessoas: ${pessoasReserva.value}\n` +
      `Data: ${dataReserva.value}\n` +
      `Horário: ${horarioReserva.value}\n\n` +
      `Aguardamos você no Restaurante Sahur!`
  })

  mostrarReserva.value = false
  nomeReserva.value = ''
  pessoasReserva.value = '2 pessoas'
  dataReserva.value = ''
  horarioReserva.value = '19:00'
}

function adicionarPergunta(texto: string) {
  mensagem.value = texto
  enviarMensagem()
}

const enviarMensagem = () => {
  if (!mensagem.value.trim()) return

  const texto = mensagem.value 
  const pergunta = texto.toLowerCase()

  mensagens.value.push({
    autor: 'user',
    texto
  })

  let resposta = ''

  if (
    pergunta.includes('oi') || pergunta.includes('olá') || pergunta.includes('ola') ||
    pergunta.includes('bom dia') || pergunta.includes('boa tarde') || pergunta.includes('boa noite')
  ) {
    resposta = 'Olá! Como posso ajudar? Você pode consultar nosso cardápio, preços, combos, reservas e recomendações.'
  }
  else if (pergunta.includes('cardápio') || pergunta.includes('cardapio') || pergunta.includes('menu')) {
    resposta = 'Nosso cardápio possui Entradas, Pratos Principais, Lanches, Pizzas, Bebidas, Sobremesas e Combos Especiais.'
  }
  else if (pergunta.includes('entrada') || pergunta.includes('entradas')) {
    resposta = 'Entradas disponíveis:\n\n• Abacajúlias - R$ 22,90\n• Emilinha Empanadinha - R$ 18,90\n• Sahur Saladur - R$ 16,90\n• Patapim Pastelino - R$ 21,90\n• Caputina Batatina - R$ 19,90\n• Julia Jujubina Crocantina - R$ 20,90'
  }
  else if (pergunta.includes('prato') || pergunta.includes('almoço') || pergunta.includes('almoco')) {
    resposta = 'Pratos principais:\n\n• Monifeijão - R$ 44,90\n• Wemacarrão - R$ 39,90\n• Maria Purê - R$ 28,90\n• Parmegiana Emiliana - R$ 47,90\n• Julia Assada - R$ 52,90\n• Emilia Frita - R$ 42,90'
  }
  else if (pergunta.includes('pizza')) {
    resposta = 'Pizzas disponíveis:\n\n• Julita Calabresina - R$ 54,90\n• Sahur Quatro Queijur - R$ 59,90\n• Emilizza Especializza - R$ 62,90'
  }
  else if (pergunta.includes('hamburguer') || pergunta.includes('hambúrguer') || pergunta.includes('lanche')) {
    resposta = 'Lanches disponíveis:\n\n• X-Patapim - R$ 24,90\n• Caputina Burgerina - R$ 27,90\n• Sahur Smashur - R$ 25,90\n• Emilia Meltilia - R$ 26,90\n• Julião Baconzão - R$ 29,90'
  }
  else if (pergunta.includes('bebida') || pergunta.includes('refrigerante') || pergunta.includes('suco')) {
    resposta = 'Bebidas disponíveis:\n\n• Capuchino Caputino - R$ 12,90\n• Suco de Abacajúlia - R$ 11,90\n• Patapim Cola - R$ 8,90\n• Guaraná Sahurá - R$ 8,90\n• Emilimonada - R$ 10,90\n• Julia Juice Deluxe - R$ 13,90'
  }
  else if (pergunta.includes('sobremesa') || pergunta.includes('doce')) {
    resposta = 'Sobremesas disponíveis:\n\n• Brigadeirão Patapimão - R$ 18,90\n• Pudim da Dona Emilia - R$ 16,90\n• Julia de Leite Condensadulia - R$ 19,90\n• Caputinha Cheesecakinha - R$ 22,90\n• Tiramissahur - R$ 24,90\n• Patapim Browniepim - R$ 20,90'
  }
  else if (pergunta.includes('combo')) {
    resposta = 'Combos especiais:\n\n• Combo Emilia Sahur - R$ 64,90\n• Combo Cydão Patapim - R$ 34,90\n• Combo das Mais Mais - R$ 129,90\n• Combo Brainrot Supremo - R$ 49,90\n• Combo Tralalero Sahurino - R$ 74,90\n• Combo Bombardiro Caputino - R$ 59,90\n• Combo Tung Tung Patapim - R$ 79,90'
  }
  else if (pergunta.includes('recomenda') || pergunta.includes('melhor') || pergunta.includes('sugest')) {
    resposta = 'Os itens mais pedidos pelos clientes são:\n\n• Emilizza Especializza\n• Sahur Smashur\n• Brigadeirão Patapimão\n• Combo das Mais Mais\n• Parmegiana Emiliana'
  }
  else if (pergunta.includes('preço') || pergunta.includes('preco') || pergunta.includes('valor')) {
    resposta = 'Informe o produto desejado e eu mostrarei o valor. Exemplo: "valor da pizza" ou "preço do combo".'
  }
  else if (pergunta.includes('horário') || pergunta.includes('horario') || pergunta.includes('abre') || pergunta.includes('funciona')) {
    resposta = 'Funcionamos de segunda a sexta das 11h às 23h. Aos sábados e domingos das 11h até meia-noite.'
  }
  else if (pergunta.includes('reserva') || pergunta.includes('mesa')) {
    resposta = 'Preencha o formulário abaixo para realizar sua reserva.'
    mostrarReserva.value = true
  }
  else if (pergunta.includes('dona') || pergunta.includes('fundador') || pergunta.includes('criador')) {
    resposta = 'O Restaurante Sahur foi criado por Emilia Sahur, Julia Caputina e Cydão Patapim.'
  }
  else {
    resposta = 'Não encontrei uma resposta para essa pergunta. Você pode perguntar sobre cardápio, pizzas, lanches, bebidas, sobremesas, combos, reservas, horários ou recomendações.'
  }

  mensagens.value.push({
    autor: 'bot',
    texto: resposta
  })

  mensagem.value = ''
}
</script>

<template>
  <div>
    <section class="hero">
      <h1>🍽️ Restaurante Sahur</h1>
      <p>Bem-vindo ao restaurante mais divertido e saboroso da cidade!</p>
      <button class="btn-chat" @click="irParaOChat">Conversar com SahurBot</button>
    </section>

    <section class="catalogo">
      <h2>  Nosso Cardápio Destaque </h2>
      <p class="subtitulo-secao">Conheça algumas de nossas especialidades mais amadas</p>

      <div class="categorias-grid">
        <div class="categoria-card">
          <h3>Pratos Principais</h3>
          <ul class="lista-itens">
            <li>
              <div class="item-info">
                <span class="item-nome">Monifeijão</span>
                <span class="item-preco">R$ 44,90</span>
              </div>
              <p class="item-desc">O feijão tropeiro mais completo e temperado da região.</p>
            </li>
            <li>
              <div class="item-info">
                <span class="item-nome">Wemacarrão</span>
                <span class="item-preco">R$ 39,90</span>
              </div>
              <p class="item-desc">Massa artesanal ao molho de tomate fresco e manjericão.</p>
            </li>
            <li>
              <div class="item-info">
                <span class="item-nome">Parmegiana Emiliana</span>
                <span class="item-preco">R$ 47,90</span>
              </div>
              <p class="item-desc">Filé empanado crocante, coberto com muito queijo e molho.</p>
            </li>
          </ul>
        </div>

        <div class="categoria-card">
          <h3>Pizzas & Lanches</h3>
          <ul class="lista-itens">
            <li>
              <div class="item-info">
                <span class="item-nome">Emilizza Especializza</span>
                <span class="item-preco">R$ 62,90</span>
              </div>
              <p class="item-desc">Molho artesanal, muçarela, pepperoni e borda recheada.</p>
            </li>
            <li>
              <div class="item-info">
                <span class="item-nome">Sahur Smashur</span>
                <span class="item-preco">R$ 25,90</span>
              </div>
              <p class="item-desc">Blend de 150g prensado, queijo prato e maionese da casa.</p>
            </li>
            <li>
              <div class="item-info">
                <span class="item-nome">Julião Baconzão</span>
                <span class="item-preco">R$ 29,90</span>
              </div>
              <p class="item-desc">Hambúrguer rústico com camadas generosas de bacon crocante.</p>
            </li>
          </ul>
        </div>

        <div class="categoria-card">
          <h3>Sobremesas</h3>
          <ul class="lista-itens">
            <li>
              <div class="item-info">
                <span class="item-nome">Brigadeirão Patapimão</span>
                <span class="item-preco">R$ 18,90</span>
              </div>
              <p class="item-desc">Brigadeiro cremoso gigante com granulado belga.</p>
            </li>
            <li>
              <div class="item-info">
                <span class="item-nome">Tiramissahur</span>
                <span class="item-preco">R$ 24,90</span>
              </div>
              <p class="item-desc">Clássica sobremesa italiana com o toque secreto do Sahur.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <div ref="chatSection" class="chat-container">
      <header class="chat-header">
        <h1>SahurBot</h1>
        <p class="subtitulo">Assistente Virtual do Restaurante Sahur</p>
      </header>

      <div class="chat-box">
        <div
          v-for="(msg, index) in mensagens"
          :key="index"
          :class="['balao-wrapper', msg.autor]"
        >
          <div class="balao">
            {{ msg.texto }}
          </div>
        </div>

        <div v-if="mostrarReserva" class="reserva-box">
          <h3>Reserva de Mesa</h3>

          <input
            v-model="nomeReserva"
            type="text"
            placeholder="Digite seu nome"
            class="campo"
          />

          <select v-model="pessoasReserva" class="campo">
            <option>1 pessoa</option>
            <option>2 pessoas</option>
            <option>3 pessoas</option>
            <option>4 pessoas</option>
            <option>5 pessoas</option>
            <option>6 pessoas</option>
            <option>Mais de 6 pessoas</option>
          </select>

          <input v-model="dataReserva" type="date" class="campo" />

          <select v-model="horarioReserva" class="campo">
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

          <button class="btn-reserva" @click="confirmarReserva">
            Confirmar Reserva
          </button>
        </div>
      </div>

      <div class="acoes">
        <button @click="adicionarPergunta('Ver cardápio')">Cardápio</button>
        <button @click="adicionarPergunta('Quais pizzas vocês têm?')">Pizzas</button>
        <button @click="adicionarPergunta('Quais são os combos?')">Combos</button>
        <button @click="adicionarPergunta('O que você recomenda?')">Recomendações</button>
        <button @click="adicionarPergunta('Quero reservar uma mesa')">Reservas</button>
      </div>

      <div class="input-area">
        <input
          v-model="mensagem"
          type="text"
          placeholder="Digite sua mensagem..."
          @keyup.enter="enviarMensagem"
        />
        <button @click="enviarMensagem">Enviar</button>
      </div>
    </div>

    <section class="localizacao">
      <div class="localizacao-conteudo">
        <h2>📍 Onde Estamos</h2>
        <p class="endereco">
          <strong>Avenida dos Sabores, nº 1234</strong><br />
          Bairro Gourmet — <br />
          <span class="ponto-referencia">Procurando pela fachada amarela ao lado do Parque Central!</span>
        </p>
        <div class="horarios">
          <h4>Horários de Funcionamento:</h4>
          <p>Segunda a Sexta: 11h às 23h</p>
          <p>Sábados e Domingos: 11h à 00h</p>
        </div>
      </div>
      
      <div class="mapa-ficticio">
        <div class="pino-mapa">📍</div>
        <span>Mapa Interativo Sahur</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- ESTILOS DO COMPONENTE UNIFICADO --- */
* {
  font-family: sans-serif;
  box-sizing: border-box;
}

/* Margem superior para separar o container do chat do restante das seções de destaque */
.chat-container {
  max-width: 550px;
  margin: 40px auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  scroll-margin-top: 20px; /* Adiciona uma folga ao rolar a tela */
}

.chat-header {
  text-align: center;
  margin-bottom: 15px;
}

.chat-header h1 {
  margin: 0;
  color: #5a3825;
  font-size: 24px;
}

.subtitulo {
  margin: 5px 0 0;
  color: #8b5e3c;
  font-size: 14px;
}

.chat-box {
  height: 450px;
  overflow-y: auto;
  background: #f5efe6;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.balao-wrapper {
  display: flex;
  width: 100%;
}

.balao-wrapper.bot {
  justify-content: flex-start;
}

.balao-wrapper.user {
  justify-content: flex-end;
}

.balao {
  padding: 12px 16px;
  max-width: 80%;
  white-space: pre-line;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.bot .balao {
  background: #8b5e3c;
  color: white;
  border-radius: 16px 16px 16px 4px;
}

.user .balao {
  background: #d9b38c;
  color: #2c1810;
  border-radius: 16px 16px 4px 16px;
}

.acoes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  justify-content: center;
}

.acoes button {
  background: transparent;
  border: 1.5px solid #8b5e3c;
  color: #8b5e3c;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.acoes button:hover {
  background: #8b5e3c;
  color: white;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: 2px solid #d7c3ad;
  border-radius: 10px;
  font-size: 15px;
}

.input-area input:focus {
  outline: none;
  border-color: #8b5e3c;
}

.input-area button {
  background: #5a3825;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.input-area button:hover {
  background: #7a4d32;
}

.reserva-box {
  width: 90%;
  margin: 10px auto;
  background: white;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #d7c3ad;
}

.reserva-box h3 {
  color: #5a3825;
  margin: 0;
  font-size: 16px;
  text-align: center;
}

.campo {
  padding: 10px;
  border: 1px solid #d7c3ad;
  border-radius: 8px;
  font-size: 14px;
}

.campo:focus {
  outline: none;
  border-color: #8b5e3c;
}

.btn-reserva {
  background: #8b5e3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.btn-reserva:hover {
  background: #70482d;
}

/* --- HERO SECTION --- */
.hero {
  text-align: center;
  padding: 80px 20px;
  background: #fdfbf7;
}

.hero h1 {
  font-size: 3.5rem;
  color: #5a3825;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1.3rem;
  color: #70482d;
  margin: 20px 0 30px;
}

.btn-chat {
  background: #8b5e3c;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(139, 94, 60, 0.3);
  transition: background 0.2s, transform 0.2s;
}

.btn-chat:hover {
  background: #70482d;
  transform: translateY(-2px);
}

/* --- CATALOGO SECTION --- */
.catalogo {
  background: #f5efe6;
  padding: 60px 20px;
}

.catalogo h2, .localizacao h2 {
  text-align: center;
  color: #5a3825;
  font-size: 2.2rem;
  margin-bottom: 5px;
}

.subtitulo-secao {
  text-align: center;
  color: #8b5e3c;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.categorias-grid {
  display: flex;
  gap: 25px;
  max-width: 1100px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.categoria-card {
  background: white;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.categoria-card h3 {
  color: #8b5e3c;
  border-bottom: 2px solid #f5efe6;
  padding-bottom: 10px;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.lista-itens {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  color: #2c1810;
  font-size: 1.1rem;
}

.item-preco {
  color: #8b5e3c;
}

.item-desc {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* --- LOCALIZACAO SECTION --- */
.localizacao {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  gap: 40px;
  align-items: center;
  flex-wrap: wrap;
}

.localizacao-conteudo {
  flex: 1;
  min-width: 300px;
}

.localizacao h2 {
  text-align: left;
  margin-bottom: 20px;
}

.endereco {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #2c1810;
}

.ponto-referencia {
  font-size: 1rem;
  color: #8b5e3c;
  font-style: italic;
}

.horarios {
  margin-top: 25px;
  background: #fdfbf7;
  padding: 15px;
  border-left: 4px solid #8b5e3c;
  border-radius: 4px;
}

.horarios h4 {
  margin: 0 0 8px 0;
  color: #5a3825;
}

.horarios p {
  margin: 4px 0;
  color: #555;
}

.mapa-ficticio {
  flex: 1;
  min-width: 300px;
  height: 250px;
  background: #e3dec3;
  border-radius: 15px;
  border: 3px solid #d7c3ad;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #5a3825;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
}

.mapa-ficticio::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 20px;
  background: rgba(255,255,255,0.4);
  transform: rotate(30deg);
}
.mapa-ficticio::after {
  content: '';
  position: absolute;
  width: 150%;
  height: 20px;
  background: rgba(255,255,255,0.4);
  transform: rotate(-45deg);
}

.pino-mapa {
  font-size: 2.5rem;
  animation: bounce 2s infinite;
  z-index: 1;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .localizacao { flex-direction: column; text-align: center; }
  .localizacao h2 { text-align: center; }
  .horarios { border-left: none; border-top: 4px solid #8b5e3c; }
}
</style>