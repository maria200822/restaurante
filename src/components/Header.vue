<template>
  <header class="header">
    <div class="logo">
      <UtensilsCrossed class="logo-icon" :size="26" :stroke-width="2.2" />
      <span class="logo-text">SahurBot</span>
    </div>

    <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Abrir menu">
      <Menu v-if="!menuOpen" :size="26" />
      <X v-else :size="26" />
    </button>

    <nav :class="{ open: menuOpen }">
      <RouterLink to="/" @click="menuOpen = false">Início</RouterLink>
      <RouterLink to="/cardapio" @click="menuOpen = false">Cardápio</RouterLink>
      <RouterLink to="/reservas" @click="menuOpen = false">Reservas</RouterLink>
      <RouterLink to="/chat" @click="menuOpen = false">ChatBot</RouterLink>
      <RouterLink to="/sobre" @click="menuOpen = false">Sobre</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { UtensilsCrossed, Menu, X } from 'lucide-vue-next'

const menuOpen = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600&display=swap');

.header{
  background: linear-gradient(135deg, #5a3825 0%, #7a4a30 100%);
  color:white;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:18px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  flex-wrap: wrap;
  font-family: 'Poppins', sans-serif;
}

.logo{
  display:flex;
  align-items:center;
  gap:10px;
  font-family: 'Playfair Display', serif;
  font-size:1.6rem;
  font-weight:800;
  letter-spacing:0.5px;
}

.logo-icon{
  color:#ffd8a8;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
  flex-shrink:0;
}

.logo-text{
  background: linear-gradient(90deg, #ffe9d6, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

nav{
  display:flex;
  gap:8px;
}

nav a{
  position: relative;
  color:white;
  text-decoration:none;
  font-family: 'Poppins', sans-serif;
  font-weight:500;
  font-size:0.95rem;
  padding:8px 14px;
  border-radius:8px;
  transition: background 0.25s ease, transform 0.2s ease, color 0.25s ease;
}

nav a::after{
  content:"";
  position:absolute;
  left:14px;
  right:14px;
  bottom:4px;
  height:2px;
  background:#ffd8a8;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

nav a:hover{
  background: rgba(255,255,255,0.12);
  transform: translateY(-1px);
}

nav a:hover::after,
nav a.router-link-active::after{
  transform: scaleX(1);
}

nav a.router-link-active{
  color:#ffd8a8;
  font-weight:600;
}

.menu-toggle{
  display:none;
  align-items:center;
  justify-content:center;
  background:none;
  border:none;
  color:white;
  cursor:pointer;
  padding:4px;
  z-index: 101;
}

@media (max-width: 768px){
  .header{
    padding:14px 20px;
  }

  .menu-toggle{
    display:flex;
  }

  nav{
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction:column;
    gap:0;
    background:#4a2e1e;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
    box-shadow: 0 8px 16px rgba(0,0,0,0.25);
  }

  nav.open{
    max-height: 400px;
  }

  nav a{
    padding:14px 20px;
    border-radius:0;
    border-top:1px solid rgba(255,255,255,0.1);
  }

  nav a::after{
    display:none;
  }

  nav a:hover{
    background: rgba(255,255,255,0.08);
    transform:none;
  }
}

@media (max-width: 480px){
  .logo-text{
    font-size:1.1rem;
  }
}
</style>