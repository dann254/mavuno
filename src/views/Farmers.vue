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
              <td> <a class="text-warning action-clk" @click="$bvModal.show(`modal-edit-farmer-${farmer.id}`)">edit</a> | <a class="text-danger action-clk" @click="$bvModal.show(`modal-delete-farmer-${farmer.id}`)">delete</a></td>
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

            <b-modal :id="'modal-edit-farmer-'+ farmer.id" centered title="Edit Farmer" ok-only ok-variant="primary" ok-title="Add">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" placeholder="name" v-model="editForm[(farmer.id).toString()].name">
                <div class="text-danger mb-2" v-if="updateErrors[(farmer.id).toString()].name">
                    {{updateErrors[(farmer.id).toString()].name}}
                </div>
              </div>
              <div class="form-group">
                <label for="name">Id Number</label>
                <input type="number" min="0" class="form-control" id="id-number" placeholder="id number" v-model="editForm[(farmer.id).toString()].id_number">
                <div class="text-danger mb-2" v-if="updateErrors[(farmer.id).toString()].id_number">
                    {{updateErrors[(farmer.id).toString()].id_number}}
                </div>
              </div>
              <GmapMap
                :center="center"
                :zoom="5"
                map-style-id="roadmap"
                :options="mapOptions"
                style="width: 46.5vmin; height: 40vmin"
                ref="mapRef"
                @click="handleMapClick($event, farmer.id)"
                class="map"
              >
                <GmapMarker
                  :position="editForm[(farmer.id).toString()].marker.position"
                  :clickable="true"
                  :draggable="true"
                  @drag="handleMarkerDrag($event, farmer.id)"
                  @click="panToMarker($event, farmer.id)"
                />
              </GmapMap>
              <button class="btn btn-sm btn-secondary mt-2" @click="geolocate(farmer.id)">Detect Location</button>

              <div>Selected Latitude: {{ marker.position.lat }}</div>
              <div>Selected Longitude: {{ marker.position.lng }}</div>
              <span>Selected address: {{form.location.address}}</span>
              <div class="text-danger mb-2 mt-2" v-if="updateErrors[(farmer.id).toString()].general">
                    {{updateErrors[(farmer.id).toString()].general}}
                </div>
              
              <input type="hidden" id="custId" name="custId" v-model="watcher_field">

              <template #modal-footer="{}">
                <Loader v-if="updatingFarmer"/>
                <b-button  variant="primary" :disabled="updatingFarmer" @click="editFarmer(farmer.id)">
                  Update
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
      watcher_field : 0,
      updatingFarmer: false,
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
      editForm: {

      },
      createErrors: {
        name: null,
        id_number: null,
        general: null,
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
      fetchFarmers: 'farmers/fetchFarmers',
      deleteFarmer: 'farmers/deleteFarmer',
      updateFarmer: 'farmers/updateFarmer',
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
          errors = true
          this.createErrors.id_number = "Farmer with that ID number already exists"
        }
      }

      if (!errors){
        this.savingFarmer = true
        this.addFarmer(this.form)
        .then(() => {
          this.savingFarmer = false
          this.hideModal()
          console.log(this.farmers)
        })
        .catch(error => {
          this.savingFarmer = false
          console.log('>>>>', error)
          this.createErrors.general = 'something went wrong'
        })
      }
    },
    editFarmer(id) {
      let errors = false

      this.updateErrors[(id).toString()] = {
        name : null,
        id_number: null,
        general: null
      }

      if (!this.editForm[(id).toString()].name){
        errors = true
        this.updateErrors[(id).toString()].name = "name cannot be blank"
      }
      if (!this.editForm[(id).toString()].id_number){
        errors = true
        this.updateErrors[(id).toString()].id_number = "Id number cannot be blank"
      }
      if (this.farmers){
        let index = this.farmers.findIndex(ele => ele.id_number == this.editForm[(id).toString()].id_number  && ele.id_number != this.editForm[(id).toString()].id_number_temp);

        if (index !== -1){
          errors = true
          this.updateErrors[(id).toString()].id_number = "Farmer with that ID number already exists"
        }
      }
      this.watcher_field ++
      if (!errors){
        this.updatingFarmer = true
        this.updateFarmer({farmerId: id, data:this.editForm[(id).toString()]})
        .then(() => {
          this.updatingFarmer = false
          this.$bvModal.hide('modal-edit-farmer-'+ id)
        })
        .catch(error => {
          this.watcher_field ++
          this.updatingFarmer = false
          console.log('>>>>', error)
          this.updateErrors[(id).toString()].general = 'something went wrong'
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
    geolocate(id = null) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (id){
          this.editForm[(id).toString()].marker.position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } else {
          this.editForm[(id).toString()].marker.position = {
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
        this.$refs.mapRef.setZoom(18);
      } else {
        this.$refs.mapRef.panTo(this.marker.position);
        this.$refs.mapRef.setZoom(18);
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
    },
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
        for (let farmer of this.farmers) {
            farmer.marker = { position: { lat: farmer.location.point.coordinates[0], lng: farmer.location.point.coordinates[1] } }
            farmer.id_number_temp= farmer.id_number
            farmer.location.location_metadata = {}
            this.editForm[(farmer.id).toString()] = farmer
            this.updateErrors[(farmer.id).toString()] = {
              name : null,
              id_number: null,
              general: null
            }
        }
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
  beforeUpdate() {
    if (this.farmers) {
      for (let farmer of this.farmers) {
          farmer.marker = { position: { lat: farmer.location.point.coordinates[0], lng: farmer.location.point.coordinates[1] } }
          farmer.id_number_temp= farmer.id_number
          farmer.location.location_metadata = {}
          this.editForm[(farmer.id).toString()] = farmer
          this.updateErrors[(farmer.id).toString()] = {
            name : null,
            id_number: null,
            general: null
          }
      }
    }
  }
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
