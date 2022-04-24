import supabase from '$lib/db';
// import { dev } from '$app/env';



export async function post({ request }) {

  const body = await await request.formData();

  console.log('submitting json');
  console.log(request);

  const { data, error } = await supabase
  .from('points')
  .insert([
    { 
      lng: body.get('lng'),
      lat: body.get('lat'),
      lng_lat: body.get('lng_lat'),
      content: body.get('content')
        }
    ]);
    

  if (error) {
    return {
      status: error.status,
      body: error.message
    }
  }

  else {

  return {
    status: 200,
    body: data
  }
}
}