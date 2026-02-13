'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { extractMetadataFromManifest } from '@/lib/app-validator';
import { uploadAppFiles, getAppBaseUrl } from '@/lib/storage';
import { App, UploadType } from '@/lib/types';
import Link from 'next/link';

function getFaviconUrl(url: string): string | null {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const hostname = new URL(fullUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<'vercel_url' | 'file_upload' | 'external_link'>('vercel_url');
  const [vercelUrl, setVercelUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
      if (!user) {
        router.push('/login?redirect=/upload');
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleVercelUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to upload apps');
      }

      if (!vercelUrl.trim()) {
        throw new Error('Please enter a valid URL');
      }

      // Validate URL and fetch manifest (server-side API avoids CORS)
      const validateRes = await fetch('/api/validate-pwa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: vercelUrl }),
      });
      const validation = await validateRes.json().catch(() => ({}));
      if (!validation.valid || !validation.manifest) {
        throw new Error(validation.error || 'Invalid PWA - could not find manifest');
      }

      // Extract metadata
      const metadata = extractMetadataFromManifest(validation.manifest, vercelUrl);

      // Create app record
      const { data: app, error: dbError } = await supabase
        .from('apps')
        .insert({
          name: name || metadata.name,
          description: description || metadata.description,
          upload_type: 'vercel_url' as UploadType,
          external_url: vercelUrl,
          install_url: vercelUrl,
          manifest_url: validation.manifestUrl || `${vercelUrl}/manifest.json`,
          icon_url: metadata.iconUrl,
          author_id: user.id,
          category: category || null,
          status: 'approved',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}. Make sure the database migration has been run.`);
      }

      if (!app) {
        throw new Error('Failed to create app record');
      }

      // Full page navigation so server receives cookies and owner can view app
      window.location.href = `/app/${app.id}`;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while uploading');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to upload apps');
      }

      if (files.length === 0) {
        throw new Error('Please select files to upload');
      }

      if (!name.trim()) {
        throw new Error('Please enter an app name');
      }

      // Check for manifest.json
      const hasManifest = files.some((f) => f.name === 'manifest.json');
      if (!hasManifest) {
        throw new Error('manifest.json is required for PWA apps');
      }

      // Create app record first
      const appId = crypto.randomUUID();
      const { data: app, error: dbError } = await supabase
        .from('apps')
        .insert({
          id: appId,
          name: name.trim(),
          description: description.trim() || null,
          upload_type: 'file_upload' as UploadType,
          storage_path: appId,
          install_url: getAppBaseUrl(appId),
          manifest_url: getAppBaseUrl(appId).replace('index.html', 'manifest.json'),
          author_id: user.id,
          category: category.trim() || null,
          status: 'approved',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}. Make sure the database migration has been run and the storage bucket 'apps' exists.`);
      }

      if (!app) {
        throw new Error('Failed to create app record');
      }

      // Upload files
      const uploadResult = await uploadAppFiles(appId, files);
      if (!uploadResult.success) {
        // Clean up app record if upload fails
        try {
          await supabase.from('apps').delete().eq('id', appId);
        } catch (cleanupError) {
          console.error('Failed to cleanup app record:', cleanupError);
        }
        throw new Error(uploadResult.error || 'Failed to upload files to storage. Make sure the storage bucket "apps" exists and is public.');
      }

      // Full page navigation so server receives cookies and owner can view pending app
      window.location.href = `/app/${app.id}`;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while uploading');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to add links');
      }

      if (!linkUrl.trim()) {
        throw new Error('Please enter a valid URL');
      }

      if (!name.trim()) {
        throw new Error('Please enter an app name');
      }

      const fullUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
      const iconUrl = getFaviconUrl(fullUrl);

      const { data: app, error: dbError } = await supabase
        .from('apps')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          upload_type: 'external_link' as UploadType,
          external_url: fullUrl,
          install_url: fullUrl,
          manifest_url: null,
          icon_url: iconUrl,
          author_id: user.id,
          category: category.trim() || null,
          status: 'approved',
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}. Make sure the database migration has been run.`);
      }

      if (!app) {
        throw new Error('Failed to create app record');
      }

      // Full page navigation so server receives cookies and owner can view app
      window.location.href = `/app/${app.id}`;
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding link');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You must be logged in to upload apps.
          </p>
          <Link
            href="/login"
            className="inline-block bg-nytti-pink hover:bg-nytti-pink-dark text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload App</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setUploadType('vercel_url')}
              className={`flex-1 min-w-0 py-2 px-4 rounded ${
                uploadType === 'vercel_url'
                  ? 'bg-nytti-pink text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Already Deployed (Vercel URL)
            </button>
            <button
              onClick={() => setUploadType('file_upload')}
              className={`flex-1 min-w-0 py-2 px-4 rounded ${
                uploadType === 'file_upload'
                  ? 'bg-nytti-pink text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Upload Files
            </button>
            <button
              onClick={() => setUploadType('external_link')}
              className={`flex-1 min-w-0 py-2 px-4 rounded ${
                uploadType === 'external_link'
                  ? 'bg-nytti-pink text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Add Link
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
              <p className="font-semibold mb-1">Error:</p>
              <p className="text-sm">{error}</p>
              {error.includes('Database error') && (
                <p className="text-xs mt-2">
                  Make sure you&apos;ve run the database migration in Supabase SQL Editor.
                </p>
              )}
              {error.includes('storage bucket') && (
                <p className="text-xs mt-2">
                  Make sure you&apos;ve created a public storage bucket named &quot;apps&quot; in Supabase.
                </p>
              )}
            </div>
          )}

          {uploadType === 'vercel_url' ? (
            <form onSubmit={handleVercelUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">App URL (Vercel/external)</label>
                <input
                  type="text"
                  value={vercelUrl}
                  onChange={(e) => setVercelUrl(e.target.value)}
                  placeholder="https://myapp.vercel.app"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">App Name (optional - will use manifest)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome App"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your app..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category (optional)</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Productivity, Games, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nytti-pink hover:bg-nytti-pink-dark text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Validating...' : 'Submit App'}
              </button>
            </form>
          ) : uploadType === 'external_link' ? (
            <form onSubmit={handleExternalLinkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">App URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or https://gamechanging.itch.io/samle-flokken"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Any web URL: games, tools, itch.io, etc. No PWA required.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome App"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your app..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category (optional)</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Games, Tools, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nytti-pink hover:bg-nytti-pink-dark text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Link'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Files</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select all files for your PWA (must include manifest.json)
                </p>
                {files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {files.map((file) => (
                        <li key={file.name}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome App"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your app..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category (optional)</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Productivity, Games, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-nytti-pink hover:bg-nytti-pink-dark text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload App'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
