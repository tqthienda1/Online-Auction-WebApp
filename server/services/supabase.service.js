import { supabase } from "../libs/client.js";

export const uploadFileToSupabase = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: 3600,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  return data.publicUrl;
};

export const uploadFilesToSupabase = async (files) => {
  const urls = [];

  for (const file of files) {
    const url = await uploadFileToSupabase(file);
    urls.push(url);
  }

  return urls;
};

export async function generateMagicLink(email, productId) {
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${process.env.FRONTEND_URL}/products/${productId}`,
    },
  });

  if (error) throw error;

  return data.properties.action_link;
}
