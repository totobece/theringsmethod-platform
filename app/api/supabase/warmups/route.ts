import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: warmups, error } = await supabase
      .from('warmups')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching warmups:', error);
      return NextResponse.json({ error: 'Error fetching warmups' }, { status: 500 });
    }

    return NextResponse.json({ warmups });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
