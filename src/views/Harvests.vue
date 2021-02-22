<template>
  <div class="harvest container">
    <h3 class="text-primary"><span class="text-muted"> <router-link class="text-muted" :to="{ name: 'Farmers'}">Farmers > </router-link></span><span  class="text-muted"><router-link class="text-muted" :to="{ name: 'Farms', params: { farmerId: farmerId} }"> Farms > </router-link></span><span>  Harvests </span> </h3>
    <div v-if="farm">
      <h4>{{farm.farmer.name}}</h4>

      <h6>id number: {{farm.farmer.id_number}} <br> location: {{farm.farmer.location.address}}  <br> Farm Deed: {{farm.deed_number}}</h6>
    </div>
    <div class="card table-card">
      <div class="card-body">
         <div class="button-container  mb-2">  <b-button @click="modalShow = !modalShow" size="sm" variant="primary" class="table-button">Add Harvest</b-button> </div>
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
              <td><a class="text-danger action-clk" @click="deleteHarvest({farmerId: farmerId, farmId: harvest.farm.id, harvestId: harvest.id})">delete</a></td>
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
            <img class="harvest-image" v-for="image in harvest.photos" :key="image.id" :src="image.photo" alt="">
          </b-modal>
        </div>
        <div >
          <b-modal id="modal-add-harvest" v-model="modalShow" centered title="Add Harvest" ok-only ok-variant="primary" ok-title="Add">
            <div class="form-group">
              <label for="name">Wet Weight</label>
              <input type="text" class="form-control" id="wet-weight" placeholder=" Wet weight" v-model="form.wet_weight">
              <div class="text-danger mb-2" v-if="createErrors.wet_weight">
                  {{createErrors.wet_weight}}
              </div>
            </div>
            <div class="form-group">
              <label for="name">Dry Weight</label>
              <input type="text" class="form-control" id="dry-weight" placeholder="Dry weight" v-model="form.dry_weight">
              <div class="text-danger mb-2" v-if="createErrors.dry_weight">
                  {{createErrors.dry_weight}}
              </div>
            </div>
             <div class="form-group">
              <label for="name">Photos (3)</label>
              <input type="file" id="file" ref="file" class="form-control" placeholder="Select photos" multiple accept=".png, .jpg, .jpeg" v-on:change="handleFileUpload()">
            </div>
            <div class="text-danger mb-2 mt-2" v-if="createErrors.general">
                {{createErrors.general}}
            </div>
            <template #modal-footer="{}">
              <b-button variant="primary" @click="submitHarvest()">
                Save
              </b-button>
            </template>
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
      modalShow: false,
      files: [],
      form: {
        farmerId: this.farmerId,
        farmId: this.farmId,
        wet_weight: null,
        dry_weight: null,
        photo_1: null,
        photo_2: null,
        photo_3: null

      },
      createErrors: {
        dry_weight: null,
        wet_weight: null,
        general: null
      }
    }
  },
  components: {
  },
  methods: {
    ...mapActions({
      fetchHarvests: 'harvests/fetchHarvests',
      fetchFarm: 'harvests/fetchFarm',
      addHarvest: 'harvests/addHarvest',
      deleteHarvest: 'harvests/deleteHarvest',
    }),
    submitHarvest () {
      let errors = false

      this.createErrors.dry_weight= null
      this.createErrors.wet_weight= null
      this.createErrors.general= null

      if (!this.form.dry_weight){
        errors = true
        this.createErrors.dry_weight = "Dry weight cannot be blank"
      }
      if (!this.form.wet_weight){
        errors = true
        this.createErrors.wet_weight = "Wet weight cannot be blank"
      }
      if (this.form.wet_weight && this.form.dry_weight){
         if (this.form.wet_weight <= this.form.dry_weight){
        errors = true
        this.createErrors.dry_weight = "Dry weight cannot be greater than wet weight"
      }
      }
      if (this.files.length !== 3){
        errors = true
        this.createErrors.general = "Select 3 images!"
      }

      let maximum_size = 10485760
      if (this.files.length === 3){
        if (this.files[0].size > maximum_size || this.files[1].size > maximum_size || this.files[2].size > maximum_size){
          errors = true
          this.createErrors.general = "Files should not exceed 10 MB!"
        }
      }

      if (!errors){
        let formData = new FormData();

        formData.append('photo_1', this.form.photo_1);
        formData.append('photo_2', this.form.photo_2);
        formData.append('photo_3', this.form.photo_3);
        formData.append('wet_weight', this.form.wet_weight);
        formData.append('dry_weight', this.form.dry_weight);

        

        this.addHarvest({farmId: this.farmId, farmerId: this.farmerId, data: formData}).then(() => {
          this.hideModal()
        })
        .catch(error => {
          console.log('>>>>', error)
          this.createErrors.general = 'something went wrong'
        })
      }
    },
    hideModal() {
      this.form.wet_weight = null
      this.form.dry_weight = null
      this.form.photo_1 = null
      this.form.photo_2 = null
      this.form.photo_3 = null
      this.modalShow = false
    },
    handleFileUpload(){
      let maximum_size = 10485760
      this.files = this.$refs.file.files
      if (this.files.length !== 3){
        alert("Select 3 images!")
      }

      if (this.files[0].size > maximum_size || this.files[1].size > maximum_size || this.files[2].size > maximum_size){
        alert("Files should not exceed 10 MB!")
        this.value = ""
      }
      this.form.photo_1 = this.files[0]
      this.form.photo_2 = this.files[1]
      this.form.photo_3 = this.files[2]
    }
  },
  computed: {
    ...mapGetters({
      harvests: 'harvests/allHarvests',
      farm: 'harvests/farm'
    })
  },
  created() {
    this.fetchHarvests({farmerId: this.farmerId, farmId: this.farmId})
    this.fetchFarm({farmerId: this.farmerId, farmId: this.farmId})
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
    .button-container {
        display: flex;
        justify-content: flex-end;

        .table-button {
          align-self: right;
        }
      }
  }
}
.harvest-image {
  height: 150px;
  width: 150px;
}
</style>
