export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png","normalize.css","prettify.css","style.css"]),
	mimeTypes: {".png":"image/png",".css":"text/css"},
	_: {
		entry: {"file":"start-b38a33a5.js","js":["start-b38a33a5.js","chunks/index-da32ce4b.js","chunks/index-d19cd493.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'endpoint',
				id: "publish_location",
				pattern: /^\/publish_location\/?$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/publish_location.js')
			},
			{
				type: 'endpoint',
				id: "load_sites",
				pattern: /^\/load_sites\/?$/,
				names: [],
				types: [],
				load: () => import('./entries/endpoints/load_sites.js')
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
