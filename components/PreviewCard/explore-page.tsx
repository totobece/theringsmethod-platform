import supabase from '@/utils/supabase'

export const revalidate = 60

export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('id, title, content')

  return posts?.map(({ id }) => ({
    id,
  }))
}