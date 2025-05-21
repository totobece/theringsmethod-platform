'use server'

import { createClient } from "@/utils/supabase/server"

interface Video {
  name: string;
  url: string;
}

/**
 * Obtiene todos los videos del bucket de Supabase
 * @returns {Promise<Video[]>} Lista de videos con nombre y URL
 */
const getAllVideos = async (): Promise<Video[]> => {
  const supabase = await createClient();
  
  // Listar todos los archivos en el bucket "videos"
  const { data, error } = await supabase
    .storage
    .from('videos')
    .list();

  if (error) {
    throw new Error(error.message);
  }

  // Si no hay datos, devolver un array vacío
  if (!data || data.length === 0) {
    return [];
  }

  // Para cada archivo, crear un objeto con su nombre y URL
  const videos: Video[] = await Promise.all(
    data.map(async (file) => {
      // Obtener la URL pública del video
      const { data: urlData } = await supabase
        .storage
        .from('videos')
        .getPublicUrl(file.name);

      return {
        name: file.name,
        url: urlData.publicUrl
      };
    })
  );

  return videos;
}

export { getAllVideos };

export async function GET() {
  try {
    const videos = await getAllVideos();
    return new Response(JSON.stringify({ videos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    let message = "Ha ocurrido un error al obtener los videos";
    if (error instanceof Error) {
      message = error.message;
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}