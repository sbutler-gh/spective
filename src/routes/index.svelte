<script>
  import { mapboxToken } from '$lib/conf.js'
  import { Map, Geocoder, Marker, controls } from '$lib/components.js'
  import Earthquakes from './Earthquakes.svelte';
import { inputs_store } from '$lib/stores';
import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import { get } from 'svelte/store';
import { variables } from '$lib/variables';

  export let sites;

  let earthquakes = true;

  let prompt = "Imagine a place in your community.  A place that hasn't changed in a very long time.  You're going there to take a picture.  Once you arrive, you drop your camera — you reach down for it, and when you stand back up, you are 50 years in the future.  What do you see?  How has this place changed?"

  const { GeolocateControl, NavigationControl } = controls
  const place = null

  // let perspective;
  let content;

  let page = 'about'
  // let center = { lat: 38.88, lng: -77.1318825263977 }
  // let marker = center
  let center;
  let marker;
  let zoom = 12;
  let mapComponent;

  let create_mode = false;
  // let create_mode = "input_content";
  let create_step;
  let selected_location;

  let unique = {}

  onMount(async() => {

    console.log(sites);
    ipToCoordinates();

  })

  async function ipToCoordinates() {
    
    const ip = await fetch("https://serene-journey-42564.herokuapp.com/https://api.ipify.org?format=json&callback=getIP");
    
    const ip_json = await ip.json();
    console.log(ip_json);
    
    const request = await fetch(`https://serene-journey-42564.herokuapp.com/ipinfo.io/${ip_json["ip"]}/geo?token=${variables.ipInfo}`, {
        method: 'GET',
        "Content-Type": "application/json",
        "charset": "utf-8",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "X-Requested-With": "XMLHttpRequest"   
    });
    
    const json = await request.json()
    
    console.log(json);
    
    // address = `${json.city}, ${json.region}, ${json.country}, ${json.postal}`;
    // city = json.city;
    // region = json.region;
    // postal = json.postal;
    // country = json.country;
    let coordinates = json.loc.split(',');
    coordinates = {"lat": coordinates[0], "lng": coordinates[1]};
    center = coordinates;
    mapComponent.setCenter({lng: center.lng, lat: center.lat})
    marker = center;
    // Seattle coordinates for testing
    // coordinates = {"lat": 47.6083, "lng": -122.335167};
    //         coordinates = {
    //     "lat": 37.7790262,
    //     "lng": -122.419906
    // }
    }

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

    // create_mode = "success";

    // selected_location = null;

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

create_mode = "error";
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

  function toggleAddPerspective() {
    // (create_mode == false) ? create_mode = true : create_mode = false;

    setTimeout(function() {
    if (create_mode == false) {
      create_mode = "select_location";
      // console.log(document.getElementsByClassName('mapboxgl-canvas-container')[0]);
      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: crosshair! important;";

      // document.getElementsByClassName('map-wrap')[0].addEventListener('click', clickLocation)
    }
    else {
      create_mode = false;
      selected_location = null;
      // console.log(document.getElementsByClassName('mapboxgl-canvas-container')[0]);
      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: grab";

      // document.getElementsByClassName('map-wrap')[0].removeEventListener('click', clickLocation);
    }}, 50)
  }

  function clickLocation(e) {
    console.log('test');
    console.log(e);
  }

  function selectLocation( { detail }) {
    if (create_mode != false) {

      if (detail.lat) {
      console.log(detail);
      console.log(detail.lat);
      selected_location = detail;
      console.log(selected_location);
      
      if (zoom < 16) {
        mapComponent.setCenter({lng: selected_location.lng, lat: selected_location.lat});
        zoom = 16;
      }

      create_mode != "input_content" ? create_mode = "input_content" : null;
      }
    }
  }

  async function submitContent(e) {
    // let formData = new formData(e.target);

    var formData = new FormData(e.target);

    formData.append('lng', selected_location.lng);
    formData.append('lat', selected_location.lat);
    formData.append('lng_lat', JSON.stringify(selected_location.lng, selected_location.lat));


  const response = await fetch('/publish_location', {
  method: 'post',
  body: formData
  })

  if (response.ok) {

  let response_json = await response.json();

      let new_input =  { "type": "Feature", "properties": { "id": response_json[0].id, "content": response_json[0].content, "mag": 4.1, "time": 1507411448780, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [ response_json[0].lng, response_json[0].lat, 0.0 ] } }
      
      let inputs_array = $inputs_store;

      console.log(inputs_array);
      
      inputs_array.push(new_input);

      console.log(inputs_array);

      $inputs_store = inputs_array;

      unique = {};

      create_mode = "success";

      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: grab";

      selected_location = null;

      setTimeout(function() {
        create_mode = false;
      }, 3000)
  }

  else {
  let response_json = await response.json();
  console.log(response_json);
  console.log(response_json.status);
  console.log(response.body);

  create_mode = "error";

  document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: grab";

  setTimeout(function() {
        create_mode = false;
      }, 10000)
  }

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

        let new_input =  { "type": "Feature", "properties": { "id": sites.table[i].id, "content": sites.table[i].content, "mag": 4.1, "time": 1507411448780, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [ sites.table[i].lng, sites.table[i].lat, 0.0 ] } }

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
            <!-- <button on:click={publishSite}>Publish Site</button> -->
            <div style="position: default; z-index: 100; top: 0; margin: auto; background: black; color: white; padding: 20px; text-align: center;">
            <div style="background: black; color: white;">
              <p id="prompt" style="max-width: 600px; margin: auto;">{prompt}</p>
              <!-- <button>+ Add New</button> -->
            </div>
            </div>
            {#if create_mode != false}
            <div style="position: absolute; z-index: 100; top: 5; width: 100%; background: white; color: black; text-align: center;">
              {#if create_mode == "select_location"}
              <p>Select a location</p>
                <!-- {#if selected_location}
                <button style="margin-bottom: 5px;" on:click|preventDefault={function() { create_mode = "input_data"}}>Next</button>
                {/if} -->
              {:else if create_mode == "input_content"}
              <form id="content_form" on:submit|preventDefault={submitContent} style="padding: 10px; max-width: 600px; margin: auto;">
                <!-- <label for="perspective" style="text-align: left;">Share your response</label> -->
                <textarea id="content_textarea" bind:value={content} style="width: 100%; height: 50px;" name="content"></textarea>
                {#if content}
                <button style="margin-left: auto; display: block;">Submit</button>
                {:else}
                <button style="margin-left: auto; display: block;" disabled=disabled>Submit</button>
                {/if}
              </form>
              {:else if create_mode == "success"}
              <h4 style="color:darkgreen">Success!</h4>
              {:else if create_mode == "error"}
              <h4 style="color:darkred">Problem submitting, please try again or contact spect@sambutler.us</h4>
              {/if}
            </div>
            {/if}
            <div class="map-wrap">
              <Map
                bind:this={mapComponent}
                accessToken={mapboxToken}
                on:recentre={recentre}
                on:drag={drag}
                on:click={selectLocation}
                {center}
                bind:zoom
              >
              {#if create_mode && selected_location}
              <Marker lat={selected_location.lat} lng={selected_location.lng}></Marker>
              {/if}
              {#key unique}
                <Earthquakes />
              {/key}

                <!-- <NavigationControl /> -->
                <!-- <GeolocateControl on:geolocate={e => console.log('geolocated', e.detail)} /> -->
                <!-- <Marker lat={marker.lat} lng={marker.lng} /> -->
                {#if create_mode != "success"}
                <button id="add_content_button" style="position: absolute; bottom: 42%; margin: auto; left: 0; display: block; left: 50%;
                -webkit-transform: translateX(-50%);
                -moz-transform: translateX(-50%);
                transform: translateX(-50%);" on:click|preventDefault={toggleAddPerspective} type="button">
                {#if create_mode == false}
                + Add Perspective
                {:else}
                x Cancel
                {/if}
              </button>
                {/if}
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

  @media only screen and (min-width: 601px) {
  #content_textarea {
    height: 100px !important;
  }

  #prompt {
    max-width: 600px;
    line-height: 22px;
    /* text-align: left !important; */
  }

  #add_content_button {
    bottom: 20% !important;
  }
}

</style>