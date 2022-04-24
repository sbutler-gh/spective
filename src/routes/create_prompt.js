import supabase from '$lib/db';
// import { dev } from '$app/env';
import crypto from "crypto";



export async function post({ request }) {

  const body = await await request.formData();

  console.log('submitting json');
  console.log(body.get('content'));

  const { data, error } = await supabase
  .from('prompts')
  .insert([
    { id: crypto.randomUUID(),
      content: body.get('content'),
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