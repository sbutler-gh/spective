## spective (title pending)?

This is a basic version of the site, which offers a mapbox map with a prompt, and allows crowdsourced input to map items.  Sort of like Google "MyMaps", with crowdsourced inputs.  Here's what you need to run it locally:

1. Run `git clone [repository url]`
2. `cd` into the repo and run `npm install`
3. Set-up a project at [https://supabase.com](Supabase) with a table called `points` and that includes columns for `id`(uuid), `lat` (text), `lng` (text), `latlng` (json), and `content`(text).  (You can of course edit these as you like — this is just to get it up and running, with the existing code.)
3. Add a `.env` file in the root folder with the following items:

VITE_SUPABASE_URL=[supabase_url]
VITE_SUPABASE_ANON_KEY=[supabase_anon)key]
VITE_MAPBOX_ACCESS_TOKEN=[mapbox token]
VITE_IP_INFO_KEY=[ipinfo user key]

The following are optional (I have them in my `.env` file, without actual credentials — exactly as they appear below):

SUPABASE_PRIVATE_KEY=<your-supabase-private-key>
SUPABASE_JWT_SECRET=<your-supabase-jwt-secret>

4. You now should be able to use the application, add content to the map, and it should save to Supabase and render on the map.
5. If you want to deploy, you can do so on Cloudflare Pages, Netlify, or Vercel, by pushing your repository to GitHub or GitLab and linking to that repository.