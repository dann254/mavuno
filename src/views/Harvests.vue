<template>
  <div class="harvest container">
    <h2 class="text-primary"> Harvests </h2>
    <div class="card table-card">
      <div class="card-body">
        <table class="table" v-if="harvests">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date Created</th>
              <th scope="col">Wet weight</th>
              <th scope="col">dry weight</th>
              <th scope="col">Crop</th>
              <th scope="col">Photos</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="harvest in harvests" :key="harvest.id">
              <th scope="row">{{harvest.id}}</th>
              <td>{{moment(harvest.created_at).format('YYYY')}}</td>
              <td>{{ harvest.wet_weight }} kg</td>
              <td>{{ harvest.dry_weight }} kg</td>
              <td>{{ harvest.farm.crop.name }}</td>
              <td> <a href="#" @click="$bvModal.show(`modal-${harvest.id}`)">view</a></td>
              <td><a href="">edit</a> | <a href="">delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="card card-inactive" v-else>
          <div class="card-body text-center">
            <!-- Title -->
            <h5 class="mt-0 text-muted">
              No Harvests For this farm Yet!
            </h5>
            <h6></h6>
          </div>
        </div>

        <div v-for="harvest in harvests" :key="harvest.id">
          <b-modal :id="'modal-'+ harvest.id" centered title="Images">
            <img v-for="image in harvests.photos" :key="image.id" src="" alt="">
          </b-modal>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Harvests',
  props: [
    "farmerId",
    "farmId"
  ],
  data() {
    return {
      moment: moment,
      form: {
        farmerId: this.farmerId,
        farmId: this.farmId,
        wet_weight: null,
        dry_weight: null,
      }
    }
  },
  components: {
  },
  methods: {
    ...mapActions({
      fetchHarvests: 'harvests/fetchHarvests',
      addHarvest: 'farms/addHarvest'
    })
  },
  computed: {
    ...mapGetters({
      harvests: 'harvests/allHarvests'
    })
  },
  created() {
    this.fetchHarvests({farmerId: this.farmerId, farmId: this.farmId})
  }
}
</script>

<style lang="scss" scoped>
.harvest {

  .table-card{
    border: 1px;
    border-style: solid;
    border-color: $_border_color !important;
    box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.1);

    .card-body {
      .table > thead th {
          border-top: none;
      }
    }
  }
}
</style>
