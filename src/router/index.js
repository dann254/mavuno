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
      } else next()
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
      } else next()
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
      } else next()
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
      } else next()
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    beforeEnter: (to, from, next) => {

      let role = store.getters['auth/role']
      if (!store.getters['auth/authenticated'] || role !== 1) {
        return next({
          name: 'Home'
        })
      } else next()
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
