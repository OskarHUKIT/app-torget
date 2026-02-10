# App Torget

A Progressive Web App marketplace where users can upload, discover, and install web applications directly to their phones.

## Features

- 📱 Install App Torget as a PWA on your phone
- 🔍 Browse and discover web applications
- ⬆️ Upload apps via Vercel URL or file upload (GitHub/ZIP/direct)
- 📥 One-click installation of apps as PWAs
- 🔄 Offline support for installed apps
- 👤 User authentication and profiles

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GITHUB_TOKEN=your_github_token (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a Storage bucket named `apps` (set to Public)
3. Run the database migration from `supabase/migrations/001_initial_schema.sql` in the SQL Editor

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app-torget/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── app/[id]/          # App detail pages
│   ├── upload/            # Upload page
│   └── profile/           # User profile
├── components/            # React components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── storage.ts         # Storage helpers
│   └── app-validator.ts   # PWA validation
├── supabase/             # Supabase migrations
└── public/               # Static assets and PWA files
```

## Usage

### Uploading Apps

1. **Vercel URL Method**: Provide a URL to an already-deployed PWA
2. **File Upload Method**: Upload files directly (must include manifest.json)

### Installing Apps

1. Browse apps on the homepage
2. Click on an app to view details
3. Click "Install App" button
4. The app opens in a new window
5. Use your browser's "Add to Home Screen" option to install as PWA

## Deployment

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for Vercel deployment instructions.

## License

MIT
