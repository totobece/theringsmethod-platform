import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Obtener lista de archivos del bucket de meditaciones
    const { data: files, error } = await supabase.storage
      .from('meditaciones')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Error fetching meditations:', error);
      return NextResponse.json({ error: 'Error fetching meditations' }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ meditations: [] });
    }

    // Filtrar solo archivos de video y audio
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mp3', '.wav', '.m4a'];
    const meditationFiles = files.filter((file: { name: string }) => 
      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    );

    // Procesar archivos y extraer información
    const meditations = await Promise.all(
      meditationFiles.map(async (file: { name: string; metadata?: { size?: number }; created_at?: string; updated_at?: string }) => {
        // Generar URL pública para el archivo
        const { data: urlData } = await supabase.storage
          .from('meditaciones')
          .getPublicUrl(file.name);

        // Extraer información del nombre del archivo
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        
        // Intentar extraer duración del nombre (ej: "5 min", "10min", "15 minutes")
        const durationMatch = fileNameWithoutExt.match(/(\d+)\s*(?:min|minute|minutes|m)/i);
        const duration = durationMatch ? `${durationMatch[1]} min` : 'N/A';

        // Limpiar el título removiendo información de duración
        let title = fileNameWithoutExt
          .replace(/(\d+)\s*(?:min|minute|minutes|m)/gi, '')
          .replace(/[_-]/g, ' ')
          .trim();

        // Capitalizar primera letra de cada palabra
        title = title.replace(/\b\w/g, (l: string) => l.toUpperCase());

        // Si el título está vacío, usar el nombre del archivo
        if (!title) {
          title = fileNameWithoutExt.replace(/[_-]/g, ' ');
        }

        return {
          id: file.name, // Usar el nombre del archivo como ID
          title,
          duration,
          url: urlData.publicUrl,
          fileName: file.name,
          size: file.metadata?.size || 0,
          lastModified: file.created_at || file.updated_at,
          type: file.name.toLowerCase().includes('.mp4') || file.name.toLowerCase().includes('.webm') ? 'video' : 'audio'
        };
      })
    );

    // Ordenar por título
    meditations.sort((a: { title: string }, b: { title: string }) => a.title.localeCompare(b.title));

    return NextResponse.json({
      meditations,
      total: meditations.length
    });

  } catch (error) {
    console.error('Unexpected error in meditations API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
