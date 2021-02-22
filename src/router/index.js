import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Farmers from '../views/Farmers.vue'
import Farms from '../views/Farms.vue'
import Harvests from '../views/Harvests.vue'
import Statistics from '../views/Statistics.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/authenticated']) {
        return next({
          name: 'Farmers'
        })
      }
      next()
    }
  },
  {
    path: '/farmers',
    name: 'Farmers',
    component: Farmers,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/farmers/:farmerId/farms',
    name: 'Farms',
    component: Farms,
    props: true,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/farmers/:farmerId/farms/:farmId/harvests',
    name: 'Harvests',
    component: Harvests,
    props: true,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Home'
        })
      }
      next()
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/authenticated']) {
        return next({
          name: 'Home'
        })
      }
      next()
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
