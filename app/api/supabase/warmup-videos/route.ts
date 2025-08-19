import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: files, error } = await supabase.storage
      .from('warmups')
      .list('', {
        limit: 100,
        offset: 0,
      });

    if (error) {
      console.error('Error fetching warmup videos:', error);
      return NextResponse.json({ error: 'Error fetching warmup videos' }, { status: 500 });
    }

    if (!files) {
      return NextResponse.json({ warmupVideos: [] });
    }

    // Filtrar solo archivos de video (WarmUp1, WarmUp2, etc.)
    const videoFiles = files.filter(file => 
      file.name.toLowerCase().startsWith('warmup') && 
      (file.name.toLowerCase().endsWith('.mp4') || 
       file.name.toLowerCase().endsWith('.mov') || 
       file.name.toLowerCase().endsWith('.avi'))
    );

    // Crear URLs públicas para cada archivo
    const warmupVideos = videoFiles.map(file => {
      const { data } = supabase.storage
        .from('warmups')
        .getPublicUrl(file.name);

      // Extraer número del warmup (WarmUp1 -> 1, WarmUp2 -> 2, etc.)
      const match = file.name.match(/warmup(\d+)/i);
      const warmupNumber = match ? parseInt(match[1]) : 0;

      return {
        id: file.name,
        title: file.name.replace(/\.(mp4|mov|avi)$/i, ''),
        warmupNumber,
        url: data.publicUrl,
        fileName: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at || file.created_at,
        type: 'video'
      };
    });

    // Ordenar por número de warmup
    warmupVideos.sort((a, b) => a.warmupNumber - b.warmupNumber);

    return NextResponse.json({ warmupVideos });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
