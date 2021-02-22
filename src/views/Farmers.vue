<template>
  <div class="farmer container">
    <h3 class="text-primary"> Farmers </h3>
    <div class="card table-card">
      <div class="card-body">
        <div class="button-container  mb-2">  <b-button v-b-modal.modal-add-farmer size="sm" variant="primary" class="table-button">Add Farmer</b-button> </div>
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
              <td><a href="">edit</a> | <a  @click="deleteFarmer(farmer.id)">delete</a></td>
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
          <b-modal id="modal-add-farmer" centered title="Add Farmer" ok-only ok-variant="primary" ok-title="Add">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name" placeholder="name" v-model="form.name">
            </div>
            <div class="form-group">
              <label for="name">Id Number</label>
              <input type="text" class="form-control" id="id-number" placeholder="id number" v-model="form.id_number">
            </div>
            <GmapMap
              :center="center"
              :zoom="5"
              map-style-id="roadmap"
              :options="mapOptions"
              style="width: 48vmin; height: 40vmin"
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

            <p>Selected Position: {{ marker.position }}</p>
            <span>Selected address: {{form.location.address}}</span>
            <template #modal-footer="{}">
              <b-button  variant="primary" @click="submitFarmer()">
                SAve
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
  name: 'Farmer',
  data (){
    return {
      moment: moment,
      message: '',
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
      }
    }
  },
  components: {
  },
  methods: {
    ...mapActions({
      fetchFarmers: 'farmers/fetchFarmers',
      deleteFarmer: 'farmers/deleteFarmer',
      addFarmer: 'farmers/addFarmer'
    }),
    submitFarmer() {
      this.addFarmer(this.form)
        .then(data => {
          this.message = data.message
        })
        .catch(error => {
          console.log('>>>>', error)
        })
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
    this.fetchFarmers()
  },
   mounted() {
    this.geocode(this.marker.position)
    this.geolocate();
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
