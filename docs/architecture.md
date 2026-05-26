# Architecture

The platform is a monorepo rooted at `WebSite`.

- `frontend`: Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style UI components, Firebase client SDK, Vercel deployment.
- `backend/functions`: Firebase Cloud Functions for sanitized quiz delivery, server-side scoring, duplicate-attempt prevention, analytics, role changes, and CSV export.
- `frontend/public/dataset`: fixed 20-case static validation radiograph set for Vercel deployment.
- `firestore.rules`: production database security rules.
- `datasets/metadata`: curated 20-question validation metadata and example Firestore documents.

Security boundary:

- Doctors never read `questions/{id}` directly because it contains `correctAnswer`.
- Doctors call `getQuizQuestions`, which strips `correctAnswer`.
- Doctors submit selections to `submitQuiz`; the function reads the protected answer key and writes `quiz_attempts`.
- In the static local/Vercel path, doctors submit to `/api/submit-quiz`; the API route reads the server-only static answer key and writes `quiz_attempts` to Firestore.
- Admin pages use Firestore directly, and Firestore rules require `users/{uid}.role == "admin"`.
- Dataset images are static assets under `frontend/public/dataset/`.

Research grounding:

- The validation benchmark follows the paper's four-condition radiograph diagnosis task: Cavity, Fillings, Implant, and Impacted Tooth.
- The AI baseline defaults to the DeiT + CoAtNet cross-attention fusion model with stacking classifier metrics: 96% accuracy, 96.5% precision, 96.1% sensitivity, 96.4% specificity, 96.3% DSC, and 0.979 AUC.
- Doctor onboarding captures demographics for subgroup analysis: country, governorate/government area, university, years of experience, specialty, and academic stage.
