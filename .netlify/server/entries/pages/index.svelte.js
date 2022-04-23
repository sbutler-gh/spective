import { n as noop, a as safe_not_equal, c as create_ssr_component, b as createEventDispatcher, s as setContext, o as onDestroy, g as getContext, d as add_attribute, e as escape, f as subscribe, h as get_store_value, v as validate_component } from "../../chunks/index-752377b9.js";
const mapboxToken = "pk.eyJ1IjoibGV0b3VycG93ZXJzY29tYmluZSIsImEiOiJjazFmN3N0eTUwb3JwM2JwYWk4ZXB1enNtIn0._UjpOqZIeiWqhscosubipw";
const contextKey = {};
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
class EventQueue {
  constructor() {
    this.queue = writable([]);
    this.unsubscribe = null;
    this.started = false;
  }
  send(command, params = []) {
    if (!command) {
      return;
    }
    this.queue.update((q) => [...q, [command, params]]);
  }
  start(map) {
    this.unsubscribe = this.queue.subscribe((queue) => {
      while (queue.length) {
        const [command, params] = queue.shift();
        map[command].apply(map, params);
      }
    });
    this.started = true;
  }
  stop() {
    if (!this.started) {
      return;
    }
    this.unsubscribe();
    this.queue = writable([]);
    this.started = false;
  }
}
var Map_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "div.svelte-1kuj9kb{width:100%;height:100%}",
  map: null
};
const Map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { map = null } = $$props;
  let { version = "v2.3.1" } = $$props;
  let { center = [0, 0] } = $$props;
  let { zoom = 9 } = $$props;
  let { zoomRate = 1 } = $$props;
  let { wheelZoomRate = 1 } = $$props;
  let { options = {} } = $$props;
  let { accessToken } = $$props;
  let { customStylesheetUrl = false } = $$props;
  let { style = "mapbox://styles/mapbox/streets-v11" } = $$props;
  createEventDispatcher();
  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapbox
  });
  let container;
  let mapbox;
  Object.assign({
    accessToken,
    container,
    style,
    center,
    zoom,
    zoomRate,
    wheelZoomRate,
    version,
    customStylesheetUrl,
    map
  }, options);
  const queue = new EventQueue();
  onDestroy(() => {
    queue.stop();
    map = void 0;
  });
  function fitBounds(bbox, data = {}) {
    queue.send("fitBounds", [bbox, data]);
  }
  function flyTo(destination, data = {}) {
    queue.send("flyTo", [destination, data]);
  }
  function resize() {
    queue.send("resize");
  }
  function setCenter(coords, data = {}) {
    queue.send("setCenter", [coords, data]);
  }
  function setZoom(value, data = {}) {
    queue.send("setZoom", [value, data]);
  }
  function addControl(control, position = "top-right") {
    queue.send("addControl", [control, position]);
  }
  function getMap() {
    return map;
  }
  function getMapbox() {
    return mapbox;
  }
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.version === void 0 && $$bindings.version && version !== void 0)
    $$bindings.version(version);
  if ($$props.center === void 0 && $$bindings.center && center !== void 0)
    $$bindings.center(center);
  if ($$props.zoom === void 0 && $$bindings.zoom && zoom !== void 0)
    $$bindings.zoom(zoom);
  if ($$props.zoomRate === void 0 && $$bindings.zoomRate && zoomRate !== void 0)
    $$bindings.zoomRate(zoomRate);
  if ($$props.wheelZoomRate === void 0 && $$bindings.wheelZoomRate && wheelZoomRate !== void 0)
    $$bindings.wheelZoomRate(wheelZoomRate);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.accessToken === void 0 && $$bindings.accessToken && accessToken !== void 0)
    $$bindings.accessToken(accessToken);
  if ($$props.customStylesheetUrl === void 0 && $$bindings.customStylesheetUrl && customStylesheetUrl !== void 0)
    $$bindings.customStylesheetUrl(customStylesheetUrl);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.fitBounds === void 0 && $$bindings.fitBounds && fitBounds !== void 0)
    $$bindings.fitBounds(fitBounds);
  if ($$props.flyTo === void 0 && $$bindings.flyTo && flyTo !== void 0)
    $$bindings.flyTo(flyTo);
  if ($$props.resize === void 0 && $$bindings.resize && resize !== void 0)
    $$bindings.resize(resize);
  if ($$props.setCenter === void 0 && $$bindings.setCenter && setCenter !== void 0)
    $$bindings.setCenter(setCenter);
  if ($$props.setZoom === void 0 && $$bindings.setZoom && setZoom !== void 0)
    $$bindings.setZoom(setZoom);
  if ($$props.addControl === void 0 && $$bindings.addControl && addControl !== void 0)
    $$bindings.addControl(addControl);
  if ($$props.getMap === void 0 && $$bindings.getMap && getMap !== void 0)
    $$bindings.getMap(getMap);
  if ($$props.getMapbox === void 0 && $$bindings.getMapbox && getMapbox !== void 0)
    $$bindings.getMapbox(getMapbox);
  $$result.css.add(css$2);
  zoom && setZoom(zoom);
  return `<div class="${"svelte-1kuj9kb"}">${map ? `${slots.default ? slots.default({}) : ``}` : ``}
</div>`;
});
function randomColour() {
  return Math.round(Math.random() * 255);
}
const Marker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const { getMap, getMapbox } = getContext(contextKey);
  getMap();
  getMapbox();
  let { lat } = $$props;
  let { lng } = $$props;
  let { label = "Marker" } = $$props;
  let { popupClassName = "beyonk-mapbox-popup" } = $$props;
  let { markerOffset = [0, 0] } = $$props;
  let { popupOffset = 10 } = $$props;
  let { color = randomColour() } = $$props;
  let { popup = true } = $$props;
  let { popupOptions = {} } = $$props;
  let { markerOptions = {} } = $$props;
  let marker;
  let element;
  let elementPopup;
  function getMarker() {
    return marker;
  }
  if ($$props.lat === void 0 && $$bindings.lat && lat !== void 0)
    $$bindings.lat(lat);
  if ($$props.lng === void 0 && $$bindings.lng && lng !== void 0)
    $$bindings.lng(lng);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.popupClassName === void 0 && $$bindings.popupClassName && popupClassName !== void 0)
    $$bindings.popupClassName(popupClassName);
  if ($$props.markerOffset === void 0 && $$bindings.markerOffset && markerOffset !== void 0)
    $$bindings.markerOffset(markerOffset);
  if ($$props.popupOffset === void 0 && $$bindings.popupOffset && popupOffset !== void 0)
    $$bindings.popupOffset(popupOffset);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.popup === void 0 && $$bindings.popup && popup !== void 0)
    $$bindings.popup(popup);
  if ($$props.popupOptions === void 0 && $$bindings.popupOptions && popupOptions !== void 0)
    $$bindings.popupOptions(popupOptions);
  if ($$props.markerOptions === void 0 && $$bindings.markerOptions && markerOptions !== void 0)
    $$bindings.markerOptions(markerOptions);
  if ($$props.getMarker === void 0 && $$bindings.getMarker && getMarker !== void 0)
    $$bindings.getMarker(getMarker);
  return `<div${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</div>

<div class="${"popup"}"${add_attribute("this", elementPopup, 0)}>${slots.popup ? slots.popup({}) : ``}</div>`;
});
var Geocoder_svelte_svelte_type_style_lang = "";
var GeolocateControl_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "div.svelte-1pfu5h6{display:none}",
  map: null
};
const GeolocateControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  let { position = "top-left" } = $$props;
  let { options = {} } = $$props;
  let dispatcher;
  const geolocate = new mapbox.GeolocateControl(options);
  map.addControl(geolocate, position);
  function trigger() {
    geolocate.trigger();
  }
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  if ($$props.trigger === void 0 && $$bindings.trigger && trigger !== void 0)
    $$bindings.trigger(trigger);
  $$result.css.add(css$1);
  return `<div class="${"svelte-1pfu5h6"}"${add_attribute("this", dispatcher, 0)}></div>`;
});
const NavigationControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  let { position = "top-right" } = $$props;
  let { options = {} } = $$props;
  const nav = new mapbox.NavigationControl(options);
  map.addControl(nav, position);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  return ``;
});
const ScaleControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  let { position = "bottom-right" } = $$props;
  let { options = {} } = $$props;
  const optionsWithDefaults = Object.assign({ maxWidth: 80, unit: "metric" }, options);
  const scale = new mapbox.ScaleControl(optionsWithDefaults);
  map.addControl(scale, position);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.options === void 0 && $$bindings.options && options !== void 0)
    $$bindings.options(options);
  return ``;
});
const controls = {
  GeolocateControl,
  NavigationControl,
  ScaleControl
};
const MiniScroller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = "test" } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  return `<p>${escape(id)}</p>`;
});
let inputs_store = writable([]);
const Earthquakes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $inputs_store, $$unsubscribe_inputs_store;
  $$unsubscribe_inputs_store = subscribe(inputs_store, (value) => $inputs_store = value);
  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  if (map.getSource("earthquakes")) {
    console.log("exists");
    let data = {
      "type": "FeatureCollection",
      "crs": {
        "type": "name",
        "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
      },
      "features": $inputs_store
    };
    map.getSource("earthquakes").setData(data);
  } else {
    map.addSource("earthquakes", {
      type: "geojson",
      data: {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
        },
        "features": $inputs_store
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "earthquakes",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1"
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
      }
    });
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "earthquakes",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });
    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "earthquakes",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 4,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff"
      }
    });
  }
  map.on("click", "clusters", function(e) {
    const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
    const clusterId = features[0].properties.cluster_id;
    map.getSource("earthquakes").getClusterExpansionZoom(clusterId, function(err, zoom) {
      if (err) {
        return;
      }
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      });
    });
  });
  map.on("mouseenter", "clusters", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function() {
    map.getCanvas().style.cursor = "";
  });
  map.on("click", "unclustered-point", function(e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    console.log(e.features[0]);
    map.setCenter(coordinates);
    new mapbox.Popup({}).setLngLat(coordinates).setHTML('<div id="mini-scroller"></div>').addTo(map);
    new MiniScroller({
      target: document.getElementById("mini-scroller"),
      props: {
        id: e.features[0]._vectorTileFeature.properties.id
      }
    });
  });
  map.on("mouseenter", "unclustered-point", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", function() {
    map.getCanvas().style.cursor = "";
  });
  $$unsubscribe_inputs_store();
  return ``;
});
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: "#logo svg{fill:white;height:60px}.map-wrap.svelte-1624f9n{width:100%;height:100vh}",
  map: null
};
const load = async ({ fetch }) => {
  const res = await fetch("/load_sites", { method: "get" });
  if (res.ok) {
    console.log("okay");
    const sites = await res.json();
    let inputs_array = get_store_value(inputs_store);
    for (var i = 0; i < sites.table.length; i++) {
      let new_input = {
        "type": "Feature",
        "properties": {
          "id": sites.table[i].id,
          "mag": 4.1,
          "time": 1507411448780,
          "felt": null,
          "tsunami": 0
        },
        "geometry": {
          "type": "Point",
          "coordinates": [sites.table[i].lng, sites.table[i].lat, 0]
        }
      };
      inputs_array.push(new_input);
    }
    inputs_store.set(inputs_array);
    return { props: { sites: sites.table } };
  } else {
    console.log(res);
  }
  const { message } = await res.json();
  return { error: new Error(message) };
};
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_inputs_store;
  $$unsubscribe_inputs_store = subscribe(inputs_store, (value) => value);
  let { sites } = $$props;
  const { GeolocateControl: GeolocateControl2, NavigationControl: NavigationControl2 } = controls;
  let center = { lat: 38.88, lng: -77.1318825263977 };
  let marker = center;
  let zoom = 14;
  let mapComponent;
  if ($$props.sites === void 0 && $$bindings.sites && sites !== void 0)
    $$bindings.sites(sites);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `
          <div class="${"section-txt"}" id="${"map"}"><div class="${"map-wrap svelte-1624f9n"}">${validate_component(Map, "Map").$$render($$result, {
      accessToken: mapboxToken,
      center,
      this: mapComponent,
      zoom
    }, {
      this: ($$value) => {
        mapComponent = $$value;
        $$settled = false;
      },
      zoom: ($$value) => {
        zoom = $$value;
        $$settled = false;
      }
    }, {
      default: () => {
        return `${validate_component(Earthquakes, "Earthquakes").$$render($$result, {}, {}, {})}

                ${validate_component(NavigationControl2, "NavigationControl").$$render($$result, {}, {}, {})}
                ${validate_component(GeolocateControl2, "GeolocateControl").$$render($$result, {}, {}, {})}
                ${validate_component(Marker, "Marker").$$render($$result, { lat: marker.lat, lng: marker.lng }, {}, {})}`;
      }
    })}</div>
            
          </div>`;
  } while (!$$settled);
  $$unsubscribe_inputs_store();
  return $$rendered;
});
export { Routes as default, load };
