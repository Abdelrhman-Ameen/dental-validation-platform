# API And Functions

## Firebase Callable Functions

- `getQuizQuestions`: authenticated users receive randomized active questions without `correctAnswer`.
- `submitQuiz`: doctors submit answers, confidence, timing, and device metadata. Scores are calculated server-side.
- `refreshLeaderboard`: admins rebuild leaderboard entries.
- `getAnalytics`: admins receive aggregate score, time, question difficulty, and confusion matrix data.
- `setUserRole`: admins assign `admin` or `doctor` roles and custom claims.
- `exportAttemptsCsv`: admins export scored attempt data.

## Next.js Route Handlers

- `POST /api/auth/session`: verifies Firebase ID token and sets secure `__session` and `role` cookies for middleware.
- `POST /api/auth/logout`: clears session cookies.
- `GET /api/questions`: server-side sanitized question endpoint for authenticated sessions.
- `GET /api/leaderboard`: server-side leaderboard endpoint for authenticated sessions.
- `GET /api/admin/export`: admin CSV export route for Vercel.
- `POST /api/submit-quiz`: intentionally rejects direct scoring; scoring belongs to Cloud Functions.
