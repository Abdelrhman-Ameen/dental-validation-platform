# Deployment

## Firebase

1. Create a Firebase project and enable Authentication providers:
   - Google
   - Email/password
2. Create Firestore and Cloud Functions. Firebase Storage is not required.
3. Copy `.env.example` into `frontend/.env.local` and fill values.
4. Or generate the Firebase Web App values automatically:
   ```bash
   npm run firebase:login
   npm run firebase:setup -- --project <project-id>
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Deploy rules and functions:
   ```bash
   npm run firebase:deploy
   ```
7. Seed the validation dataset:
   ```bash
   npm run seed
   ```
   For local/static simulation, run `npm run seed:local` before building so the 20 cases exist in `frontend/public/dataset/`.

Google login requires Firebase Console > Authentication > Sign-in method > Google to be enabled. Also add `localhost` and the Vercel domain under Authentication > Settings > Authorized domains.

## Vercel

1. Import the `WebSite` folder as the repository root.
2. Keep the root `vercel.json`.
3. Add the same Firebase client and Admin SDK environment variables in Vercel.
4. Deploy. Vercel runs:
   ```bash
   npm --workspace frontend run build
   ```

The fixed validation images are bundled as static assets under `frontend/public/dataset/`, so Vercel can serve them without Firebase Storage or a separate upload server.

## First Admin

Create the first user through the UI, then set their Firestore `users/{uid}.role` to `admin` once from the Firebase console or with the callable `setUserRole` invoked by an existing admin.
