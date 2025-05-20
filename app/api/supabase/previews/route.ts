// app/api/supabase/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Inicializa el cliente de Supabase.
// Asegúrate de que tus variables de entorno estén configuradas correctamente.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidas.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const bucketName = 'previews'; // Tu bucket de Supabase

    // Lista todos los archivos (imágenes) en el bucket 'previews'.
    // `path: ''` indica la raíz del bucket.
    // `options` permite paginación, filtros, etc.
    const { data, error } = await supabase.storage.from(bucketName).list('', {
      limit: 100, // Ajusta el límite si esperas muchas imágenes.
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
    const images = data
      .filter(file => file.name !== '.emptyFolderPlaceholder') // Opcional: Ignora el placeholder de carpeta vacía
      .map(file => {
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
        return {
          name: file.name,
          url: publicUrl,
        };
      });

    // Retorna la respuesta en formato JSON.
    return NextResponse.json(images, { status: 200 });

  } catch (error) {
    console.error('Error inesperado en la API:', error);
    // Asegura que el error sea de tipo `Error` para acceder a `message`
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}