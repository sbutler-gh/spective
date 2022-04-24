<script>
  import { mapboxToken } from '$lib/conf.js'
  import { Map, Geocoder, Marker, controls } from '$lib/components.js'
  import Content from './Content.svelte';
import { inputs_store } from '$lib/stores';
import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import { get } from 'svelte/store';
import { variables } from '$lib/variables';

  let prompt = "Imagine a place in your community.  A place that hasn't changed in a very long time.  You're going there to take a picture.  Once you arrive, you drop your camera — you reach down for it, and when you stand back up, you are 50 years in the future.  What do you see?  How has this place changed?"

  const { GeolocateControl, NavigationControl } = controls
  const place = null

  let content;


  let center;
  let marker;
  let zoom = 12;
  let mapComponent;

  // create_mode is used to control the status of the page in the add_content workflow.  It isn't a boolean, rather, it is changed to things like "select_location" and "input_content" and "success" to correspond different stages in that workflow.
  let create_mode = false;

  // when a user is adding content to the map, and selecting a location to add content, selected_location stores the lat/lng of the user's selection.  this is used to render a marker at the user's selection as they choose, and to submit the selected_location when the content is submitted to the backend.
  let selected_location;

  // This is used to destroy and refresh the <Content > component when new content is available, so the map source and layers are redrawn with the updated/new data.
  let unique = {}

  // On page load
  onMount(async() => {

    // We geolocate the user's IP address, to initialize the map settings near where they are and center the map on a familiar place.
    ipToCoordinates();

  })

  // We take the user's IP, get coordinates from it (an approximate location — usually the data center nearest them), and update the map location to those coordinates.
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
    
    let coordinates = json.loc.split(',');
    coordinates = {"lat": coordinates[0], "lng": coordinates[1]};
    center = coordinates;
    mapComponent.setCenter({lng: center.lng, lat: center.lat})
    marker = center;
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

  // When a user clicks "Add Content" (or "Cancel"), this function controls the toggle.
  function toggleAddContent() {

    // We have a slight delay because there are other functions that rely on create_mode, and if we update it too quickly, it results in unexpected behavior.  So we need to update create_mode to what's appropriate after a slight delay.
    setTimeout(function() {
    if (create_mode == false) {
      
      // If create_mode is currently false, we'll update it to the next step in the add content workflow — when a user should select a location.
      create_mode = "select_location";

      // When the user is selecting a location, we'll update the cursor to be a crosshair, to help communicate they should be selecting a place.
      // mapboxgl-canvas-container ends up being the best (and only working) option to update this.  Trying cursor css settings on other map divs, the cursor doesn't actually appear to be different.
      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: crosshair! important;";
    }

    // If create_mode isn't currently false, so the user is currently somewhere in the add content workflow, and we get to this conditional — it's because they clicked "Cancel"
    else {
      
      // So we reset create_mode to false
      create_mode = false;

      // And we reset the selected_location, so when the user attempts to add content again, it will start fresh (instead of re-using the location from before they cancelled)
      selected_location = null;

      // And we'll change the cursor back to the default grab.
      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: grab";

    }}, 50)
  }

  function clickLocation(e) {
    console.log('test');
    console.log(e);
  }

  // When create_mode is "select_location" (e.g. cursor is crosshair) and the user clicks on the map, thereby selecting a location for their content, this function is called.
  // Actually, this function is called anytime the user clicks on the map, because I don't think you can control when a click on the Mapbox component does/doesn't result in a function.
  // So we handle that discrepancy inside the function.
  function selectLocation( { detail }) {

    // If create_mode is false, that means the user is just browsing the map and is not adding content.  In that case, we don't want to add a marker or update the center or anything when they click.
    // So we'll only run this function if create_mode is anything but false.  This likewise means, that if a user has selected a location already in the add content workflow and are entering the content, they are still able to click around on the map and update the location.  This seems like a user-friendly behavior from testing.
    if (create_mode != false) {

      // Sometimes a click registers twice in svelte — meaning, the first click will give us (detail), and the second click will give us undefined.
      // If we tried doing the following when the click was undefined, it wouldn't work
      // So we specify to only get the location of the user's click and update the marker on the map when we actually have that information from the click (e.g. the first click, not the second undefined one that registers)
      if (detail.lat) {
      console.log(detail);
      console.log(detail.lat);
      selected_location = detail;
      console.log(selected_location);
      
      // If the map is somewhat zoomed out when the user clicks, we will zoom in on their click.
      // This is a bit jarring once you're already zoomed in close on the map, so we only have the behavior when the current zoom level is less than 16.
      if (zoom < 16) {
        mapComponent.setCenter({lng: selected_location.lng, lat: selected_location.lat});
        zoom = 16;
      }

      // Finally, if create_mode is not yet in the "input_content" stage yet (when the user has the content text area form available), we will update it to that stage.
      create_mode != "input_content" ? create_mode = "input_content" : null;
      }
    }
  }

  // When the user submits their content, this function pushes it to the backend and renders the updated data on the map.
  async function submitContent(e) {

    // Getting the data from the form submission, which is only the "content" textarea right now.
    var formData = new FormData(e.target);

    // Adding the location data to the submission.
    formData.append('lng', selected_location.lng);
    formData.append('lat', selected_location.lat);
    formData.append('lng_lat', JSON.stringify(selected_location.lng, selected_location.lat));


    // Sending all of this to the publish_location endpoint
  const response = await fetch('/publish_location', {
  method: 'post',
  body: formData
  })

  if (response.ok) {

    let response_json = await response.json();

      // We format all of the content as Geojson feature points.
      // So we take the structure of a geojson feature, and insert the id, content, and lat/lng from the data into the feature.
      let new_input =  { "type": "Feature", "properties": { "id": response_json[0].id, "content": response_json[0].content }, "geometry": { "type": "Point", "coordinates": [ response_json[0].lng, response_json[0].lat, 0.0 ] } }
      
      // We get the current state of the map data
      let inputs_array = $inputs_store;
      
      // We add the new piece of content, the user submission that we just submitted to the backend, to the array of map data
      inputs_array.push(new_input);

      // And now we set the current state of the map data to inputs_array, which includes the new submission from the line above
      $inputs_store = inputs_array;

      // The map data is drawn in the Content.svelte component.  But the map data is already drawn, so simply updating $inputs_store (which is the basis for the map data) doesn't do enough — because the drawing hasn't updated.
      // So we need to destroy the <Content> component, and refresh it.
      // That way, when <Content> is called again, the map data will be redrawn with the updated data.
      unique = {};

      // After all this, we update create_mode to success to display a success message.
      create_mode = "success";

      // And we return the map to its default settings, including setting the cursor to grab
      document.getElementsByClassName('mapboxgl-canvas-container')[0].style = "cursor: grab";
      // And resetting selected_location (so the next time user wants to add content, it won't automatically select the same point from this submission)
      selected_location = null;

      // And after several seconds, enough time for the user to see the success message, we'll reset create_mode to false, as the content has been added and the workflow is complete.
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

<!-- This script runs first, as soon as the page is loaded, before anything in the script tag above -->
<!-- The very first thing we do is load data from the backend, so we can populate the map with it -->
<script context="module">

  export const load = async ({ fetch }) => {

    // We get the data via the load_sites endpoint
    const res = await fetch('/load_sites',{
      method: 'get'
    });

		if (res.ok) {
      console.log('okay');
      
			const sites = await res.json();

      let inputs_array = [];

      // For each item of data from the backend
      for (var i=0; i < sites.table.length; i++) {

        // We convert it into geojson feature format
        let new_input =  { "type": "Feature", "properties": { "id": sites.table[i].id, "content": sites.table[i].content}, "geometry": { "type": "Point", "coordinates": [ sites.table[i].lng, sites.table[i].lat, 0.0 ] } }

        // And push it to the array
        inputs_array.push(new_input);
      }

      // And we set the inputs_store to the inputs_array, filled with data from the backend
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
                <Content />
              {/key}

                <!-- <NavigationControl /> -->
                <!-- <GeolocateControl on:geolocate={e => console.log('geolocated', e.detail)} /> -->
                <!-- <Marker lat={marker.lat} lng={marker.lng} /> -->
                {#if create_mode != "success"}
                <button id="add_content_button" style="position: absolute; bottom: 42%; margin: auto; left: 0; display: block; left: 50%;
                -webkit-transform: translateX(-50%);
                -moz-transform: translateX(-50%);
                transform: translateX(-50%);" on:click|preventDefault={toggleAddContent} type="button">
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

  /* For responsive formatting, this covers screens wider than mobile */
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