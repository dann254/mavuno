<template>
  <div class="stats container">
    <h3 class="text-primary"> stats </h3>
    
    <div class="loader-container-page" v-if="loading">
      <Loader/>
    </div>
    <div v-if="stats && !loading">
      <div class="mt-4">
        <h4 class="text-muted mt-5">Harvests</h4>
        <div class="row mt-3 mx-1">
          <div class="card col-3 m-1">
            <div class="card-body">
              <h5 class="text-muted">Total Harvests</h5>
              <h5 class="">{{stats.harvest_stats.total_harvests}}</h5>
            </div>
          </div>
          <div class="card col-3 m-1">
            <div class="card-body">
              <h5 class="text-muted">Harvested Crops</h5>
              <h5 class="">{{stats.harvest_stats.harvested_crops}}</h5>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-muted mt-5">Farms</h4>
        <div class="row mt-3 mx-1">
          <div class="card col-3 m-1">
            <div class="card-body">
              <h5 class="text-muted">Total farms</h5>
              <h5 class="">{{stats.farm_stats.total_farms}}</h5>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-muted mt-5">Farmers</h4>
        <div class="row mt-3 mx-1">
          <div class="card col-3 m-1">
            <div class="card-body">
              <h5 class="text-muted">Total Farmers</h5>
              <h5 class="">{{stats.farmer_stats.total_farmers}}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Loader from '../components/Loader.vue'


export default {
  name: 'Statistics',
  components: {
    Loader
  },
  data (){
    return {
      loading: false,
    }
  },
  methods: {
    ...mapActions({
      fetchStats: 'stats/fetchStats',
    }),
  },
  computed: {
    ...mapGetters({
      stats: 'stats/stats'
    })
  },
  created() {
    this.loading = true
    this.fetchStats()
      .then(() => {
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  }
}
</script>

<style lang="scss" scoped>
.stats {
  padding-left: 80px;
  padding-right: 80px;
}
</style>
