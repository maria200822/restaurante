
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface PremioRoleta {
  cor: string
  nome: string
  codigo: string
  descricao: string
}

const roletaVisivel = ref(false)
const girando = ref(false)
const angulo = ref(0)
const premioDoDia = ref<PremioRoleta | null>(null)
const podeGirar = ref(true)

const premios: PremioRoleta[] = [
  {
    cor: 'azul',
    nome: '10% OFF em Doces',
    codigo: 'DOCE10',
    descricao: 'Ganhe 10% de desconto nas sobremesas do Restaurante Sahur.'
  },
  {
    cor: 'vermelho',
    nome: '10% OFF em Lanches',
    codigo: 'LANCHE10',
    descricao: 'Ganhe 10% de desconto nos lanches do Restaurante Sahur.'
  },
  {
    cor: 'verde',
    nome: '12% OFF em Pizzas',
    codigo: 'PIZZA12',
    descricao: 'Ganhe 12% de desconto nas pizzas do Restaurante Sahur.'
  },
  {
    cor: 'amarelo',
    nome: 'Bebida Grátis',
    codigo: 'BEBIDA',
    descricao: 'Ganhe uma bebida grátis em seu próximo pedido.'
  },
  {
    cor: 'roxo',
    nome: '10% OFF em Pratos',
    codigo: 'PRATO10',
    descricao: 'Ganhe 10% de desconto nos pratos principais.'
  },
  {
    cor: 'laranja',
    nome: '5% OFF no Pedido',
    codigo: 'SAHUR5',
    descricao: 'Ganhe 5% de desconto no seu próximo pedido.'
  }
]

function dataHoje() {
  const agora = new Date()

  return `${agora.getFullYear()}-${String(
    agora.getMonth() + 1
  ).padStart(2, '0')}-${String(
    agora.getDate()
  ).padStart(2, '0')}`
}

function verificarPremioDoDia() {
  const salvo = localStorage.getItem('premioRoletaSahur')

  if (!salvo) {
    podeGirar.value = true
    return
  }

  try {
    const dados = JSON.parse(salvo)

    if (dados.data === dataHoje()) {
      premioDoDia.value = dados.premio
      podeGirar.value = false
    } else {
      premioDoDia.value = null
      podeGirar.value = true
    }
  } catch {
    premioDoDia.value = null
    podeGirar.value = true
  }
}

function abrirRoleta() {
  verificarPremioDoDia()
  roletaVisivel.value = true
}

function fecharRoleta() {
  if (!girando.value) {
    roletaVisivel.value = false
  }
}

function girarRoleta() {
  if (girando.value || !podeGirar.value) {
    return
  }

  girando.value = true

  const indice = Math.floor(Math.random() * premios.length)

  const premio = premios[indice]

  const grausPorPremio = 360 / premios.length

  const alvo =
    5 * 360 +
    (360 - indice * grausPorPremio - grausPorPremio / 2)

  angulo.value += alvo

  setTimeout(() => {
    premioDoDia.value = premio
    podeGirar.value = false
    girando.value = false

    localStorage.setItem(
      'premioRoletaSahur',
      JSON.stringify({
        data: dataHoje(),
        premio: premio
      })
    )
  }, 4200)
}

function abrirPremioSalvo() {
  verificarPremioDoDia()
  roletaVisivel.value = true
}

onMounted(() => {
  verificarPremioDoDia()
})
</script>

<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1>🍽️ Restaurante Sahur</h1>

        <p>
          Bem-vindo ao restaurante mais divertido e saboroso da cidade!
        </p>

        <!-- BOTÃO DA ROLETA -->
        <button
          class="btn-chat"
          @click="abrirRoleta"
        >
          🎁
          {{
            premioDoDia
              ? 'Ver Meu Prêmio'
              : 'Girar Roleta'
          }}
        </button>
      </div>
    </section>

    <!-- CATÁLOGO -->
    <section class="catalogo">

      <h2>✨ Nosso Cardápio Destaque</h2>

      <p class="subtitulo-secao">
        Conheça algumas de nossas especialidades mais amadas
      </p>

      <div class="categorias-grid">

        <!-- PRATOS -->
        <div class="categoria-card">

          <div class="card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
              alt="Pratos Principais"
              class="card-image"
            />
          </div>

          <h3>Pratos Principais</h3>

          <ul class="lista-itens">

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Monifeijão
                </span>

                <span class="item-preco">
                  R$ 44,90
                </span>
              </div>

              <p class="item-desc">
                O feijão tropeiro mais completo e temperado da região.
              </p>
            </li>

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Wemacarrão
                </span>

                <span class="item-preco">
                  R$ 39,90
                </span>
              </div>

              <p class="item-desc">
                Massa artesanal ao molho de tomate fresco e manjericão.
              </p>
            </li>

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Parmegiana Emiliana
                </span>

                <span class="item-preco">
                  R$ 47,90
                </span>
              </div>

              <p class="item-desc">
                Filé empanado crocante, coberto com muito queijo e molho.
              </p>
            </li>

          </ul>
        </div>

        <!-- PIZZAS -->
        <div class="categoria-card">

          <div class="card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
              alt="Pizzas e Lanches"
              class="card-image"
            />
          </div>

          <h3>Pizzas & Lanches</h3>

          <ul class="lista-itens">

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Emilizza Especializza
                </span>

                <span class="item-preco">
                  R$ 62,90
                </span>
              </div>

              <p class="item-desc">
                Molho artesanal, muçarela, pepperoni e borda recheada.
              </p>
            </li>

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Sahur Smashur
                </span>

                <span class="item-preco">
                  R$ 25,90
                </span>
              </div>

              <p class="item-desc">
                Blend de 150g prensado, queijo prato e maionese da casa.
              </p>
            </li>

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Julião Baconzão
                </span>

                <span class="item-preco">
                  R$ 29,90
                </span>
              </div>

              <p class="item-desc">
                Hambúrguer rústico com camadas generosas de bacon crocante.
              </p>
            </li>

          </ul>
        </div>

        <!-- SOBREMESAS -->
        <div class="categoria-card">

          <div class="card-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=500&q=80"
              alt="Sobremesas"
              class="card-image"
            />
          </div>

          <h3>Sobremesas</h3>

          <ul class="lista-itens">

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Brigadeirão Patapimão
                </span>

                <span class="item-preco">
                  R$ 18,90
                </span>
              </div>

              <p class="item-desc">
                Brigadeiro cremoso gigante com granulado belga.
              </p>
            </li>

            <li>
              <div class="item-info">
                <span class="item-nome">
                  Tiramissahur
                </span>

                <span class="item-preco">
                  R$ 24,90
                </span>
              </div>

              <p class="item-desc">
                Clássica sobremesa italiana com o toque secreto do Sahur.
              </p>
            </li>

          </ul>
        </div>

      </div>
    </section>

    <!-- LOCALIZAÇÃO -->
    <section class="localizacao">

      <div class="localizacao-conteudo">

        <h2>📍 Onde Estamos</h2>

        <p class="endereco">
          <strong>
            Avenida dos Sabores, nº 1234
          </strong>
          <br />

          Bairro Gourmet —
          <br />

          <span class="ponto-referencia">
            Procurando pela fachada amarela ao lado do Parque Central!
          </span>
        </p>

        <div class="horarios">

          <h4>
            Horários de Funcionamento:
          </h4>

          <p>
            Segunda a Sexta: 11h às 23h
          </p>

          <p>
            Sábados e Domingos: 11h à 00h
          </p>

        </div>

      </div>

      <div class="mapa-ficticio">

        <div class="pino-mapa">
          📍
        </div>

        <span>
          Mapa Interativo Sahur
        </span>

      </div>

    </section>

    <!-- ========================= -->
    <!-- MODAL DA ROLETA -->
    <!-- ========================= -->

    <div
      v-if="roletaVisivel"
      class="roleta-overlay"
    >

      <div class="roleta-modal">

        <button
          class="btn-fechar"
          @click="fecharRoleta"
        >
          ×
        </button>

        <h2>
          Roleta Sahur
        </h2>

        <p class="roleta-sub">
          {{
            premioDoDia
              ? 'Este é o seu prêmio de hoje!'
              : 'Gire uma vez por dia e descubra sua promoção!'
          }}
        </p>

        <!-- ROLETA -->
        <div class="roleta-container">

          <div class="ponteiro"></div>

          <div
            class="roda"
            :style="{
              transform: `rotate(${angulo}deg)`
            }"
          >

            <div class="fatia azul">
              Doces
            </div>

            <div class="fatia vermelho">
              Lanches
            </div>

            <div class="fatia verde">
              Pizzas
            </div>

            <div class="fatia amarelo">
              Bebidas
            </div>

            <div class="fatia roxo">
              Pratos
            </div>

            <div class="fatia laranja">
              5% OFF
            </div>

          </div>

          <div class="centro-roleta">
            S
          </div>

        </div>

        <!-- BOTÃO GIRAR -->
        <button
          v-if="!premioDoDia"
          class="btn-girar"
          :disabled="girando"
          @click="girarRoleta"
        >
          {{
            girando
              ? 'Girando...'
              : 'GIRAR ROLETA'
          }}
        </button>

        <!-- PRÊMIO -->
        <div
          v-if="premioDoDia"
          class="resultado-premio"
        >

          <div
            class="bolinha-cor"
            :class="premioDoDia.cor"
          ></div>

          <h3>
            Parabéns!
          </h3>

          <h4>
            {{ premioDoDia.nome }}
          </h4>

          <p>
            {{ premioDoDia.descricao }}
          </p>

          <div class="codigo-premio">
            {{ premioDoDia.codigo }}
          </div>

          <p class="aviso-premio">
            Você pode usar este prêmio em seu próximo pedido.
          </p>

          <button
            class="btn-fechar-premio"
            @click="fecharRoleta"
          >
            Fechar
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>

/* =========================
   ESTILO GERAL
========================= */

* {
  box-sizing: border-box;
  font-family:
    'Segoe UI',
    Tahoma,
    Geneva,
    Verdana,
    sans-serif;
}

/* =========================
   HERO
========================= */

.hero {
  position: relative;
  text-align: center;
  padding: 120px 20px;

  background-image:
    url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80');

  background-size: cover;
  background-position: center;

  color: white;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    rgba(0, 0, 0, 0.6);

  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: 3.8rem;
  margin-bottom: 10px;

  text-shadow:
    2px 2px 8px rgba(0, 0, 0, 0.7);
}

.hero p {
  font-size: 1.4rem;
  margin: 20px 0 35px;

  text-shadow:
    1px 1px 4px rgba(0, 0, 0, 0.7);
}

/* =========================
   BOTÃO HERO
========================= */

.btn-chat {
  background: #ea1d2c;
  color: white;

  border: none;

  padding: 16px 36px;

  border-radius: 30px;

  cursor: pointer;

  font-size: 1.2rem;
  font-weight: bold;

  box-shadow:
    0 4px 15px
    rgba(234, 29, 44, 0.4);

  transition: 0.3s;
}

.btn-chat:hover {
  background: #c01522;

  transform:
    translateY(-3px);

  box-shadow:
    0 6px 20px
    rgba(234, 29, 44, 0.6);
}

/* =========================
   CATÁLOGO
========================= */

.catalogo {
  background: #fdfbf7;
  padding: 80px 20px;
}

.catalogo h2,
.localizacao h2 {
  text-align: center;

  color: #2c1810;

  font-size: 2.5rem;

  margin-bottom: 5px;
}

.subtitulo-secao {
  text-align: center;

  color: #8b5e3c;

  margin-bottom: 50px;

  font-size: 1.1rem;
}

.categorias-grid {
  display: flex;

  gap: 30px;

  max-width: 1140px;

  margin: 0 auto;

  flex-wrap: wrap;

  justify-content: center;
}

.categoria-card {
  background: white;

  flex: 1;

  min-width: 320px;
  max-width: 360px;

  border-radius: 20px;

  box-shadow:
    0 10px 30px
    rgba(0, 0, 0, 0.06);

  overflow: hidden;

  border:
    1px solid #f5efe6;

  transition: 0.3s;

  padding-bottom: 25px;
}

.categoria-card:hover {
  transform:
    translateY(-5px);
}

.card-image-wrapper {
  width: 100%;
  height: 200px;

  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: 0.5s;
}

.categoria-card:hover .card-image {
  transform:
    scale(1.06);
}

.categoria-card h3 {
  color: #2c1810;

  padding:
    20px 25px 10px;

  margin: 0;

  font-size: 1.5rem;
}

.lista-itens {
  list-style: none;

  padding:
    0 25px;

  margin-top: 15px;

  display: flex;

  flex-direction: column;

  gap: 22px;
}

.item-info {
  display: flex;

  justify-content: space-between;

  font-weight: bold;

  color: #2c1810;

  font-size: 1.1rem;

  gap: 10px;
}

.item-preco {
  color: #e67e22;

  white-space: nowrap;
}

.item-desc {
  margin-top: 5px;

  color: #7f8c8d;

  font-size: 0.95rem;

  line-height: 1.5;
}

/* =========================
   LOCALIZAÇÃO
========================= */

.localizacao {
  max-width: 1100px;

  margin: 0 auto;

  padding: 80px 20px;

  display: flex;

  gap: 50px;

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
  margin-top: 30px;

  background: #fffdf9;

  padding: 20px;

  border-left:
    5px solid #e67e22;

  border-radius: 8px;

  box-shadow:
    0 4px 15px
    rgba(0, 0, 0, 0.02);
}

.horarios h4 {
  margin: 0 0 10px;

  color: #2c1810;

  font-size: 1.1rem;
}

.horarios p {
  margin: 6px 0;

  color: #555;
}

.mapa-ficticio {
  flex: 1;

  min-width: 300px;

  height: 280px;

  background: #e3dec3;

  border-radius: 20px;

  border:
    3px solid #d7c3ad;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 10px;

  color: #5a3825;

  font-weight: bold;

  position: relative;

  overflow: hidden;
}

.pino-mapa {
  font-size: 2.8rem;

  animation:
    bounce 2s infinite;

  z-index: 1;
}

/* =========================
   ROLETA
========================= */

.roleta-overlay {
  position: fixed;

  inset: 0;

  background:
    rgba(0, 0, 0, 0.7);

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 9999;

  padding: 20px;
}

.roleta-modal {
  width: 430px;

  max-width: 95vw;

  background: white;

  border-radius: 25px;

  padding: 30px 25px;

  text-align: center;

  position: relative;

  box-shadow:
    0 20px 50px
    rgba(0, 0, 0, 0.3);
}

.btn-fechar {
  position: absolute;

  right: 15px;
  top: 15px;

  width: 35px;
  height: 35px;

  border: none;

  border-radius: 50%;

  background: #f1f1f1;

  font-size: 23px;

  cursor: pointer;

  color: #555;
}

.roleta-modal h2 {
  color: #5a3825;

  margin-bottom: 8px;

  font-size: 1.8rem;
}

.roleta-sub {
  color: #777;

  margin-bottom: 15px;
}

/* =========================
   CÍRCULO DA ROLETA
========================= */

.roleta-container {
  width: 290px;
  height: 290px;

  margin: 20px auto;

  position: relative;
}

.roda {
  width: 270px;
  height: 270px;

  position: absolute;

  left: 10px;
  top: 10px;

  border-radius: 50%;

  border:
    7px solid white;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.25);

  overflow: hidden;

  background:
    conic-gradient(
      #3498db 0deg 60deg,
      #e74c3c 60deg 120deg,
      #2ecc71 120deg 180deg,
      #f1c40f 180deg 240deg,
      #8e44ad 240deg 300deg,
      #e67e22 300deg 360deg
    );

  transition:
    transform 4.2s
    cubic-bezier(
      0.15,
      0.85,
      0.15,
      1
    );
}

.fatia {
  position: absolute;

  width: 100%;

  top: 47%;

  text-align: center;

  color: white;

  font-weight: bold;

  font-size: 14px;

  text-shadow:
    1px 1px 3px
    rgba(0, 0, 0, 0.5);
}

.f1,
.azul {
  transform:
    rotate(30deg);
}

.f2,
.vermelho {
  transform:
    rotate(90deg);
}

.f3,
.verde {
  transform:
    rotate(150deg);
}

.f4,
.amarelo {
  transform:
    rotate(210deg);
}

.f5,
.roxo {
  transform:
    rotate(270deg);
}

.f6,
.laranja {
  transform:
    rotate(330deg);
}

/* =========================
   CENTRO
========================= */

.centro-roleta {
  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  width: 55px;
  height: 55px;

  background: white;

  border:
    6px solid #5a3825;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 22px;

  font-weight: bold;

  color: #5a3825;

  z-index: 5;
}

/* =========================
   PONTEIRO
========================= */

.ponteiro {
  position: absolute;

  z-index: 10;

  left: 50%;
  top: -3px;

  transform:
    translateX(-50%);

  width: 0;
  height: 0;

  border-left:
    14px solid transparent;

  border-right:
    14px solid transparent;

  border-top:
    30px solid #5a3825;
}

/* =========================
   BOTÃO
========================= */

.btn-girar {
  width: 100%;

  padding: 15px;

  border: none;

  border-radius: 12px;

  background: #5a3825;

  color: white;

  font-weight: bold;

  font-size: 1rem;

  cursor: pointer;

  transition: 0.2s;
}

.btn-girar:hover {
  background: #8b5e3c;
}

.btn-girar:disabled {
  background: #aaa;

  cursor: not-allowed;
}

/* =========================
   RESULTADO
========================= */

.resultado-premio {
  margin-top: 15px;

  padding: 20px;

  background: #faf7f2;

  border-radius: 15px;

  border:
    1px solid #e5d6c6;
}

.resultado-premio h3 {
  color: #5a3825;

  margin-bottom: 8px;
}

.resultado-premio h4 {
  color: #8b5e3c;

  font-size: 1.3rem;

  margin: 8px 0;
}

.resultado-premio p {
  color: #666;

  line-height: 1.5;
}

.bolinha-cor {
  width: 25px;
  height: 25px;

  border-radius: 50%;

  margin:
    0 auto 10px;
}

.bolinha-cor.azul {
  background: #3498db;
}

.bolinha-cor.vermelho {
  background: #e74c3c;
}

.bolinha-cor.verde {
  background: #2ecc71;
}

.bolinha-cor.amarelo {
  background: #f1c40f;
}

.bolinha-cor.roxo {
  background: #8e44ad;
}

.bolinha-cor.laranja {
  background: #e67e22;
}

.codigo-premio {
  margin:
    15px 0;

  padding: 12px;

  background: white;

  border:
    2px dashed #8b5e3c;

  border-radius: 10px;

  color: #5a3825;

  font-weight: bold;

  font-size: 20px;

  letter-spacing: 2px;
}

.aviso-premio {
  font-size: 13px;
}

.btn-fechar-premio {
  width: 100%;

  padding: 12px;

  border: none;

  border-radius: 10px;

  background: #5a3825;

  color: white;

  cursor: pointer;

  font-weight: bold;
}

/* =========================
   ANIMAÇÃO
========================= */

@keyframes bounce {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-10px);
  }
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 768px) {

  .hero h1 {
    font-size: 2.6rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .localizacao {
    flex-direction: column;

    text-align: center;
  }

  .localizacao h2 {
    text-align: center;
  }

  .horarios {
    border-left: none;

    border-top:
      5px solid #e67e22;
  }
}

@media (max-width: 500px) {

  .roleta-modal {
    padding:
      25px 18px;
  }

  .roleta-container {
    transform:
      scale(0.9);

    margin-top: 5px;
    margin-bottom: 5px;
  }

  .hero h1 {
    font-size: 2.2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .btn-chat {
    font-size: 1rem;

    padding:
      14px 25px;
  }
}

</style>

