import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Farmers from '../views/Farmers.vue'
import Farms from '../views/Farms.vue'
import Harvests from '../views/Harvests.vue'
import Statistics from '../views/Statistics.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/farmers',
    name: 'Farmers',
    component: Farmers
  },
  {
    path: '/farmers/:farmerId/farms',
    name: 'Farms',
    component: Farms
  },
  {
    path: '/farmers/:farmerId/farms/:farmId/harvests',
    name: 'Harvests',
    component: Harvests
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
