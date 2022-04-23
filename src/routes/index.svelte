<script>
  import { mapboxToken } from '$lib/conf.js'
  import { Map, Geocoder, Marker, controls } from '$lib/components.js'
  import Earthquakes from './Earthquakes.svelte';
import { inputs_store } from '$lib/stores';
import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import { get } from 'svelte/store';

  export let sites;

  let earthquakes = true;

  const { GeolocateControl, NavigationControl } = controls
  const place = null

  let page = 'about'
  let center = { lat: 38.88, lng: -77.1318825263977 }
  let marker = center
  let zoom = 14
  let mapComponent;

  let unique = {}

  onMount(async() => {

    console.log(sites);

  })

  function addSites() {

    let new_input =  { "type": "Feature", "properties": { "id": Math.floor(Date.now() / 1000), "mag": 4.1, "time": 1507411448780, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [ -77.1318825263977, 38.88, 0.0 ] } }
    
    let inputs_array = $inputs_store;

    console.log(inputs_array);
    
    inputs_array.push(new_input);

    console.log(inputs_array);

    $inputs_store = inputs_array;

    unique = {};

    // mapComponent.getSource('earthquakes');
  }

async function publishSite(e) {

console.log(e.detail);
var formData = new FormData();

// formData.append('name', e.detail.name);
// formData.append('impact', e.detail.impact);
formData.append('perspective', Math.floor(Date.now() / 1000));
formData.append('lng', center.lng);
formData.append('lat', center.lat);
formData.append('lng_lat', JSON.stringify(center.lng, center.lat));


console.log(formData);

const response = await fetch('/publish_location', {
method: 'post',
body: formData
})

if (response.ok) {

let response_json = await response.json();

    let new_input =  { "type": "Feature", "properties": { "id": response_json[0].id, "mag": 4.1, "time": 1507411448780, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [ response_json[0].lng, response_json[0].lat, 0.0 ] } }
    
    let inputs_array = $inputs_store;

    console.log(inputs_array);
    
    inputs_array.push(new_input);

    console.log(inputs_array);

    $inputs_store = inputs_array;

    unique = {};

// console.log(response_json);
// console.log(response_json[0].id);

// console.log('test a');
// console.log('test a');
// sites.push(response_json[0]);
// sites = sites;

// // display_notification = true;
// // menu_display = "plant";
// display_my_location = false;
}
else {
let response_json = await response.json();
console.log(response_json);
console.log(response_json.status);
console.log(response.body);
}

}

  function navigate (next) {
    page = next
  }

  function placeChanged (e) {
    const { result } = e.detail
    mapComponent.setCenter(result.center, 14)
  }
  
  function randomLng () {
    return 77 + (Math.random() - 0.5) * 30
  }

  function randomLat () {
    return 13 + (Math.random() - 0.5) * 30
  }

  function flyToRandomPlace () {
    mapComponent.flyTo({
      center: [
        randomLng(),
        randomLat()
      ],
      essential: true
    })
  }

  function recentre ({ detail }) {
    center = detail.center
  }

  function drag ({ detail }) {
    marker = detail.center
  }
</script>

<script context="module">

  let sites;

  export const load = async ({ fetch }) => {

    const res = await fetch('/load_sites',{
      method: 'get'
    });

		if (res.ok) {
      console.log('okay');
      
			const sites = await res.json();

      let inputs_array = get(inputs_store);

      for (var i=0; i < sites.table.length; i++) {

        let new_input =  { "type": "Feature", "properties": { "id": sites.table[i].id, "mag": 4.1, "time": 1507411448780, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [ sites.table[i].lng, sites.table[i].lat, 0.0 ] } }

        inputs_array.push(new_input);
      }

      // console.log(inputs_array);

      inputs_store.set(inputs_array);

			return {
				props: { 
          sites: sites.table
        }
			};
		}

    else {
      console.log(res);
    }

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
  
</script>
          <!-- <div class="section-txt" id="geocoder">
            <form>
            <Geocoder value="(Near London)" accessToken={mapboxToken} on:result={placeChanged} on:clear={() => mapComponent.setCenter({ lng: 0, lat: 0 })} />
            {#if place}
              <dl>
                <dt>Name:</dt>
                <dd>{place.label}</dd>
                <dt>Geolocation:</dt>
                <dd>lat: {place.geometry.lat}, lng: {place.geometry.lng}</dd>
              </dl>
            {/if}
            </form>
          </div> -->
          <div class="section-txt" id="map">
            <button on:click={publishSite}>Publish Site</button>
            <div class="map-wrap">
              <Map
                bind:this={mapComponent}
                accessToken={mapboxToken}
                on:recentre={recentre}
                on:drag={drag}
                {center}
                bind:zoom
              >
              {#key unique}
                <Earthquakes />
              {/key}

                <NavigationControl />
                <GeolocateControl on:geolocate={e => console.log('geolocated', e.detail)} />
                <Marker lat={marker.lat} lng={marker.lng} />
              </Map>
            </div>
            <!-- {#if center}
              <dt>Geolocation:</dt>
              <dd>lat: {center.lat}, lng: {center.lng}</dd>
              <dd>zoom: {zoom}</dd>
            {/if} -->
          </div>

<style>
  :global(#logo svg) {
    fill: white;
    height: 60px;
  }

  .slogan {
    margin-top: 14px;
  }

  .map-wrap {
    width: 100%;
    height: 100vh;
    /* height: 300px; */
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
  }

  #fly-to,
  #change-zoom {
    display: block;
    position: relative;
    margin: 0px auto;
    height: 40px;
    padding: 10px;
    border: none;
    border-radius: 3px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    background: #ee8a65;
  }

</style>