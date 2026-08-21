import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CardapioView from '../views/CardapioView.vue'
import ReservasView from '../views/ReservasView.vue'
import ChatView from '../views/ChatView.vue'
import SobreView from '../views/SobreView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/cardapio',
      component: CardapioView
    },
    {
      path: '/reservas',
      component: ReservasView
    },
    {
      path: '/chat',
      component: ChatView
    },
    {
      path: '/sobre',
      component: SobreView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/Checkout.vue')
    }
  ]
})

export default router