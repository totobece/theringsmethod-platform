const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadFile() {
  try {
    const filePath = './public/#1 WarmUp.mp4';
    const originalFileName = '#1 WarmUp.mp4';
    
    // Sanitizar el nombre del archivo
    const sanitizedFileName = originalFileName
      .replace(/\s+/g, '-')
      .replace(/[#&+%\s]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    
    console.log('Reading file:', filePath);
    console.log('Original filename:', originalFileName);
    console.log('Sanitized filename:', sanitizedFileName);
    
    const fileBuffer = fs.readFileSync(filePath);
    
    console.log('Uploading to Supabase...');
    const { data, error } = await supabase.storage
      .from('warmups')
      .upload(sanitizedFileName, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return;
    }

    console.log('Upload successful:', data);
    
    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('warmups')
      .getPublicUrl(sanitizedFileName);
    
    console.log('Public URL:', publicData.publicUrl);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadFile();
