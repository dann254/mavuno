<template>
  <div class="farmer container">
    <h3 class="text-primary"> Farmers </h3>
    <div class="loader-container-page" v-if="loading">
      <Loader/>
    </div>
    <div class="card table-card" v-if="!loading">
      <div class="card-body">
        <div class="button-container  mb-2">  <b-button @click="modalShow = !modalShow" size="sm" variant="primary" class="table-button">Add Farmer</b-button> </div>
        <table class="table" v-if="farmers">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date Created</th>
              <th scope="col">Id number</th>
              <th scope="col">Location</th>
              <th scope="col">Farms</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="farmer in farmers" :key="farmer.id">
              <th scope="row">{{ farmer.id }}</th>
              <td>{{ farmer.name }}</td>
              <td>{{moment(farmer.created_at).format('YYYY/MM/D')}}</td>
              <td>{{ farmer.id_number }}</td>
              <td>{{ farmer.location.address }}</td>
              <td><router-link :to="{ name: 'Farms', params: { farmerId: farmer.id} }">view</router-link></td>
              <td> <a class="text-danger action-clk" @click="$bvModal.show(`modal-delete-farmer-${farmer.id}`)">delete</a></td>
            </tr>
          </tbody>
        </table>

        <div class="card card-inactive" v-else>
          <div class="card-body text-center">
            <!-- Title -->
            <h5 class="mt-0 text-muted">
              No Farmers Yet!
            </h5>
            <h6></h6>
          </div>
        </div>

        <div >
          <div v-for="farmer in farmers" :key="farmer.id">
            <b-modal :id="'modal-delete-farmer-'+ farmer.id" centered title="Delete Farmer" ok-only ok-variant="primary" ok-title="Add">
            <div>Are you sure you want to delete farmer? <br><br> {{farmer.name}}</div>
            <template #modal-footer="{}">
              <Loader v-if="deletingFarmer"/>
              <b-button  variant="danger" :disabled="deletingFarmer" @click="delFarmer(farmer.id)">
                Delete
              </b-button>
            </template>
          </b-modal>
          </div>

          <b-modal id="modal-add-farmer" v-model="modalShow" centered title="Add Farmer" ok-only ok-variant="primary" ok-title="Add">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name" placeholder="name" v-model="form.name">
              <div class="text-danger mb-2" v-if="createErrors.name">
                  {{createErrors.name}}
              </div>
            </div>
            <div class="form-group">
              <label for="name">Id Number</label>
              <input type="number" min="0" class="form-control" id="id-number" placeholder="id number" v-model="form.id_number">
              <div class="text-danger mb-2" v-if="createErrors.id_number">
                  {{createErrors.id_number}}
              </div>
            </div>
            <GmapMap
              :center="center"
              :zoom="5"
              map-style-id="roadmap"
              :options="mapOptions"
              style="width: 46.5vmin; height: 40vmin"
              ref="mapRef"
              @click="handleMapClick"
              class="map"
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
            <span>Selected address: {{form.location.address}}</span>
            <div class="text-danger mb-2 mt-2" v-if="createErrors.general">
                  {{createErrors.general}}
              </div>
            <template #modal-footer="{}">
              <Loader v-if="savingFarmer"/>
              <b-button  variant="primary" :disabled="savingFarmer" @click="submitFarmer()">
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
  name: 'Farmer',
  data (){
    return {
      loading: false,
      savingFarmer: false,
      deletingFarmer: false,
      moment: moment,
      message: '',
      modalShow: false,
      marker: { position: { lat: 0, lng: 20 } },
      center: { lat: 0, lng: 20 },

      mapOptions: {
        disableDefaultUI: true,
      },
      form: {
        name: null,
        id_number: null,
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
      createErrors: {
        name: null,
        id_number: null,
        general: null,
      }
    }
  },
  components: {
    Loader
  },
  methods: {
    ...mapActions({
      fetchFarmers: 'farmers/fetchFarmers',
      deleteFarmer: 'farmers/deleteFarmer',
      addFarmer: 'farmers/addFarmer'
    }),
    submitFarmer() {
      let errors = false

      this.createErrors.name= null
      this.createErrors.id_number= null
      this.createErrors.general= null

      if (!this.form.name){
        errors = true
        this.createErrors.name = "name cannot be blank"
      }
      if (!this.form.id_number){
        errors = true
        this.createErrors.id_number = "Id number cannot be blank"
      }
      if (this.farmers){
        let found = this.farmers.some(ele => ele.id_number == this.form.id_number);
       console.log('>>>>>>>>', found, this.farmers)

        if (found){
          this.createErrors.id_number = "Farmer with that ID number already exists"
        }
      }

      if (!errors){
        this.savingFarmer = true
        this.addFarmer(this.form)
        .then(() => {
          this.savingFarmer = false
          this.hideModal()
        })
        .catch(error => {
          this.savingFarmer = false
          console.log('>>>>', error)
          this.createErrors.general = 'something went wrong'
        })
      }
    },
    delFarmer(id) {
      this.deletingFarmer = true
        this.deleteFarmer(id)
        .then(() => {
          this.deletingFarmer = false
        })
        .catch(error => {
          this.deletingFarmer = false
          console.log('>>>>', error)
        })
    },
    hideModal() {
      this.form.name = null
      this.form.id_number = null
      this.modalShow = false
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.marker.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.geocode(this.marker.position)
        this.panToMarker();
      });
    },

    //sets the position of marker when dragged
    handleMarkerDrag(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.geocode(this.marker.position)
    },

    //Moves the map view port to marker
    panToMarker() {
      this.$refs.mapRef.panTo(this.marker.position);
      this.$refs.mapRef.setZoom(18);
    },

    //Moves the marker to click position on the map
    handleMapClick(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      this.geocode(this.marker.position)
      console.log(e);
    },
    geocode(latLngObj){
      this.$geocoder.send(latLngObj, response => { 
        console.log(response) 
        this.updateFormData(latLngObj, response.results)
      });
    },
    updateFormData(coordinates, geocode_response){
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
  },
  computed: {
    ...mapGetters({
      farmers: 'farmers/allFarmers'
    })
  },
  created() {
    this.loading = true
    this.fetchFarmers()
      .then(() => {
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    
    this.geocode(this.marker.position)
    this.geolocate();
  },
   mounted() {
    // this.geocode(this.marker.position)
    // this.geolocate();
  },
}
</script>

<style lang="scss" scoped>
.farmer {

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
