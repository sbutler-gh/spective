import { writable } from "svelte/store";

let points_store = writable([
        ]
);

let prompts_store = writable([]);

let points_prompt_store = writable([
]
);

let current_prompt_store = writable();

let map_center_store = writable();

let route_store = writable();

let user_store = writable();

export { user_store, points_store, prompts_store, points_prompt_store, current_prompt_store, map_center_store, route_store };