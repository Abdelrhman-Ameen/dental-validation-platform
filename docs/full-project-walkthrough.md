# Dental AI External Validation Platform - Full Walkthrough

This document explains what happens across the whole project, from opening the website to saving doctor responses, admin monitoring, export, and deployment.

## 1. Project Purpose

The platform is an external validation benchmark for an AI dental diagnosis model.

The study compares:

- Human dentist diagnostic performance.
- AI model diagnostic performance.
- Per-image answers on a fixed 20-radiograph validation set.
- Timing, score, leaderboard rank, and aggregate analytics.

The platform is built with:

- Next.js 15 App Router.
- TypeScript.
- TailwindCSS and shadcn-style UI components.
- Firebase Authentication.
- Cloud Firestore.
- Firebase Admin SDK in server routes.
- Firebase Cloud Functions.
- Static local validation images in `frontend/public/dataset`.
- Vercel-compatible deployment.

## 2. Main Folders

```txt
WebSite/
  frontend/
    app/
    components/
    hooks/
    lib/
    public/dataset/
  backend/functions/
  scripts/
  docs/
  firestore.rules
  firebase.json
  vercel.json
  package.json
```

Important files:

```txt
frontend/app/page.tsx
frontend/app/login/page.tsx
frontend/app/register/page.tsx
frontend/app/onboarding/page.tsx
frontend/app/quiz/page.tsx
frontend/app/quiz/result/page.tsx
frontend/app/admin/page.tsx
frontend/components/auth/auth-provider.tsx
frontend/components/auth/auth-card.tsx
frontend/components/auth/auth-guard.tsx
frontend/components/auth/onboarding-form.tsx
frontend/components/quiz/quiz-client.tsx
frontend/components/admin/admin-dashboard.tsx
frontend/hooks/useAdmin.ts
frontend/lib/auth.ts
frontend/lib/firestore.ts
frontend/lib/functions.ts
frontend/lib/local-simulation-questions.ts
frontend/lib/local-simulation-answer-key.ts
frontend/app/api/submit-quiz/route.ts
frontend/app/api/admin/export/route.ts
firestore.rules
scripts/create-admin.mjs
scripts/generate-local-simulation.mjs
```

## 3. User Types

There are two real roles:

```txt
doctor
admin
```

Roles are stored in Firestore:

```txt
users/{uid}
```

Example admin profile:

```json
{
  "uid": "firebase-auth-uid",
  "name": "Dr Noha's Team",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Example doctor profile:

```json
{
  "uid": "firebase-auth-uid",
  "name": "Abdelrhman Ameen",
  "email": "doctor@example.com",
  "role": "doctor",
  "university": "Nile University",
  "country": "Egypt",
  "governorate": "Giza",
  "specialty": "General dentistry",
  "yearsExperience": 0,
  "academicStage": "Student",
  "hasCompletedQuiz": false,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

## 4. Public Landing Page Flow

File:

```txt
frontend/app/page.tsx
```

When a visitor opens `/`, they see:

- Radiograph background.
- Project title.
- Benchmark description.
- Start benchmark button.
- Session-aware panel.
- Statistics cards.
- Research protocol section.
- Dark/light mode toggle.

The homepage checks authentication state through:

```txt
frontend/components/common/home-session-panel.tsx
frontend/components/auth/auth-provider.tsx
```

If the visitor is not signed in:

- The primary action sends them to login/register.

If the visitor is signed in as a doctor:

- The homepage can show a welcome message.
- It routes toward quiz or result depending on `hasCompletedQuiz`.

If the visitor is signed in as admin:

- The homepage can show admin welcome state.
- It routes toward `/admin`.

## 5. Authentication Flow

Files:

```txt
frontend/lib/auth.ts
frontend/components/auth/auth-card.tsx
frontend/components/auth/auth-provider.tsx
frontend/app/api/auth/session/route.ts
frontend/app/api/auth/me/route.ts
frontend/app/api/auth/logout/route.ts
```

Authentication is Firebase-based.

Supported login methods:

- Email/password.
- Google/Gmail login.

The old local admin login system using `A0/A1/A2/A3 + 123` was removed.

### 5.1 Email/password login

The login form calls:

```ts
loginWithEmail(email, password)
```

That function:

1. Sets Firebase persistence to browser local persistence.
2. Signs in with Firebase Auth.
3. Gets a Firebase ID token.
4. Sends that token to `/api/auth/session`.
5. The server verifies the token with Firebase Admin SDK.
6. The server creates an HTTP-only Firebase session cookie.

The cookie is used by server routes such as:

```txt
/api/auth/me
/api/admin/export
/api/questions
```

### 5.2 Google/Gmail login

The Google button calls:

```ts
loginWithGoogle()
```

That function:

1. Opens Firebase Google provider popup.
2. Signs the user in.
3. Creates the secure server session cookie.
4. Routes based on the Firestore role/profile.

Google login requires Google provider to be enabled in Firebase Console.

### 5.3 Register flow

The register page creates a Firebase Auth account.

After registration:

1. Firebase Auth user is created.
2. Display name is saved in Firebase Auth.
3. Server session cookie is created.
4. User is redirected to onboarding.

The Firestore doctor profile is not complete until onboarding is submitted.

## 6. Auth Provider

File:

```txt
frontend/components/auth/auth-provider.tsx
```

The Auth Provider is mounted globally.

It watches Firebase Auth state using:

```ts
onAuthStateChanged(auth, ...)
```

When a Firebase user exists:

1. It refreshes the server session.
2. It reads `users/{uid}` from Firestore.
3. It stores:
   - `user`
   - `profile`
   - `loading`
   - `isAdmin`

Any component can access this with:

```ts
useAuth()
```

File:

```txt
frontend/hooks/useAuth.ts
```

## 7. Route Protection

Files:

```txt
frontend/middleware.ts
frontend/components/auth/auth-guard.tsx
```

There are two layers:

1. Middleware checks for a session cookie and role cookie.
2. Client `AuthGuard` verifies the Firebase/Firestore profile.

Protected routes:

```txt
/quiz
/leaderboard
/onboarding
/admin
```

Admin routes require:

```txt
profile.role === "admin"
```

Doctor routes require:

```txt
profile.role === "doctor"
```

If unauthenticated:

- User is redirected to `/login?next=...`.

If authenticated but not onboarded:

- Doctor is redirected to `/onboarding`.

If authenticated doctor tries `/admin`:

- Doctor is redirected away from admin pages.

## 8. Doctor Onboarding Flow

Files:

```txt
frontend/app/onboarding/page.tsx
frontend/components/auth/onboarding-form.tsx
frontend/app/api/onboarding/profile/route.ts
```

After first login/register, doctors complete demographic data.

Collected fields:

- Full name.
- University.
- Country.
- Governorate / government area.
- Specialty.
- Years of experience.
- Student or graduate / academic stage.

When the doctor submits:

1. The form gets a fresh Firebase ID token.
2. The form POSTs to `/api/onboarding/profile`.
3. The server verifies the Firebase token.
4. The server writes `users/{uid}` with `role: "doctor"`.
5. `hasCompletedQuiz` is set to `false`.
6. The doctor is redirected to `/quiz`.

The onboarding route uses Firebase Admin SDK when available.

## 9. Dataset Flow

The validation dataset is static.

Images are stored in:

```txt
frontend/public/dataset/
```

Example:

```txt
frontend/public/dataset/case1.jpg
frontend/public/dataset/case2.jpg
...
frontend/public/dataset/case20.jpg
```

Images are served as static Next.js/Vercel assets.

Example image URL:

```txt
/dataset/case1.jpg
```

The app does not depend on Firebase Storage for validation images.

## 10. Dataset Generation

Script:

```txt
scripts/generate-local-simulation.mjs
```

Source data:

```txt
DataSet/test/
DataSet/test/_annotations.csv
```

The script:

1. Reads the test dataset.
2. Selects 20 cases.
3. Copies images into `frontend/public/dataset`.
4. Generates browser-safe question data.
5. Generates server-only answer key data.

Browser-side question data:

```txt
frontend/lib/local-simulation-questions.ts
```

Server-side answer key:

```txt
frontend/lib/local-simulation-answer-key.ts
```

Important security principle:

- The frontend should not expose reference answers.
- Scoring must happen server-side.

## 11. Quiz Loading Flow

Files:

```txt
frontend/app/quiz/page.tsx
frontend/components/quiz/quiz-client.tsx
frontend/hooks/useQuiz.ts
frontend/lib/functions.ts
frontend/app/api/questions/route.ts
```

When a doctor opens `/quiz`:

1. `AuthGuard` confirms the user is a doctor.
2. `useQuizQuestions()` loads the question list.
3. Questions are randomized.
4. The quiz starts with timers.

The quiz currently uses 20 cases.

Constants:

```txt
frontend/lib/constants.ts
```

Important constants:

```ts
QUESTION_TOTAL = 20
QUESTION_TIMER_SECONDS = 90
TOTAL_TIMER_SECONDS = QUESTION_TOTAL * QUESTION_TIMER_SECONDS
```

## 12. Quiz Answering Flow

File:

```txt
frontend/components/quiz/quiz-client.tsx
```

For every radiograph, the doctor can:

- View the image.
- Zoom/pan through the image viewer.
- Select one or more diseases.
- Select one or more FDI tooth numbers for each disease.
- Move next/previous.
- Check answer.
- Submit final attempt.

Supported conditions:

```txt
Cavity
Fillings
Implant
Impacted Tooth
```

Tooth IDs use FDI notation.

Example selected finding:

```json
{
  "condition": "Cavity",
  "toothIds": ["26", "27"]
}
```

Each answer sent to the server looks like:

```json
{
  "questionId": "q1",
  "selectedFindings": [
    {
      "condition": "Cavity",
      "toothIds": ["27"]
    }
  ],
  "timeSpent": 52
}
```

## 13. Per-Question Feedback Flow

File:

```txt
frontend/app/api/question-feedback/route.ts
```

After the doctor checks an answer, the app displays:

- Doctor answer.
- AI model answer.
- Reference answer.

The UI highlights matching findings in green.

This is shown in:

```txt
frontend/components/quiz/quiz-client.tsx
```

The answer data comes from the server-only answer key.

## 14. Quiz Submission Flow

Files:

```txt
frontend/components/quiz/quiz-client.tsx
frontend/lib/functions.ts
frontend/app/api/submit-quiz/route.ts
```

When the doctor submits:

1. The frontend collects all 20 answers.
2. It includes:
   - answers
   - startedAt
   - browser
   - device
   - userAgent
3. It gets a Firebase ID token.
4. It POSTs to `/api/submit-quiz`.
5. The server verifies the token with Firebase Admin SDK.
6. The server confirms the user exists in Firestore.
7. The server confirms `role === "doctor"`.
8. The server confirms `hasCompletedQuiz !== true`.
9. The server scores the attempt against `localSimulationAnswerKey`.
10. The server writes the attempt to Firestore.
11. The server updates the doctor profile.
12. The server writes a leaderboard entry.
13. The server writes or refreshes the AI leaderboard participant.

## 15. Server-Side Scoring

File:

```txt
frontend/app/api/submit-quiz/route.ts
```

Scoring uses:

```txt
frontend/lib/local-simulation-answer-key.ts
```

The server normalizes findings by:

- Validating disease names.
- Removing duplicate tooth numbers.
- Keeping only valid FDI tooth numbers.
- Sorting tooth numbers.
- Sorting disease findings.

Then it compares:

```txt
doctor selectedFindings
vs
referenceFindings
```

The answer is correct only if:

- The same disease findings are present.
- Each finding has the same tooth numbers.
- No extra findings are added.
- No expected findings are missing.

## 16. Firestore Quiz Attempt Structure

Collection:

```txt
quiz_attempts
```

Document ID:

```txt
{doctorUid}_dataset_v1
```

Example:

```json
{
  "attemptId": "uid_dataset_v1",
  "userId": "uid",
  "userName": "Abdelrhman Ameen",
  "university": "Nile University",
  "datasetVersion": "dataset_v1",
  "startedAt": "timestamp",
  "finishedAt": "timestamp",
  "totalScore": 14,
  "totalQuestions": 20,
  "accuracy": 0.7,
  "timeTaken": 1020,
  "browser": "Chrome",
  "device": "desktop",
  "userAgent": "...",
  "answers": [
    {
      "questionId": "q1",
      "selectedFindings": [
        {
          "condition": "Cavity",
          "toothIds": ["27"]
        }
      ],
      "referenceFindings": [
        {
          "condition": "Cavity",
          "toothIds": ["27"]
        }
      ],
      "timeSpent": 45,
      "correct": true
    }
  ],
  "createdAt": "serverTimestamp"
}
```

## 17. One-Attempt Rule

One real doctor can complete the benchmark once per dataset version.

This is enforced by:

1. Firestore profile field:

```txt
users/{uid}.hasCompletedQuiz
```

2. Deterministic attempt ID:

```txt
{uid}_dataset_v1
```

3. Server transaction:

```txt
adminDb().runTransaction(...)
```

If an attempt already exists, submission is rejected.

## 18. Results Page Flow

Files:

```txt
frontend/app/quiz/result/page.tsx
frontend/components/quiz/results-client.tsx
frontend/lib/firestore.ts
frontend/lib/scoring.ts
```

After submission:

1. The doctor is redirected to `/quiz/result`.
2. The page subscribes to that doctor's attempt.
3. It displays:
   - score
   - accuracy
   - rank
   - time
   - AI comparison
   - leaderboard preview

The result is read from Firestore:

```txt
quiz_attempts
```

The leaderboard is read from:

```txt
leaderboard
```

## 19. Leaderboard Flow

Files:

```txt
frontend/app/leaderboard/page.tsx
frontend/components/leaderboard/leaderboard-client.tsx
frontend/lib/firestore.ts
frontend/app/api/leaderboard/route.ts
```

Leaderboard entries include:

- Human doctors.
- AI reference model.

Human entry example:

```json
{
  "participantId": "doctorUid",
  "participantType": "doctor",
  "name": "Abdelrhman Ameen",
  "university": "Nile University",
  "score": 14,
  "totalQuestions": 20,
  "accuracy": 0.7,
  "timeTaken": 1020,
  "datasetVersion": "dataset_v1",
  "rank": 2,
  "updatedAt": "serverTimestamp"
}
```

AI entry example:

```json
{
  "participantId": "ai-reference",
  "participantType": "ai",
  "name": "YOLOv8s+Swin-T",
  "university": "AI reference model",
  "score": 19,
  "totalQuestions": 20,
  "accuracy": 0.95,
  "timeTaken": 0.064,
  "datasetVersion": "dataset_v1",
  "rank": 1,
  "updatedAt": "serverTimestamp"
}
```

## 20. Admin Login Flow

Admin login is real Firebase Authentication.

Admins use the same login page:

```txt
/login
```

Admin access requires:

1. Firebase Auth account exists.
2. Firestore document exists:

```txt
users/{uid}
```

3. The Firestore document has:

```json
{
  "role": "admin"
}
```

If the admin signs in successfully:

- Login routes to `/admin`.
- `AuthGuard role="admin"` permits the admin dashboard.
- Firestore rules permit admin realtime reads.

## 21. Creating an Admin

Script:

```txt
scripts/create-admin.mjs
```

Command:

```bash
npm run admin:create -- admin@example.com StrongPassword123 "Research Admin"
```

The script:

1. Uses Firebase Admin SDK.
2. Creates or updates a Firebase Auth user.
3. Sets email/password.
4. Sets display name.
5. Sets Firebase custom claims:

```json
{
  "role": "admin"
}
```

6. Writes Firestore profile:

```txt
users/{uid}
```

with:

```json
{
  "role": "admin"
}
```

## 22. Admin Dashboard Flow

Files:

```txt
frontend/app/admin/page.tsx
frontend/components/admin/admin-dashboard.tsx
frontend/hooks/useAdmin.ts
```

The admin dashboard displays:

- User count.
- Attempt count.
- Realtime leaderboard count.
- Active monitored profiles.
- Latest attempts table.
- Links to datasets, users, analytics, leaderboard, settings, and CSV export.

Admin data uses Firestore realtime listeners:

```ts
onSnapshot(...)
```

Collections monitored:

```txt
users
quiz_attempts
ai_models
leaderboard
```

When a doctor submits:

1. `/api/submit-quiz` writes `quiz_attempts`.
2. Firestore sends realtime update.
3. Admin dashboard updates without refresh.

## 23. Admin Users Page

Files:

```txt
frontend/app/admin/users/page.tsx
frontend/components/admin/users-table.tsx
```

The users page shows:

- User name.
- Email.
- Role.
- University.
- Governorate.
- Academic stage.
- Years of experience.
- Quiz completion state.

Admins can change a user role through:

```txt
frontend/lib/functions.ts
backend/functions/src/setAdminRole.ts
```

The Cloud Function:

1. Verifies caller is admin.
2. Sets Firebase custom claims.
3. Updates Firestore user role.
4. Adds an audit log.

## 24. Admin Dataset Page

Files:

```txt
frontend/app/admin/datasets/page.tsx
frontend/components/admin/dataset-manager.tsx
```

The dataset page explains the static dataset workflow.

The validation dataset is not uploaded at runtime.

The production dataset is bundled into:

```txt
frontend/public/dataset
```

This makes the app work after Vercel deployment without a local upload server.

## 25. Admin Analytics Page

Files:

```txt
frontend/app/admin/analytics/page.tsx
frontend/components/analytics/analytics-charts.tsx
backend/functions/src/analytics.ts
```

Analytics include:

- Average human score.
- Average AI score.
- Top doctor score.
- Hardest question.
- Easiest question.
- Accuracy distribution.
- Time analysis.
- Confusion matrix.

Charts use Recharts.

Note: if scoring format changes, analytics logic must match the stored attempt structure.

## 26. CSV Export Flow

Files:

```txt
frontend/components/admin/export-button.tsx
frontend/app/api/admin/export/route.ts
```

When admin clicks export:

1. Browser calls `/api/admin/export`.
2. Server verifies Firebase session cookie.
3. Server reads `users/{uid}`.
4. Server confirms `role === "admin"`.
5. Server queries `quiz_attempts`.
6. Server returns CSV.

CSV includes:

- attemptId
- userId
- userName
- university
- totalScore
- totalQuestions
- accuracy
- timeTaken
- startedAt
- finishedAt

Normal doctors cannot export CSV.

## 27. Firestore Security Rules

File:

```txt
firestore.rules
```

Rules define:

```txt
isSignedIn()
isOwner(uid)
isAdmin()
```

Admin permissions:

- Read all users.
- Read all quiz attempts.
- Manage questions.
- Manage analytics.
- Manage settings.
- Manage AI models.
- Manage leaderboard entries.

Doctor permissions:

- Read own profile.
- Create/update allowed own profile fields.
- Read own quiz result.
- Read public leaderboard.

Important protection:

- Doctors cannot directly write scored quiz attempts.
- Doctors cannot directly write leaderboard scores.
- Scoring and attempt creation happen through server Admin SDK.

## 28. Firebase Admin SDK Environment

Server-side admin routes require:

```txt
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

These must exist locally and in Vercel environment variables.

They are required for:

- Creating secure session cookies.
- Reading admin profile server-side.
- Saving onboarding profiles.
- Scoring quiz attempts.
- Exporting CSV.

Never commit real private keys into Git.

If a service account key is exposed, rotate it in Google Cloud Console.

## 29. Firebase Client Environment

Frontend Firebase SDK requires:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION
```

These are safe to expose as public client config.

They must be configured in:

```txt
frontend/.env.local
Vercel Environment Variables
```

## 30. Firebase Console Setup

Before production use:

1. Open Firebase Console.
2. Go to Authentication.
3. Enable Email/Password.
4. Enable Google if Gmail login is needed.
5. Add authorized domains:
   - `localhost`
   - your Vercel domain
6. Go to Firestore.
7. Create/enable Firestore database.
8. Deploy Firestore rules.
9. Deploy Cloud Functions if using admin role management functions.

## 31. Deployment Flow

### 31.1 Install dependencies

```bash
npm install
```

### 31.2 Build frontend

```bash
npm run build
```

### 31.3 Typecheck

```bash
npm run typecheck
```

If `typecheck` complains about missing `.next/types`, run `npm run build` first.

### 31.4 Build Firebase Functions

```bash
npm --workspace backend/functions run build
```

### 31.5 Deploy Firebase rules and functions

```bash
npm run firebase:login
npm run firebase:deploy
```

### 31.6 Deploy frontend to Vercel

Vercel uses:

```txt
vercel.json
```

Current Vercel config:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm --workspace frontend run build",
  "devCommand": "npm --workspace frontend run dev",
  "framework": "nextjs",
  "outputDirectory": "frontend/.next"
}
```

Add all required environment variables in Vercel before deploying.

## 32. Current Real Accounts

The current Firebase project has these test accounts created:

```txt
Admin:
admin.noha.team@example.com
Name: Dr Noha's Team

Doctors:
doctor.ahmed.test@example.com
Name: Abdelrhman Ameen

doctor.mariam.test@example.com
Name: Mariam

doctor.omar.test@example.com
Name: Ahmed
```

Do not put real production passwords in documentation.

## 33. Data Storage Summary

Images:

```txt
frontend/public/dataset
```

Doctor/admin accounts:

```txt
Firebase Authentication
```

Profiles:

```txt
Firestore users
```

Quiz attempts:

```txt
Firestore quiz_attempts
```

Leaderboard:

```txt
Firestore leaderboard
```

AI models:

```txt
Firestore ai_models
```

Analytics:

```txt
Computed from Firestore attempts/questions/models
```

CSV export:

```txt
Generated by secure Next.js API route
```

## 34. End-To-End Doctor Journey

1. Doctor opens `/`.
2. Doctor clicks start benchmark.
3. Doctor logs in or registers with Firebase Auth.
4. If profile missing, doctor goes to `/onboarding`.
5. Doctor fills demographic data.
6. Server saves `users/{uid}` with `role: "doctor"`.
7. Doctor goes to `/quiz`.
8. App loads 20 radiographs.
9. Doctor selects disease findings and tooth numbers.
10. Doctor checks answers and sees AI/reference feedback.
11. Doctor submits final attempt.
12. Server verifies identity.
13. Server scores answers.
14. Server writes `quiz_attempts/{uid}_dataset_v1`.
15. Server updates `users/{uid}.hasCompletedQuiz = true`.
16. Server writes leaderboard entry.
17. Doctor goes to `/quiz/result`.
18. Doctor sees score, rank, percentile, AI comparison, and leaderboard preview.

## 35. End-To-End Admin Journey

1. Admin account is created with `scripts/create-admin.mjs`.
2. Admin opens `/login`.
3. Admin signs in with Firebase email/password.
4. Server creates secure session cookie.
5. Auth provider loads `users/{uid}`.
6. `AuthGuard role="admin"` allows `/admin`.
7. Admin dashboard subscribes to Firestore with `onSnapshot`.
8. Admin sees users and attempts update live.
9. Admin can open users, datasets, analytics, leaderboard, and settings pages.
10. Admin can export CSV.
11. CSV route verifies admin role server-side before returning data.

## 36. Common Failure Points

### Firebase Authentication not enabled

Symptoms:

```txt
auth/configuration-not-found
auth/operation-not-allowed
```

Fix:

- Enable Email/Password.
- Enable Google if needed.

### Firestore API disabled

Symptoms:

```txt
Cloud Firestore API has not been used or is disabled
```

Fix:

- Enable Firestore API in Google Cloud/Firebase.
- Create Firestore database.

### Missing Firebase Admin env vars

Symptoms:

```txt
Missing Firebase Admin environment variables
Server scoring requires Firebase Admin SDK environment variables on Vercel
```

Fix:

- Add `FIREBASE_PROJECT_ID`.
- Add `FIREBASE_CLIENT_EMAIL`.
- Add `FIREBASE_PRIVATE_KEY`.

### Admin can login but cannot see realtime data

Cause:

- The user is not actually `role: "admin"` in Firestore.
- Firestore rules are not deployed.
- Browser is signed into the wrong account.

Fix:

- Check `users/{uid}.role`.
- Deploy rules.
- Sign out and sign back in.

### Google login fails after deployment

Cause:

- Vercel domain is not in Firebase authorized domains.

Fix:

- Firebase Console > Authentication > Settings > Authorized domains.

## 37. Security Notes

Important:

- Do not expose service account private keys.
- Do not commit `.env.local`.
- Rotate any exposed service account key.
- Do not re-add local cookie-only admin authentication.
- Do not let doctors directly write quiz attempts or leaderboard entries.
- Keep scoring server-side.
- Keep reference answers server-side.
- Use Firebase Auth and Firestore rules together.

## 38. Verification Commands

Run these before deployment:

```bash
npm run build
npm run typecheck
npm --workspace backend/functions run build
```

Deploy Firebase:

```bash
npm run firebase:deploy
```

Run locally:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

