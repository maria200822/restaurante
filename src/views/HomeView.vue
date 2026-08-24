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

      <h2> Nosso Cardápio Destaque</h2>

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

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Poppins:wght@400;500;600;700&display=swap');

/* =========================
   ESTILO GERAL
========================= */

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* =========================
   HERO
========================= */

.hero {
  position: relative;
  text-align: center;
  padding: 140px 20px;

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
    linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%);

  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  font-size: 4.2rem;
  margin-bottom: 14px;
  letter-spacing: 0.5px;

  background: linear-gradient(90deg, #ffe9d6, #ffffff 50%, #ffd8a8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  text-shadow:
    2px 2px 20px rgba(0, 0, 0, 0.5);
}

.hero p {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 1.35rem;
  margin: 20px 0 40px;
  letter-spacing: 0.3px;

  text-shadow:
    1px 1px 6px rgba(0, 0, 0, 0.6);
}

/* =========================
   BOTÃO HERO
========================= */

.btn-chat {
  background: linear-gradient(135deg, #ea1d2c, #c01522);
  color: white;
  font-family: 'Poppins', sans-serif;

  border: none;

  padding: 17px 40px;

  border-radius: 40px;

  cursor: pointer;

  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.3px;

  box-shadow:
    0 8px 24px
    rgba(234, 29, 44, 0.45);

  transition: 0.3s;
}

.btn-chat:hover {
  background: linear-gradient(135deg, #ff2d3d, #d81e2c);

  transform:
    translateY(-3px);

  box-shadow:
    0 10px 28px
    rgba(234, 29, 44, 0.6);
}

/* =========================
   CATÁLOGO
========================= */

.catalogo {
  background: #fdfbf7;
  padding: 90px 20px;
}

.catalogo h2,
.localizacao h2 {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-weight: 800;

  color: #2c1810;

  font-size: 2.7rem;

  margin-bottom: 8px;
}

.subtitulo-secao {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;

  color: #8b5e3c;

  margin-bottom: 55px;

  font-size: 1.1rem;
  letter-spacing: 0.2px;
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

  border-radius: 22px;

  box-shadow:
    0 12px 34px
    rgba(90, 56, 37, 0.08);

  overflow: hidden;

  border:
    1px solid #f5efe6;

  transition: 0.35s ease;

  padding-bottom: 25px;
}

.categoria-card:hover {
  transform:
    translateY(-6px);

  box-shadow:
    0 18px 40px
    rgba(90, 56, 37, 0.14);
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
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  color: #2c1810;

  padding:
    22px 25px 10px;

  margin: 0;

  font-size: 1.55rem;
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
  align-items: baseline;

  font-family: 'Poppins', sans-serif;
  font-weight: 600;

  color: #2c1810;

  font-size: 1.08rem;

  gap: 10px;
}

.item-preco {
  color: #e67e22;
  font-weight: 700;

  white-space: nowrap;
}

.item-desc {
  margin-top: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;

  color: #7f8c8d;

  font-size: 0.95rem;

  line-height: 1.55;
}

/* =========================
   LOCALIZAÇÃO
========================= */

.localizacao {
  max-width: 1100px;

  margin: 0 auto;

  padding: 90px 20px;

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
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;

  line-height: 1.7;

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

  padding: 22px;

  border-left:
    5px solid #e67e22;

  border-radius: 10px;

  box-shadow:
    0 6px 20px
    rgba(0, 0, 0, 0.04);
}

.horarios h4 {
  margin: 0 0 10px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;

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

  background: linear-gradient(135deg, #e3dec3, #d7c3ad);

  border-radius: 22px;

  border:
    3px solid #d7c3ad;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 10px;

  color: #5a3825;

  font-family: 'Poppins', sans-serif;
  font-weight: 700;

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

  border-radius: 28px;

  padding: 32px 25px;

  text-align: center;

  position: relative;

  box-shadow:
    0 25px 60px
    rgba(0, 0, 0, 0.35);
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
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  color: #5a3825;

  margin-bottom: 8px;

  font-size: 1.9rem;
}

.roleta-sub {
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
  font-weight: 700;

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

  font-family: 'Playfair Display', serif;
  font-size: 22px;

  font-weight: 800;

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

  padding: 16px;

  border: none;

  border-radius: 14px;

  background: linear-gradient(135deg, #5a3825, #7a4a30);

  color: white;

  font-family: 'Poppins', sans-serif;
  font-weight: 700;

  font-size: 1rem;
  letter-spacing: 0.5px;

  cursor: pointer;

  transition: 0.25s;
}

.btn-girar:hover {
  background: linear-gradient(135deg, #7a4a30, #8b5e3c);
  transform: translateY(-2px);
}

.btn-girar:disabled {
  background: #aaa;

  cursor: not-allowed;
  transform: none;
}

/* =========================
   RESULTADO
========================= */

.resultado-premio {
  margin-top: 15px;

  padding: 22px;

  background: linear-gradient(135deg, #faf7f2, #f5ede1);

  border-radius: 16px;

  border:
    1px solid #e5d6c6;
}

.resultado-premio h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
  color: #5a3825;

  margin-bottom: 8px;
}

.resultado-premio h4 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
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

  padding: 14px;

  background: white;

  border:
    2px dashed #8b5e3c;

  border-radius: 12px;

  color: #5a3825;

  font-family: 'Playfair Display', serif;
  font-weight: 800;

  font-size: 21px;

  letter-spacing: 2.5px;
}

.aviso-premio {
  font-size: 13px;
}

.btn-fechar-premio {
  width: 100%;

  padding: 13px;

  border: none;

  border-radius: 12px;

  background: linear-gradient(135deg, #5a3825, #7a4a30);

  color: white;

  cursor: pointer;

  font-family: 'Poppins', sans-serif;
  font-weight: 700;
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
    font-size: 2.8rem;
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
    font-size: 2.3rem;
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