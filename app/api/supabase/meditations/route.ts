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
        
        // Intentar extraer duración del nombre con múltiples patrones
        let duration = 'N/A';
        
        // Patrones para buscar duración (más flexibles)
        const durationPatterns = [
          /(\d+)\s*(?:min|minute|minutes|m)(?:\s|$)/i,  // "5 min", "10min", etc.
          /(\d+):\d+/,  // "5:30", "10:15" (formato mm:ss)
          /(\d+)\s*(?:seg|second|seconds|s)(?:\s|$)/i,  // "30 seg", "45s", etc.
          /duration[:\s]*(\d+)\s*(?:min|m)/i,  // "duration: 5 min"
          /time[:\s]*(\d+)\s*(?:min|m)/i,      // "time: 10 min"
          /(?:^|\s)(\d+)(?:\s|$)/              // Cualquier número solo
        ];

        // Buscar duración usando los patrones
        for (const pattern of durationPatterns) {
          const match = fileNameWithoutExt.match(pattern);
          if (match) {
            const minutes = parseInt(match[1], 10);
            if (minutes > 0 && minutes <= 120) { // Validar que sea un tiempo razonable
              duration = `${minutes} min`;
              break;
            }
          }
        }

        // Si no se encontró duración en el nombre, intentar otras estrategias
        if (duration === 'N/A') {
          // Buscar patrones de tiempo más específicos
          const timeMatch = fileNameWithoutExt.match(/(\d{1,2}):(\d{2})/);
          if (timeMatch) {
            const minutes = parseInt(timeMatch[1], 10);
            const seconds = parseInt(timeMatch[2], 10);
            if (minutes >= 0 && seconds >= 0 && seconds < 60) {
              duration = seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')} min` : `${minutes} min`;
            }
          }
        }

        // Limpiar el título removiendo información de duración y otros metadatos
        let title = fileNameWithoutExt
          .replace(/(\d+)\s*(?:min|minute|minutes|m)(?:\s|$)/gi, '') // remover duración
          .replace(/(\d+):\d+/g, '') // remover formato mm:ss
          .replace(/(\d+)\s*(?:seg|second|seconds|s)(?:\s|$)/gi, '') // remover segundos
          .replace(/duration[:\s]*\d+\s*(?:min|m)/gi, '') // remover "duration: X min"
          .replace(/time[:\s]*\d+\s*(?:min|m)/gi, '') // remover "time: X min"
          .replace(/[_-]/g, ' ') // reemplazar guiones y guiones bajos con espacios
          .replace(/\s+/g, ' ') // normalizar espacios múltiples
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
