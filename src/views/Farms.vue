<template>
  <div class="farm container">
    <h2 class="text-primary"> Farm </h2>
    <div class="card table-card">
      <div class="card-body">
        <div class="button-container">  <b-button v-b-modal.modal-add-farm size="sm" variant="primary" class="table-button">Add Farm</b-button> </div>
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
              <td>{{ farm.crop.name }}</td>
              <td><router-link :to="{ name: 'Harvests', params: { farmerId: farmerId, farmId: farm.id} }">view</router-link></td>
              <td><a href="">edit</a> | <a href="">delete</a></td>
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
          <b-modal id="modal-add-farm" centered title="Add Farm" ok-only ok-variant="primary" ok-title="Add">
            <div class="form-group">
              <label for="name">Size</label>
              <input type="text" class="form-control" id="size" placeholder="size" v-model="form.size">
            </div>
            <div class="form-group">
              <label for="name">Deed Number</label>
              <input type="text" class="form-control" id="deed-number" placeholder="deed number" v-model="form.deed_number">
            </div>
            <div class="form-group">
              <label for="name">Crop</label>
              <input type="text" class="form-control" id="crop" placeholder="crop" v-model="form.crop">
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
              <b-button size="sm" variant="success" @click="addFarm(form)">
                OK
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
  name: 'Farms',
  props: [
    "farmerId"
  ],
  data() {
    return {
      moment: moment,
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
      }
    }
  },
  components: {
  },
  methods: {
    ...mapActions({
      fetchFarms: 'farms/fetchFarms',
      addFarm: 'farms/addFarm'
    }),
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
      farms: 'farms/allFarms'
    })
  },
  created() {
    this.fetchFarms(this.farmerId)
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
