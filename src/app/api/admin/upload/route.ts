import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  console.log('UPLOAD API ÇALIŞTI');
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    console.log('Dosya yok!');
    return NextResponse.json({ error: 'Dosya yok!' }, { status: 400 });
  }
  console.log('Dosya alındı:', file.name, file.type, file.size);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  console.log('Buffer oluşturuldu, boyut:', buffer.length);

  // Dosya tipine göre bucket seç
  let bucket = 'files';
  if (file.type.startsWith('image/')) bucket = 'images';
  else if (file.type.startsWith('video/')) bucket = 'videos';
  console.log('Bucket seçildi:', bucket);

  const filePath = `${bucket}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabaseAdmin
    .storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });
  console.log('Upload sonucu:', uploadData, uploadError);

  if (uploadError) {
    console.log('Upload hatası:', uploadError.message);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  const publicUrl = data.publicUrl;
  console.log('Public url:', publicUrl);

  return NextResponse.json({ url: publicUrl, path: filePath });
} 