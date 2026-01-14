import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Inicializa el cliente de Supabase dentro de la función para evitar errores en build
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Configuración de Supabase no encontrada' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Uploading file:', file.name, 'Size:', file.size);

    // Sanitizar el nombre del archivo para Supabase Storage
    // Reemplazar espacios con guiones y remover caracteres especiales
    const sanitizedFileName = file.name
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/[#&+%\s]/g, '-') // Reemplazar caracteres especiales
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .toLowerCase(); // Convertir a minúsculas

    console.log('Sanitized filename:', sanitizedFileName);

    // Convertir el archivo a ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Subir al bucket 'warmups'
    const { data, error } = await supabase.storage
      .from('warmups')
      .upload(sanitizedFileName, fileBuffer, {
        contentType: file.type,
        upsert: true // Sobrescribir si ya existe
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Upload successful:', data);

    // Obtener la URL pública
    const { data: publicData } = supabase.storage
      .from('warmups')
      .getPublicUrl(sanitizedFileName);

    return NextResponse.json({ 
      success: true, 
      data, 
      publicUrl: publicData.publicUrl,
      originalFileName: file.name,
      uploadedFileName: sanitizedFileName
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
