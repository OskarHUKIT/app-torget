import { createClient } from './supabase/client';

const BUCKET_NAME = 'apps';

export async function uploadAppFiles(
  appId: string,
  files: File[]
): Promise<{ success: boolean; paths?: string[]; error?: string }> {
  try {
    const supabase = createClient();
    const paths: string[] = [];

    for (const file of files) {
      const filePath = `${appId}/${file.name}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      paths.push(filePath);
    }

    return { success: true, paths };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function getPublicUrl(filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

export function getAppBaseUrl(appId: string): string {
  return getPublicUrl(`${appId}/index.html`);
}

export async function deleteAppFiles(appId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(appId);

    if (listError) {
      return { success: false, error: listError.message };
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${appId}/${file.name}`);
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
