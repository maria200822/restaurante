<script setup lang="ts">
import Header from './components/Header.vue'
import NotificacaoPedido from './components/NotificacaoPedido.vue'
</script>

<template>
  <div class="app">

    <Header />

    <main>
      <RouterView />
    </main>

    <NotificacaoPedido />

  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

button,
input,
select {
  font-family: inherit;
}
</style>