'use server'

import { createClient } from "@/utils/supabase/server"

const getAllPosts = async () => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  // Ordenar los posts numéricamente por el número del día
  const sortedData = data?.sort((a, b) => {
    // Extraer el número del día (ej: "Day 1" -> 1, "Day 10" -> 10)
    const getDayNumber = (dayString: string) => {
      const match = dayString.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    
    const dayA = getDayNumber(a.day || '');
    const dayB = getDayNumber(b.day || '');
    
    return dayA - dayB;
  });

  return sortedData || []
}

const getPostsByWeek = async (week: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("week", week)

  if (error) {
    throw new Error(error.message)
  }

  // Ordenar los posts numéricamente por el número del día
  const sortedData = data?.sort((a, b) => {
    // Extraer el número del día (ej: "Day 1" -> 1, "Day 10" -> 10)
    const getDayNumber = (dayString: string) => {
      const match = dayString.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    
    const dayA = getDayNumber(a.day || '');
    const dayB = getDayNumber(b.day || '');
    
    return dayA - dayB;
  });

  return sortedData || []
}

const getPostById = async (id: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export { getAllPosts, getPostsByWeek, getPostById };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const weekParam = searchParams.get('week');

    if (id) {
      // Si se proporciona un ID, devolver solo ese post específico
      const post = await getPostById(id);
      return new Response(JSON.stringify({ posts: [post] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (weekParam) {
      // Si se proporciona una semana, convertir a número y devolver posts de esa semana
      const week = parseInt(weekParam, 10);
      if (isNaN(week)) {
        return new Response(JSON.stringify({ error: "Week parameter must be a valid number" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const posts = await getPostsByWeek(week);
      return new Response(JSON.stringify({ posts }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Si no se proporciona ID ni semana, devolver todos los posts ordenados
      const posts = await getAllPosts();
      return new Response(JSON.stringify({ posts }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
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
