<script>
  import "../app.css";
  import { user_store, points_prompt_store, points_store, prompts_store, current_prompt_store, map_center_store } from '$lib/stores';
  import { mapboxToken } from '$lib/conf.js'
  import { Map, Geocoder, Marker, controls } from '$lib/components.js'
  import Content from './Content.svelte';
import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import { get } from 'svelte/store';
import { variables } from '$lib/variables';

  export let points;

  let center;


    // On page load
    onMount(async() => {

  // We geolocate the user's IP address, to initialize the map settings near where they are and center the map on a familiar place.
    ipToCoordinates()
    .then(async() => {
            fetchPrompts()
            .then(async() => {
              updatePointsForNewPrompt();
            })
    })
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
    $map_center_store = center;

    }

async function fetchPrompts() {

const response = await fetch('/fetch_prompts',{
  method: 'get'
});

if (response.ok) {

let prompts = await response.json();

console.log(prompts);
console.log(prompts.table);

prompts_store.set(prompts.table);

$current_prompt_store = $prompts_store[0];

}

else {
let response_json = await response.json();
console.log(response_json);
console.log(response_json.status);
console.log(response.body);
}
}

export function updatePointsForNewPrompt() {

  let points_prompt_array = $points_store.filter(point => point.prompt_id == $current_prompt_store.id);

  let points_prompt_store_array = [];

  // For each item of data from the backend
  for (var i=0; i < points_prompt_array.length; i++) {

  // We convert it into geojson feature format
  let new_point =  { "type": "Feature", "properties": { "id": points_prompt_array[i].id, "content": points_prompt_array[i].content, "prompt_id": points_prompt_array[i].prompt_id }, "geometry": { "type": "Point", "coordinates": [ points_prompt_array[i].lng, points_prompt_array[i].lat, 0.0 ] } }

  // And push it to the array
  points_prompt_store_array.push(new_point);
  }

  points_prompt_store.set(points_prompt_store_array);

}


</script>

{#if center?.lng}
<slot center={center}/>
{/if}

<!-- This script runs first, as soon as the page is loaded, before anything in the script tag above -->
<!-- The very first thing we do is load data from the backend, so we can populate the map with it -->
<script context="module">

  export const load = async ({ fetch }) => {

    // We get the data via the fetch_points endpoint
    const res = await fetch('/fetch_points',{
      method: 'get'
    });

		if (res.ok) {
      console.log('okay');
      
			const points = await res.json();

      let points_array = [];

      // For each item of data from the backend
      for (var i=0; i < points.table.length; i++) {

        // We convert it into geojson feature format
        let new_point =  { "type": "Feature", "properties": { "id": points.table[i].id, "content": points.table[i].content, "prompt_id": points.table[i].prompt_id }, "geometry": { "type": "Point", "coordinates": [ points.table[i].lng, points.table[i].lat, 0.0 ] } }

        // And push it to the array
        points_array.push(new_point);
      }

      // And we set the inputs_store to the inputs_array, filled with data from the backend
      points_store.set(points.table);

      // points_prompt_store.set(points_array);

			return {
				props: { 
          points: points.table
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