// app/api/supabase/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Inicializa el cliente de Supabase dentro de la función para evitar errores en build
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Configuración de Supabase no encontrada' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    const bucketName = 'previews'; // Tu bucket de Supabase
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');

    // Si se especifica un día, devolver solo esa preview
    if (day) {
      const dayNumber = parseInt(day);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 24) {
        return NextResponse.json({ error: 'Day must be between 1 and 24' }, { status: 400 });
      }
      
      const fileName = `V${dayNumber}.png`;
      const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;
      
      return NextResponse.json({
        name: fileName,
        url: publicUrl,
        day: dayNumber
      }, { status: 200 });
    }

    // Lista todos los archivos (imágenes) en el bucket 'previews'.
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
      return NextResponse.json({ message: 'No se encontraron imágenes en el bucket.' }, { status: 200 });
    }

    // Mapea los datos para obtener el nombre y la URL pública de cada imagen.
    // Ahora incluimos el número de día extraído del nombre del archivo
    const images = data
      .filter(file => file.name !== '.emptyFolderPlaceholder' && file.name.match(/^V\d+\.png$/))
      .map(file => {
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
        const dayMatch = file.name.match(/^V(\d+)\.png$/);
        const day = dayMatch ? parseInt(dayMatch[1]) : null;
        
        return {
          name: file.name,
          url: publicUrl,
          day: day
        };
      })
      .sort((a, b) => (a.day || 0) - (b.day || 0)); // Ordenar por día

    // Retorna la respuesta en formato JSON.
    return NextResponse.json(images, { status: 200 });

  } catch (error) {
    console.error('Error inesperado en la API:', error);
    // Asegura que el error sea de tipo `Error` para acceder a `message`
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}