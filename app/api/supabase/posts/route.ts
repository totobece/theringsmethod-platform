'use server'

import { createClient } from "@/utils/supabase/server"

const getAllPosts = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export { getAllPosts };

export async function GET() {
  try {
    const posts = await getAllPosts();
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
