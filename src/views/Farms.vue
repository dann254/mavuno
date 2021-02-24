<template>
  <div class="farm container">
    <h3 class="text-primary"><span class="text-muted"> <router-link class="text-muted" :to="{ name: 'Farmers'}">Farmers > </router-link></span><span>  Farms </span></h3>
    <Loader v-if="loadingFarmer && !loading"/>
    <div v-if="farmer && !loadingFarmer">
      <h4>{{farmer.name}}</h4>

      <h6>id number: {{farmer.id_number}} <br> Location: {{farmer.location.address}}</h6>
    </div>
    <div class="loader-container-page" v-if="loading">
      <Loader/>
    </div>
    <div class="card table-card" v-if="!loading">
      <div class="card-body">
        <div class="button-container mb-2">  <b-button @click="modalShow = !modalShow" size="sm" variant="primary" class="table-button">Add Farm</b-button> </div>
        <table class="table" v-if="farms">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Size</th>
              <th scope="col">Date Created</th>
              <th scope="col">Deed number</th>
              <th scope="col">Location</th>
              <th scope="col">Crop</th>
              <th scope="col">Harvests</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="farm in farms" :key="farm.id">
              <th scope="row">{{ farm.id }}</th>
              <td>{{ farm.size }} acres</td>
              <td>{{moment(farm.created_at).format('YYYY/MM/D')}}</td>
              <td>{{ farm.deed_number }}</td>
              <td>{{ farm.location.address }}</td>
              <td>{{ farm.crop }}</td>
              <td><router-link :to="{ name: 'Harvests', params: { farmerId: farmerId, farmId: farm.id} }">view</router-link></td>
              <td> <a class="text-warning action-clk" @click="$bvModal.show(`modal-edit-farm-${farm.id}`)">edit</a> | <a class="text-danger action-clk" @click="$bvModal.show(`modal-delete-farm-${farm.id}`)">delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="card card-inactive" v-else>
          <div class="card-body text-center">
            <!-- Title -->
            <h5 class="mt-0 text-muted">
              No Farms for this farmer Yet!
            </h5>
            <h6></h6>
          </div>
        </div>

        <div >
          <div v-for="farm in farms" :key="farm.id">
            <b-modal :id="'modal-delete-farm-'+ farm.id" centered title="Delete Farm" ok-only ok-variant="primary" ok-title="Add">
              <div>Are you sure you want to delete farm? <br><br> {{farm.deed_number}}</div>
              <template #modal-footer="{}">
                <Loader v-if="deletingFarm"/>
                <b-button  variant="danger" :disabled="deletingFarm" @click="delFarm(farm.id)">
                  Delete
                </b-button>
              </template>
            </b-modal>

            <b-modal :id="'modal-edit-farm-'+ farm.id" centered title="Edit Farm" ok-only ok-variant="primary" ok-title="Update">
              <div class="form-group">
                <label for="name">Size (acres)</label>
                <input type="number" min="0" class="form-control" id="size" placeholder="size" v-model="editForm[(farm.id).toString()].size">
                <div class="text-danger mb-2" v-if="updateErrors[(farm.id).toString()].size">
                    {{updateErrors[(farm.id).toString()].size}}
                </div>
              </div>
              <div class="form-group">
                <label for="name">Deed Number</label>
                <input type="number" min="0" class="form-control" id="deed-number" placeholder="deed number" v-model="editForm[(farm.id).toString()].deed_number">
                <div class="text-danger mb-2" v-if="updateErrors[(farm.id).toString()].deed_number">
                    {{updateErrors[(farm.id).toString()].deed_number}}
                </div>
              </div>
              <div class="form-group">
                <label for="name">Crop</label>
                <input type="text" class="form-control" id="crop" placeholder="crop" v-model="editForm[(farm.id).toString()].crop">
                <div class="text-danger mb-2" v-if="updateErrors[(farm.id).toString()].crop">
                    {{updateErrors[(farm.id).toString()].crop}}
                </div>
              </div>
              <!-- <GmapMap
                :center="center"
                :zoom="5"
                map-style-id="roadmap"
                :options="mapOptions"
                style="width: 46.5vmin; height: 40vmin"
                class="map"
                ref="mapRef"
                @click="handleMapClick($event, farm.id)"
              >
                <GmapMarker
                  :position="editForm[(farm.id).toString()].marker.position"
                  :clickable="true"
                  :draggable="true"
                  @drag="handleMarkerDrag($event, farm.id)"
                  @click="panToMarker($event, farm.id)"
                />
              </GmapMap>
              <button class="btn btn-sm btn-secondary mt-2" @click="geolocate(farm.id)">Detect Location</button>

              <div>Selected Latitude: {{ editForm[(farm.id).toString()].marker.position.lat }}</div>
              <div>Selected Longitude: {{ editForm[(farm.id).toString()].marker.position.lng }}</div>
              <span class="">Selected address: {{editForm[(farm.id).toString()].location.address}}</span> -->
              <div class="text-danger mb-2 mt-2" v-if="updateErrors[(farm.id).toString()].general">
                  {{updateErrors[(farm.id).toString()].general}}
              </div>
              <input type="hidden" id="custId" name="custId" v-model="watcher_field">
              <template #modal-footer="{}">
                <Loader v-if="editingFarm"/>
                <b-button  variant="primary" :disabled="editingFarm" @click="editFarm(farm.id)">
                  Update
                </b-button>
              </template>
            </b-modal>
          </div>

          <b-modal id="modal-add-farm" v-model="modalShow" centered title="Add Farm" ok-only ok-variant="primary" ok-title="Add">
            <div class="form-group">
              <label for="name">Size (acres)</label>
              <input type="number" min="0" class="form-control" id="size" placeholder="size" v-model="form.size">
              <div class="text-danger mb-2" v-if="createErrors.size">
                  {{createErrors.size}}
              </div>
            </div>
            <div class="form-group">
              <label for="name">Deed Number</label>
              <input type="number" min="0" class="form-control" id="deed-number" placeholder="deed number" v-model="form.deed_number">
              <div class="text-danger mb-2" v-if="createErrors.deed_number">
                  {{createErrors.deed_number}}
              </div>
            </div>
            <div class="form-group">
              <label for="name">Crop</label>
              <input type="text" class="form-control" id="crop" placeholder="crop" v-model="form.crop">
              <div class="text-danger mb-2" v-if="createErrors.crop">
                  {{createErrors.crop}}
              </div>
            </div>
            <GmapMap
              :center="center"
              :zoom="5"
              map-style-id="roadmap"
              :options="mapOptions"
              style="width: 46.5vmin; height: 40vmin"
              class="map"
              ref="mapRef"
              @click="handleMapClick"
            >
              <GmapMarker
                :position="marker.position"
                :clickable="true"
                :draggable="true"
                @drag="handleMarkerDrag"
                @click="panToMarker"
              />
            </GmapMap>
            <button class="btn btn-sm btn-secondary mt-2" @click="geolocate">Detect Location</button>

            <div>Selected Latitude: {{ marker.position.lat }}</div>
            <div>Selected Longitude: {{ marker.position.lng }}</div>
            <span class="">Selected address: {{form.location.address}}</span>
            <div class="text-danger mb-2 mt-2" v-if="createErrors.general">
                {{createErrors.general}}
            </div>
            <template #modal-footer="{}">
              <Loader v-if="savingFarm"/>
              <b-button  variant="primary" :disabled="savingFarm" @click="submitFarm()">
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
import Loader from '../components/Loader.vue'


export default {
  name: 'Farms',
  props: [
    "farmerId"
  ],
  data() {
    return {
      moment: moment,
      watcher_field : 0,
      loading: false,
      loadingFarmer: false,
      deletingFarm: false,
      savingFarm: false,
      editingFarm: false,
      modalShow: false,
      marker: { position: { lat: 0, lng: 20 } },
      center: { lat: 0, lng: 20 },

      mapOptions: {
        disableDefaultUI: true,
      },
      form: {
        farmerId: this.farmerId,
        size: null,
        deed_number: null,
        crop: null,
        location: {
          point: {
            type: "Point",
            coordinates: []
          },
          address: null,
          country: null,
          administrative_area: null,
          location_metadata: {}
        }
      },
      editForm: {

      },
      createErrors: {
        size: null,
        deed_number: null,
        crop: null,
        general: null
      },
      updateErrors: {
      }
    }
  },
  components: {
    Loader
  },
  methods: {
    ...mapActions({
      fetchFarms: 'farms/fetchFarms',
      fetchFarmer: 'farms/fetchFarmer',
      deleteFarm: 'farms/deleteFarm',
      updateFarm: 'farms/updateFarm',
      addFarm: 'farms/addFarm'
    }),
    submitFarm(){
      let errors = false

      this.createErrors.size= null
      this.createErrors.deed_number= null
      this.createErrors.crop= null
      this.createErrors.general= null

      if (!this.form.size){
        errors = true
        this.createErrors.size = "size cannot be blank"
      }
      if (!this.form.deed_number){
        errors = true
        this.createErrors.deed_number = "Deed number cannot be blank"
      }
      if (!this.form.crop){
        errors = true
        this.createErrors.crop = "Crop cannot be blank"
      }
      if (this.farms){
        let found = this.farms.some(ele => ele.deed_number == this.form.deed_number);

        if (found){
          errors = true
          this.createErrors.deed_number = "Farm with that deed number already exists"
        }
      }
      if (this.farmer.location.administrative_area != this.form.location.administrative_area){
        errors = true
        this.createErrors.general= 'Farm must be within the farmer location'
      }

      if (!errors){
        this.savingFarm = true
        this.addFarm(this.form)
        .then(() => {
          this.savingFarm = false
          this.hideModal()
        })
        .catch(error => {
          console.log('>>>>', error)
          this.createErrors.general = 'something went wrong'
          this.savingFarm = false
        })
      }
    },

    editFarm(id){
      let errors = false

      this.updateErrors[(id).toString()] = {

        size: null,
        deed_number: null,
        crop: null,
        general: null
      }
      
      if (!this.editForm[(id).toString()].size){
        errors = true
        this.updateErrors[(id).toString()].size = "size cannot be blank"
      }
      if (!this.editForm[(id).toString()].deed_number){
        errors = true
        this.updateErrors[(id).toString()].deed_number = "Deed number cannot be blank"
      }
      if (!this.editForm[(id).toString()].crop){
        errors = true
        this.updateErrors[(id).toString()].crop = "Crop cannot be blank"
      }
      if (this.farms){
        let index = this.farms.findIndex(ele => ele.deed_number == this.editForm[(id).toString()].deed_number && ele.deed_number != this.editForm[(id).toString()].deed);
        console.log(index)

        if (index !== -1){
          errors = true
          this.updateErrors[(id).toString()].deed_number = "Farm with that deed number already exists"
        }
      }
      if (this.farmer.location.administrative_area != this.editForm[(id).toString()].location.administrative_area){
        errors = true
        this.updateErrors[(id).toString()].general= 'Farm must be within the farmer location'
      }

      this.watcher_field ++
      if (!errors){
        this.editingFarm = true
        this.updateFarm({farmId: id, farmerId: this.farmerId, data: this.editForm[(id).toString()]})
        .then(() => {
          this.$bvModal.hide('modal-edit-farm-'+ id)
          this.editingFarm = false
        })
        .catch(error => {
          console.log('>>>>', error)
          this.watcher_field ++
          this.updateErrors[(id).toString()].general = 'something went wrong'
          this.editingFarm = false
        })
      }
    },
    delFarm(id) {
      this.deletingFarm = true
        this.deleteFarm({farmerId: this.farmerId, farmId: id})
        .then(() => {
          this.deletingFarm = false
        })
        .catch(error => {
          this.deletingFarm = false
          console.log('>>>>', error)
        })
    },
    hideModal() {
      this.form.size = null
      this.form.deed_number = null
      this.form.crop = null
      this.modalShow = false
    },
    geolocate(e, id = null) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(e, id)
        if (id){
          this.editForm[(id).toString()].marker.position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } else {
          this.marker.position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        }
        this.geocode(this.marker.position, id)
        this.panToMarker(id);
      });
    },

    //sets the position of marker when dragged
    handleMarkerDrag(e, id=null) {
      if (id){
        this.editForm[(id).toString()].marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.geocode(this.editForm[(id).toString()].marker.position)
      } else {
        this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.geocode(this.marker.position)
      }
    },

    //Moves the map view port to marker
    panToMarker(id = null) {
      if (id){
        this.$refs.mapRef.panTo(this.editForm[(id).toString()].marker.position);
      } else {
        this.$refs.mapRef.panTo(this.marker.position);
      }
    },

    //Moves the marker to click position on the map
    handleMapClick(e, id = null) {
      if (id){
        this.editForm[(id).toString()].marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.geocode(this.editForm[(id).toString()].marker.position, id)
      } else {
        this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.geocode(this.marker.position, id)
      }
      console.log(e);
    },
    geocode(latLngObj, id){
      this.$geocoder.send(latLngObj, response => { 
        console.log(response) 
        if (id){
          this.updateFormData(latLngObj, response.results, id)
        } else {

          this.updateFormData(latLngObj, response.results)
        }
      });
    },
    updateFormData(coordinates, geocode_response, id=null){
      if (id){
        this.editForm[(id).toString()].location.point.coordinates[0] = coordinates.lng
        this.editForm[(id).toString()].location.point.coordinates[1] = coordinates.lat
        this.editForm[(id).toString()].location.location_metadata.google_maps_response = geocode_response

        country_loop:
        for (const geo of geocode_response){
          for (const address_component of geo.address_components){
            if (address_component.types.includes("country")){
              this.editForm[(id).toString()].location.country = address_component.long_name
              break country_loop;
            }
          }
        }

        adm_loop:
        for (const geo of geocode_response){
          for (const address_component of geo.address_components){
            if (address_component.types.includes("administrative_area_level_1")){
              this.editForm[(id).toString()].location.administrative_area = address_component.long_name
              this.editForm[(id).toString()].location.address = geo.formatted_address
              break adm_loop;
            }
          }
        }

      } else {

        this.form.location.point.coordinates[0] = coordinates.lng
        this.form.location.point.coordinates[1] = coordinates.lat
        this.form.location.location_metadata.google_maps_response = geocode_response

        country_loop:
        for (const geo of geocode_response){
          for (const address_component of geo.address_components){
            if (address_component.types.includes("country")){
              this.form.location.country = address_component.long_name
              break country_loop;
            }
          }
        }

        adm_loop:
        for (const geo of geocode_response){
          for (const address_component of geo.address_components){
            if (address_component.types.includes("administrative_area_level_1")){
              this.form.location.administrative_area = address_component.long_name
              this.form.location.address = geo.formatted_address
              break adm_loop;
            }
          }
        }
      }

    }
  },
  computed: {
    ...mapGetters({
      farms: 'farms/allFarms',
      farmer: 'farms/farmer'
    })
  },
  created() {
    this.loading = true
    this.fetchFarms(this.farmerId)
      .then(() => {
        for (let farm of this.farms) {
            farm.marker = { position: { lat: farm.location.point.coordinates[0], lng: farm.location.point.coordinates[1] } }
            farm.crop= farm.crop.name
            farm.deed= farm.deed_number
            farm.location.location_metadata = {}
            this.editForm[(farm.id).toString()] = farm
            this.updateErrors[(farm.id).toString()] = {
              size: null,
              deed_number: null,
              crop: null,
              general: null
            }
        }
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })

    this.loadingFarmer = true

    this.fetchFarmer(this.farmerId)
      .then(() => {
        this.loadingFarmer = false
      })
      .catch(() => {
        this.loadingFarmer = false
      })
  },
  mounted() {
    this.geocode(this.marker.position)
    if (!this.loading){
      this.geolocate();
    }
  },
  beforeUpdate() {
    if (this.farms) {
      for (let farm of this.farms) {
        farm.marker = { position: { lat: farm.location.point.coordinates[0], lng: farm.location.point.coordinates[1] } }
        farm.crop= farm.crop.name ? farm.crop.name : farm.crop
        farm.deed= farm.deed_number
        farm.location.location_metadata = {}
        this.editForm[(farm.id).toString()] = farm
        this.updateErrors[(farm.id).toString()] = {
          size: null,
          deed_number: null,
          crop: null,
          general: null
        }
    }
    }
  }
}
</script>

<style lang="scss" scoped>
.farm {

  .table-card{
    border: 1px;
    border-style: solid;
    border-color: $_border_color !important;
    box-shadow: 0 0.75rem 1.5rem rgba(18,38,63,.1);

    .card-body {
      .table > thead th {
          border-top: none;
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
}
</style>
