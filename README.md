# Dental Validation Platform

Production-ready full-stack platform for AI dental diagnosis external validation.

Stack:

- Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style UI
- Firebase Auth, Firestore, Cloud Functions
- Static local validation images served from `frontend/public/dataset`
- Cloudinary admin-only dataset image uploads
- Recharts analytics
- Vercel frontend deployment

## Local Setup

```bash
npm install
copy .env.example frontend\\.env.local
```

```bash
npm run seed:local
npm run dev
```

Open `http://localhost:3000`.

`npm run seed:local` copies 20 real radiographs from `DataSet/test` into `frontend/public/dataset/` and generates the local simulation quiz data.
See `docs/static-dataset.md` for the static dataset workflow.

## Cloudinary Admin Uploads

Install command used:

```bash
npm --workspace frontend install cloudinary
```

Server-side environment variables:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Optional equivalent:

```bash
CLOUDINARY_URL=cloudinary://api-key:api-secret@cloud-name
```

The Cloudinary secret must exist only in local server env or Vercel environment variables. Do not prefix it with `NEXT_PUBLIC_`.

Admins can upload images from:

```txt
/admin/datasets
```

Uploads are stored under:

```txt
dental-ai/datasets/
```

Metadata is saved in Firestore:

```txt
dataset_images
```

The fixed 20-case validation set remains static in `frontend/public/dataset` and is not changed by Cloudinary uploads.

## Firebase Admin Login

Admins use the same `/login` page as doctors, but they must sign in with a real Firebase Authentication email/password account whose Firestore profile has `role: "admin"`.

Create or update an admin account with:

```bash
npm run admin:create -- admin@example.com StrongPassword123 "Research Admin"
```

The script creates the Firebase Auth user, sets the custom claim `{ role: "admin" }`, and writes `users/{uid}` with `role: "admin"`. It requires `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `.env.local`, `frontend/.env.local`, or your shell environment.

## Firebase Setup

```bash
npm run firebase:login
npm run firebase:setup -- --project <project-id>
npm run firebase:deploy
npm run seed
```

Then enable authentication providers in Firebase Console:

1. Open Firebase Console > Authentication > Sign-in method.
2. Enable Email/Password.
3. Enable Google if doctors should sign in with Gmail.
3. Open Authentication > Settings > Authorized domains.
4. Add `localhost` and your Vercel domain.

## Important Security Notes

- Doctors do not read `questions` directly.
- `submitQuiz` scores on the server with Admin SDK access.
- The Next.js `/api/submit-quiz` route scores with the server-only static answer key and writes `quiz_attempts` to Firestore with the Admin SDK.
- Duplicate attempts are blocked with deterministic attempt IDs.
- Admin access is enforced through Firebase Auth, Firestore `users/{uid}.role`, middleware cookies, Firestore rules, and server API checks.

## Research Context

The app is built around the paper's DeiT + CoAtNet cross-attention dental diagnosis model for Cavity, Fillings, Implant, and Impacted Tooth classification. The default AI baseline uses the reported model-level metrics and appears as a leaderboard participant.

The interface defaults to dark mode for radiograph review. Use the sun/moon button on public pages and dashboards to switch between dark and light themes.
