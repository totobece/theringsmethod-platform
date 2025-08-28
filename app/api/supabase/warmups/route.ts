import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const locale = searchParams.get('locale') || 'en';
    
    const supabase = await createClient();
    
    // Determinar qué tabla usar según el idioma
    const tableName = locale === 'es' ? 'warmups_español' : 'warmups';
    
    if (id) {
      // Obtener un warmup específico por ID
      const { data: warmup, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching warmup:', error);
        return NextResponse.json({ error: 'Error fetching warmup' }, { status: 500 });
      }

      return NextResponse.json({ warmup });
    } else {
      // Obtener todos los warmups (para la lista general)
      const { data: warmups, error } = await supabase
        .from(tableName)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching warmups:', error);
        return NextResponse.json({ error: 'Error fetching warmups' }, { status: 500 });
      }

      return NextResponse.json({ warmups });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
