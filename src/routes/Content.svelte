<script>
  import { getContext } from 'svelte'
  import { contextKey } from '$lib/components.js'
  import MiniScroller from './MiniScroller.svelte'
  import { points_prompt_store } from "$lib/stores.js"

  const { getMap, getMapbox } = getContext(contextKey)
  const map = getMap()
  const mapbox = getMapbox()

  // Add a new source from our GeoJSON data and set the
  // 'cluster' option to true. GL-JS will add the point_count property to your source data.

  // We check to see if the mapsource has already been drawn, in which case we just want to update it via the map.getSource('content').setData() function
  // This conditional is filled once the page has already loaded, and we destroy the <Content> component to update the data, and then refresh it
  // When it refreshes, map.getSource('content') returns true and this conditional continues
  if (map.getSource('content')) {
    console.log('exists');
    let data = {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": $points_prompt_store,
    }
    map.getSource('content').setData(data);
  }

  // If the map source hasn't yet been drawn, then we do everything from scratch — this happens on initial page load
  else {

  map.addSource('content', {
    type: 'geojson',
    
    // Point to GeoJSON data. This example visualizes all points for the selected prompt
    data:  {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": $points_prompt_store,
    },
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'content',
    filter: [ 'has', 'point_count' ],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        [ 'get', 'point_count' ],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        [ 'get', 'point_count' ],
        20,
        100,
        30,
        750,
        40
      ]
    }
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'content',
    filter: [ 'has', 'point_count' ],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
      'text-size': 12
    }
  })

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'content',
    filter: [ '!', [ 'has', 'point_count' ] ],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 6,
      'circle-stroke-width': 1.5,
      'circle-stroke-color': 'black'
    }
  })

}

  map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [ 'clusters' ]
    })
    const clusterId = features[0].properties.cluster_id
    map.getSource('content').getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) { return }

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      })
    })
  })

  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = ''
  })

  map.on('click', 'unclustered-point', function (e) {
    
    console.log(map.getZoom());

    const coordinates = e.features[0].geometry.coordinates.slice()
  
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    console.log(e.features[0]);
  
    // should be centered, but need to figure out the map dimensions first
    console.log(coordinates);
    let updated_center;

    if (map.getZoom() < 13) {
    screen.width < 600 ? updated_center = [ coordinates[0], coordinates[1] - 0.025 ] : updated_center = [ coordinates[0], coordinates[1] - 0.015 ];
    }
    else if (map.getZoom() < 14) {
      screen.width < 600 ? updated_center = [ coordinates[0], coordinates[1] - 0.0075 ] : updated_center = [ coordinates[0], coordinates[1] - 0.0035 ];
      // updated_center = coordinates;
    }
    else if (map.getZoom() < 15) {
      screen.width < 600 ? updated_center = [ coordinates[0], coordinates[1] - 0.0075 ] : updated_center = [ coordinates[0], coordinates[1] - 0.0035 ];
    }
    // let updated_center = [ coordinates[0], coordinates[1] - 0.015 ]
    console.log(updated_center);
    map.setCenter(updated_center)

    // There is a bug that occurs, when you have clicked on one point and are viewing the popup.  If you click on another point, while the first popup is visible, then the popup for the other point will incorrectly display.
    // So this conditional checks to see if a popup already exists on the page, and removes it if it does, to bypass that bug.  Not sure about the behavior causing the root issue — this was simpler for now.
    if (document.getElementById('mini-scroller')) {
      console.log('present');
      document.getElementById('mini-scroller').remove();
    }

    new mapbox.Popup({})
      .setLngLat(coordinates)
      .setHTML('<div id="mini-scroller"></div>')
      .addTo(map)

    // The miniscroller component is what appears in the popup, and we instantiate it with props from the selected point (most importantly, content) so we can show the content from that point in the popup.
    new MiniScroller({ 
      target: document.getElementById('mini-scroller'), 
      props: { id:e.features[0]._vectorTileFeature.properties.id, content:e.features[0]._vectorTileFeature.properties.content } 
     }) // eslint-disable-line no-new
  })
  
  map.on('mouseenter', 'unclustered-point', function () {
    map.getCanvas().style.cursor = 'pointer'
  })
  
  map.on('mouseleave', 'unclustered-point', function () {
    map.getCanvas().style.cursor = ''
  })
</script>