<script setup lang="ts">
import { ref } from 'vue'

const mostrarFotos = ref(false)
const fotoAtual = ref(0)

const fotos = [
  {
    src: '/imagens/restaurante/frente.png',
    titulo: 'Fachada do Restaurante',
    descricao: 'Conheça a fachada do Restaurante Sahur.'
  },
  {
    src: '/imagens/restaurante/interior.png',
    titulo: 'Interior',
    descricao: 'Um ambiente aconchegante e sofisticado para você aproveitar.'
  },
  {
    src: '/imagens/restaurante/comidas.png',
    titulo: 'Comidas do Sahur',
    descricao: 'Pratos preparados com carinho e apresentados pelos nossos clientes.'
  }
]

function abrirFotos() {
  fotoAtual.value = 0
  mostrarFotos.value = true
}

function fecharFotos() {
  mostrarFotos.value = false
}

function proximaFoto() {
  if (fotoAtual.value < fotos.length - 1) {
    fotoAtual.value++
  } else {
    fotoAtual.value = 0
  }
}

function fotoAnterior() {
  if (fotoAtual.value > 0) {
    fotoAtual.value--
  } else {
    fotoAtual.value = fotos.length - 1
  }
}

function selecionarFoto(index: number) {
  fotoAtual.value = index
}
</script>

<template>
  <div class="sobre-page">

    <!-- HERO -->

    <section class="hero-sobre">

      <div class="hero-conteudo">

        <span class="pequeno-titulo">
          RESTAURANTE SAHUR
        </span>

        <h1>
          Um lugar para comer,
          <span>conversar e aproveitar.</span>
        </h1>

        <p>
          O Restaurante Sahur nasceu para reunir boa comida,
          um ambiente aconchegante e momentos especiais.
        </p>

        <button
          class="btn-fotos"
          @click="abrirFotos"
        >
          Conheça nosso restaurante
        </button>

      </div>

    </section>


    <!-- SOBRE -->

    <section class="sobre-conteudo">

      <div class="sobre-texto">

        <span class="titulo-secao">
          SOBRE NÓS
        </span>

        <h2>
          Mais do que um restaurante,
          uma experiência.
        </h2>

        <p>
          O Restaurante Sahur foi criado pensando em pessoas
          que gostam de boa comida e de ambientes agradáveis.
        </p>

        <p>
          Nosso espaço combina uma decoração acolhedora,
          iluminação quente e um cardápio pensado para
          diferentes gostos.
        </p>

        <p>
          Seja para um jantar especial, um encontro com amigos
          ou simplesmente para comer algo delicioso,
          o Sahur está esperando por você.
        </p>

      </div>


      <div class="sobre-imagem">

        <img
          src="/imagens/restaurante/interior.png"
          alt="Interior do Restaurante Sahur"
        />

      </div>

    </section>


    <!-- DIFERENCIAIS -->

    <section class="diferenciais">

      <div class="titulo-central">

        <span class="titulo-secao">
          NOSSO ESPAÇO
        </span>

        <h2>
          Feito para você se sentir bem
        </h2>

      </div>


      <div class="cards-diferenciais">

        <div class="card-diferencial">

          <div class="icone">
            01
          </div>

          <h3>
            Ambiente aconchegante
          </h3>

          <p>
            Um espaço confortável, com iluminação
            quente e decoração elegante.
          </p>

        </div>


        <div class="card-diferencial">

          <div class="icone">
            02
          </div>

          <h3>
            Boa gastronomia
          </h3>

          <p>
            Pratos preparados para proporcionar
            uma experiência especial.
          </p>

        </div>


        <div class="card-diferencial">

          <div class="icone">
            03
          </div>

          <h3>
            Área externa
          </h3>

          <p>
            Para quem prefere aproveitar a refeição
            ao ar livre.
          </p>

        </div>

      </div>

    </section>


    <!-- LOCALIZAÇÃO -->

    <section class="localizacao">

      <div class="localizacao-texto">

        <span class="titulo-secao">
          ONDE ESTAMOS
        </span>

        <h2>
          Visite o Restaurante Sahur
        </h2>

        <p class="endereco">
          Avenida dos Sabores, nº 1234
          <br>
          Bairro Gourmet —
        </p>

        <p class="observacao">
          Procurando pela fachada amarela
          ao lado do Parque Central!
        </p>


        <div class="horarios">

          <h3>
            Horários de Funcionamento
          </h3>

          <p>
            Segunda a Sexta: 11h às 23h
          </p>

          <p>
            Sábados e Domingos: 11h à 00h
          </p>

        </div>

      </div>


      <!-- MAPA -->

      <div class="mapa-container">

        <div class="mapa">

          <div class="mapa-fundo">

            <div class="rua rua-1"></div>
            <div class="rua rua-2"></div>
            <div class="rua rua-3"></div>
            <div class="rua rua-4"></div>

            <div class="parque">
              Parque Central
            </div>

          </div>


          <button
            class="marcador"
            @click="abrirFotos"
            title="Ver fotos do Restaurante Sahur"
          >
            <span class="pin">
              ●
            </span>

            <strong>
              Restaurante Sahur
            </strong>

            <small>
              Clique para ver as fotos
            </small>

          </button>

        </div>


        <button
          class="btn-ver-fotos"
          @click="abrirFotos"
        >
          Ver fotos do restaurante
        </button>

      </div>

    </section>


    <!-- MODAL DE FOTOS -->

    <div
      v-if="mostrarFotos"
      class="modal-overlay"
      @click.self="fecharFotos"
    >

      <div class="modal-fotos">

        <!-- FECHAR -->

        <button
          class="btn-fechar"
          @click="fecharFotos"
        >
          ×
        </button>


        <!-- CABEÇALHO -->

        <div class="modal-header">

          <div class="icone-restaurante">
            ♜
          </div>

          <div>

            <h2>
              Restaurante Sahur
            </h2>

            <p>
              Conheça nosso espaço
            </p>

          </div>

        </div>


        <!-- FOTO PRINCIPAL -->

        <div class="foto-principal">

          <img
            :src="fotos[fotoAtual].src"
            :alt="fotos[fotoAtual].titulo"
          />


          <!-- SETA ESQUERDA -->

          <button
            class="seta esquerda"
            @click="fotoAnterior"
          >
            ‹
          </button>


          <!-- SETA DIREITA -->

          <button
            class="seta direita"
            @click="proximaFoto"
          >
            ›
          </button>

        </div>


        <!-- INFORMAÇÃO -->

        <div class="informacao-foto">

          <h3>
            {{ fotos[fotoAtual].titulo }}
          </h3>

          <p>
            {{ fotos[fotoAtual].descricao }}
          </p>

        </div>


        <!-- MINIATURAS -->

        <div class="miniaturas">

          <button
            v-for="(foto, index) in fotos"
            :key="foto.src"
            class="miniatura"
            :class="{ ativa: fotoAtual === index }"
            @click="selecionarFoto(index)"
          >

            <img
              :src="foto.src"
              :alt="foto.titulo"
            />

          </button>

        </div>


        <!-- INDICADORES -->

        <div class="indicadores">

          <span
            v-for="(_, index) in fotos"
            :key="index"
            :class="{ ativo: fotoAtual === index }"
            @click="selecionarFoto(index)"
          ></span>

        </div>

      </div>

    </div>

  </div>
</template>


<style scoped>

* {
  box-sizing: border-box;
}

.sobre-page {
  min-height: 100vh;
  background: #f5efe6;
  color: #3d291e;
}


/* =========================
   HERO
========================= */

.hero-sobre {
  min-height: 480px;

  display: flex;
  align-items: center;

  padding: 80px 8%;

  background:
    linear-gradient(
      90deg,
      rgba(30, 18, 10, 0.92),
      rgba(30, 18, 10, 0.65),
      rgba(30, 18, 10, 0.25)
    ),
    url('/imagens/restaurante/frente.png');

  background-size: cover;
  background-position: center;
}

.hero-conteudo {
  max-width: 650px;
  color: white;
}

.pequeno-titulo,
.titulo-secao {
  color: #a66a45;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 13px;
}

.hero-conteudo .pequeno-titulo {
  color: #d9b38c;
}

.hero-conteudo h1 {
  font-size: 52px;
  line-height: 1.08;
  margin: 18px 0;
}

.hero-conteudo h1 span {
  color: #d9b38c;
}

.hero-conteudo p {
  font-size: 18px;
  line-height: 1.7;
  color: #eee;
  margin-bottom: 30px;
}

.btn-fotos {
  border: none;
  padding: 15px 25px;
  border-radius: 9px;

  background: #8b5e3c;
  color: white;

  font-size: 15px;
  font-weight: bold;

  cursor: pointer;

  transition: 0.2s;
}

.btn-fotos:hover {
  background: #6f472d;
  transform: translateY(-2px);
}


/* =========================
   SOBRE
========================= */

.sobre-conteudo {
  max-width: 1200px;
  margin: auto;

  padding: 90px 30px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  align-items: center;
}

.sobre-texto h2,
.localizacao h2,
.titulo-central h2 {
  font-size: 38px;
  line-height: 1.2;
  color: #4a2e1f;
  margin: 15px 0 25px;
}

.sobre-texto p {
  color: #6f625a;
  line-height: 1.8;
  font-size: 16px;
}

.sobre-imagem {
  height: 430px;
  overflow: hidden;
  border-radius: 20px;

  box-shadow: 0 12px 35px rgba(50, 30, 15, 0.18);
}

.sobre-imagem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* =========================
   DIFERENCIAIS
========================= */

.diferenciais {
  padding: 80px 30px;
  background: #fffaf4;
}

.titulo-central {
  text-align: center;
  max-width: 700px;
  margin: auto;
}

.cards-diferenciais {
  max-width: 1100px;
  margin: 45px auto 0;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card-diferencial {
  padding: 30px;

  background: white;

  border: 1px solid #eadccd;
  border-radius: 16px;

  box-shadow: 0 7px 25px rgba(50, 30, 15, 0.06);
}

.icone {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #8b5e3c;
  color: white;

  font-size: 13px;
  font-weight: bold;

  margin-bottom: 20px;
}

.card-diferencial h3 {
  color: #4a2e1f;
}

.card-diferencial p {
  color: #777;
  line-height: 1.6;
}


/* =========================
   LOCALIZAÇÃO
========================= */

.localizacao {
  max-width: 1200px;
  margin: auto;

  padding: 90px 30px;

  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 55px;

  align-items: center;
}

.endereco {
  font-size: 19px;
  line-height: 1.7;
}

.observacao {
  color: #8b5e3c;
  font-style: italic;
}

.horarios {
  margin-top: 30px;

  background: white;
  padding: 25px;

  border-radius: 15px;

  box-shadow: 0 7px 25px rgba(50, 30, 15, 0.08);
}

.horarios h3 {
  color: #5a3825;
}

.horarios p {
  color: #6f625a;
}


/* =========================
   MAPA
========================= */

.mapa-container {
  background: white;
  padding: 12px;

  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(50, 30, 15, 0.12);
}

.mapa {
  height: 390px;

  position: relative;
  overflow: hidden;

  border-radius: 14px;

  background: #ddd9cd;
}

.mapa-fundo {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      25deg,
      transparent 45%,
      rgba(255,255,255,0.8) 46%,
      rgba(255,255,255,0.8) 49%,
      transparent 50%
    ),
    linear-gradient(
      -30deg,
      transparent 45%,
      rgba(255,255,255,0.8) 46%,
      rgba(255,255,255,0.8) 49%,
      transparent 50%
    );

  background-color: #d9d7cd;
}

.rua {
  position: absolute;
  background: #f3f1e8;
  transform: rotate(25deg);
}

.rua-1 {
  width: 120%;
  height: 38px;
  top: 80px;
  left: -30px;
}

.rua-2 {
  width: 120%;
  height: 30px;
  top: 220px;
  left: -20px;
  transform: rotate(-25deg);
}

.rua-3 {
  width: 30px;
  height: 120%;
  left: 130px;
  top: -30px;
  transform: rotate(20deg);
}

.rua-4 {
  width: 25px;
  height: 120%;
  right: 120px;
  top: -30px;
  transform: rotate(-30deg);
}

.parque {
  position: absolute;

  width: 170px;
  height: 100px;

  left: 30px;
  bottom: 35px;

  background: #a9b79b;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #53634c;
  font-size: 13px;
}


/* MARCADOR */

.marcador {
  position: absolute;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  border: none;

  background: white;

  padding: 15px 20px;

  border-radius: 12px;

  box-shadow: 0 7px 25px rgba(0,0,0,0.2);

  cursor: pointer;

  min-width: 190px;
}

.pin {
  display: block;

  color: #8b5e3c;

  font-size: 34px;

  line-height: 25px;
}

.marcador strong {
  display: block;
  color: #4a2e1f;
  margin-top: 8px;
}

.marcador small {
  display: block;
  color: #888;
  margin-top: 5px;
}

.marcador:hover {
  transform: translate(-50%, -50%) scale(1.04);
}

.btn-ver-fotos {
  width: 100%;

  margin-top: 12px;

  padding: 14px;

  border: none;
  border-radius: 9px;

  background: #5a3825;
  color: white;

  font-weight: bold;

  cursor: pointer;
}

.btn-ver-fotos:hover {
  background: #3e271b;
}


/* =========================
   MODAL
========================= */

.modal-overlay {
  position: fixed;

  inset: 0;

  z-index: 9999;

  background: rgba(0,0,0,0.72);

  display: flex;

  justify-content: center;
  align-items: center;

  padding: 20px;
}

.modal-fotos {
  width: 720px;
  max-width: 95vw;

  max-height: 92vh;

  overflow-y: auto;

  background: #20150f;

  border: 1px solid #795538;

  border-radius: 20px;

  padding: 25px;

  position: relative;

  color: white;

  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}


/* FECHAR */

.btn-fechar {
  position: absolute;

  right: 18px;
  top: 18px;

  width: 40px;
  height: 40px;

  border: none;

  border-radius: 50%;

  background: rgba(255,255,255,0.15);

  color: white;

  font-size: 27px;

  cursor: pointer;

  z-index: 5;
}

.btn-fechar:hover {
  background: rgba(255,255,255,0.25);
}


/* HEADER */

.modal-header {
  display: flex;

  align-items: center;

  gap: 14px;

  margin-bottom: 20px;
}

.icone-restaurante {
  width: 45px;
  height: 45px;

  border-radius: 10px;

  background: #8b5e3c;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 22px;
}

.modal-header h2 {
  margin: 0;

  font-size: 22px;
}

.modal-header p {
  margin: 4px 0 0;

  color: #cdbcae;

  font-size: 14px;
}


/* FOTO PRINCIPAL */

.foto-principal {
  width: 100%;

  height: 390px;

  position: relative;

  overflow: hidden;

  border-radius: 14px;

  background: #100b08;
}

.foto-principal img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
}


/* SETAS */

.seta {
  position: absolute;

  top: 50%;

  transform: translateY(-50%);

  width: 45px;
  height: 45px;

  border: none;

  border-radius: 50%;

  background: rgba(0,0,0,0.55);

  color: white;

  font-size: 35px;

  cursor: pointer;

  display: flex;

  align-items: center;
  justify-content: center;
}

.seta:hover {
  background: rgba(0,0,0,0.8);
}

.esquerda {
  left: 15px;
}

.direita {
  right: 15px;
}


/* INFORMAÇÃO */

.informacao-foto {
  text-align: center;

  padding: 18px 10px 8px;
}

.informacao-foto h3 {
  margin: 0 0 7px;

  color: #d9b38c;

  font-size: 20px;
}

.informacao-foto p {
  margin: 0;

  color: #c9bbb0;
}


/* MINIATURAS */

.miniaturas {
  display: flex;

  gap: 10px;

  margin-top: 15px;

  overflow-x: auto;

  padding-bottom: 5px;
}

.miniatura {
  width: 105px;
  height: 70px;

  flex-shrink: 0;

  padding: 0;

  border: 2px solid transparent;

  border-radius: 9px;

  overflow: hidden;

  cursor: pointer;

  background: transparent;
}

.miniatura img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.miniatura.ativa {
  border-color: #d9b38c;
}

.miniatura:hover {
  border-color: #a66a45;
}


/* INDICADORES */

.indicadores {
  display: flex;

  justify-content: center;

  gap: 9px;

  margin-top: 18px;
}

.indicadores span {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  background: #69584c;

  cursor: pointer;
}

.indicadores span.ativo {
  background: white;
}


/* =========================
   RESPONSIVO
========================= */

@media (max-width: 800px) {

  .hero-sobre {
    min-height: 420px;
    padding: 60px 25px;
  }

  .hero-conteudo h1 {
    font-size: 38px;
  }

  .sobre-conteudo,
  .localizacao {
    grid-template-columns: 1fr;
  }

  .cards-diferenciais {
    grid-template-columns: 1fr;
  }

  .sobre-imagem {
    height: 350px;
  }

  .foto-principal {
    height: 300px;
  }

}

@media (max-width: 500px) {

  .hero-conteudo h1 {
    font-size: 32px;
  }

  .sobre-conteudo,
  .localizacao {
    padding: 60px 20px;
  }

  .sobre-texto h2,
  .localizacao h2,
  .titulo-central h2 {
    font-size: 30px;
  }

  .foto-principal {
    height: 230px;
  }

  .modal-fotos {
    padding: 18px;
  }

}

</style>