# YouTube Shorts Downloader

A full-stack project to extract metadata and download YouTube Shorts (and regular YouTube URLs) using a modern Next.js frontend and FastAPI backend powered by `yt-dlp`.

## Tech Stack

- Frontend: Next.js 15+, TypeScript, Tailwind CSS, reusable shadcn-style UI components, React Hook Form, Zod, TanStack Query, Sonner, lucide-react
- Backend: FastAPI, yt-dlp, Pydantic, Uvicorn, python-dotenv, pydantic-settings

## Project Structure

```text
youtube-shorts-downloader/
  frontend/
    app/
    components/
    hooks/
    lib/
    package.json
    ...
  backend/
    app/
      core/
      routers/
      schemas/
      services/
      utils/
      main.py
    requirements.txt
    .env.example
  README.md
```

## Features

- URL validation for:
  - `https://www.youtube.com/shorts/...`
  - `https://youtu.be/...`
  - `https://www.youtube.com/watch?v=...`
- Metadata extraction without download:
  - title, thumbnail, duration, uploader, formats
- Download modes:
  - best mp4
  - best available
  - audio only
  - specific `format_id`
- Modern UX:
  - hero section
  - card-based layout
  - loading skeletons
  - success/error toasts
  - disabled/loading states
- Local history in browser `localStorage`
- Temp download storage and cleanup on backend

## Prerequisites

- Node.js 20+
- Python 3.10+
- FFmpeg installed and available in PATH (recommended for best merging/audio extraction)
- `yt-dlp` installed via pip (included in `requirements.txt`)

## Backend Setup

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

- `GET http://localhost:8000/health`

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

App URL:

- `http://localhost:5000`

## API Usage

### 1) Extract metadata

`POST /api/extract`

```json
{
  "url": "https://www.youtube.com/shorts/VIDEO_ID"
}
```

### 2) Download media

`POST /api/download`

```json
{
  "url": "https://www.youtube.com/shorts/VIDEO_ID",
  "format_id": "best_mp4",
  "download_type": "video"
}
```

`download_type` can be `video` or `audio`.

## Notes on yt-dlp and dependencies

- Backend uses `yt-dlp` in extract mode (`download=False`) for metadata.
- Downloads are written to backend temp directory (`TEMP_DIR`) and cleaned periodically.
- For audio conversion and advanced merge compatibility, FFmpeg should be installed.

## Legal / Copyright Disclaimer

This project is for educational and personal-use scenarios only. Users are responsible for complying with YouTube Terms of Service and all applicable copyright laws. Do not download or redistribute copyrighted content without proper permission.
