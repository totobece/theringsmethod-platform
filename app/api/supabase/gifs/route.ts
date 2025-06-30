// app/api/supabase/gifs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa el cliente de Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidas.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const bucketName = 'gifs'; // Tu bucket de gifs de Supabase
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    // Si se especifica un día, devolver solo ese gif
    if (day) {
      const dayNumber = parseInt(day);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 24) {
        return NextResponse.json({ error: 'Day must be between 1 and 24' }, { status: 400 });
      }
      
      const fileName = `V${dayNumber} Indoor.gif`;
      const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;
      
      return NextResponse.json({
        name: fileName,
        url: publicUrl,
        day: dayNumber
      }, { status: 200 });
    }

    // Lista todos los archivos (gifs) en el bucket 'gifs'.
    const { data, error } = await supabase.storage.from(bucketName).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.error('Error al listar archivos de Supabase:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No se encontraron gifs en el bucket.' }, { status: 200 });
    }

    // Mapea los datos para obtener el nombre y la URL pública de cada gif.
    // Ahora incluimos el número de día extraído del nombre del archivo
    const gifs = data
      .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name.match(/^V\d+ Indoor\.gif$/))
      .map(file => {
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
        const dayMatch = file.name.match(/^V(\d+) Indoor\.gif$/);
        const day = dayMatch ? parseInt(dayMatch[1]) : null;
        
        return {
          name: file.name,
          url: publicUrl,
          day: day
        };
      })
      .sort((a, b) => (a.day || 0) - (b.day || 0)); // Ordenar por día

    // Retorna la respuesta en formato JSON.
    return NextResponse.json(gifs, { status: 200 });

  } catch (error) {
    console.error('Error inesperado en la API:', error);
    // Asegura que el error sea de tipo `Error` para acceder a `message`
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
