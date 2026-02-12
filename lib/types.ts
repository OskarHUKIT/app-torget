export type UploadType = 'vercel_url' | 'file_upload' | 'github' | 'external_link';

export type AppStatus = 'pending' | 'approved' | 'rejected';

export interface App {
  id: string;
  name: string;
  description: string | null;
  upload_type: UploadType;
  external_url: string | null;
  storage_path: string | null;
  github_url: string | null;
  icon_url: string | null;
  screenshots: string[];
  manifest_url: string | null;
  install_url: string;
  author_id: string;
  category: string | null;
  tags: string[];
  install_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
  status: AppStatus;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  app_id: string;
  created_at: string;
}

export interface PWAManifest {
  name: string;
  short_name?: string;
  description?: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  start_url?: string;
  display?: string;
  theme_color?: string;
  background_color?: string;
}
