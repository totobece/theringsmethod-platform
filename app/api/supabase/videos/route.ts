'use server'

import { createClient } from "@/utils/supabase/server"

interface Video {
  name: string;
  url: string;
}

interface WeekVideos {
  week: string;
  videos: Video[];
}

/**
 * Obtiene todos los videos del bucket de Supabase organizados por semana
 * @returns {Promise<WeekVideos[]>} Lista de semanas con sus videos
 */
const getAllVideos = async (): Promise<WeekVideos[]> => {
  const supabase = await createClient();
  
  // Listar todas las carpetas en el bucket "videos"
  const { data: folders, error: foldersError } = await supabase
    .storage
    .from('videos')
    .list();

  if (foldersError) {
    throw new Error(foldersError.message);
  }

  // Si no hay carpetas, devolver un array vacío
  if (!folders || folders.length === 0) {
    return [];
  }

  // Para cada carpeta (semana), obtener los videos dentro
  const weekVideos: WeekVideos[] = await Promise.all(
    folders
      .filter(folder => folder.name && folder.name.startsWith('week')) // Solo carpetas que empiecen con "week"
      .map(async (folder) => {
        // Listar archivos dentro de cada carpeta
        const { data: files, error: filesError } = await supabase
          .storage
          .from('videos')
          .list(folder.name);

        if (filesError) {
          console.error(`Error al listar archivos en ${folder.name}:`, filesError.message);
          return {
            week: folder.name,
            videos: []
          };
        }

        // Obtener URLs públicas para cada video
        const videos: Video[] = await Promise.all(
          (files || []).map(async (file) => {
            // Construir la ruta completa del archivo
            const filePath = `${folder.name}/${file.name}`;
            
            // Obtener la URL pública del video
            const { data: urlData } = await supabase
              .storage
              .from('videos')
              .getPublicUrl(filePath);

            return {
              name: file.name,
              url: urlData.publicUrl
            };
          })
        );

        return {
          week: folder.name,
          videos: videos
        };
      })
  );

  // Ordenar por semana (week1, week2, week3, week4)
  weekVideos.sort((a, b) => {
    const getWeekNumber = (weekName: string) => {
      const match = weekName.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    
    return getWeekNumber(a.week) - getWeekNumber(b.week);
  });

  return weekVideos;
}

export { getAllVideos };

export async function GET() {
  try {
    const weekVideos = await getAllVideos();
    return new Response(JSON.stringify({ weekVideos }), {
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