# Research Protocol

Purpose: externally validate dentist diagnostic performance against the AI model on a fixed dental radiograph benchmark.

Dataset:

- Version: `dataset_v1`
- Size: 20 images
- Classes: Cavity, Fillings, Implant, Impacted Tooth
- Static image path: `frontend/public/dataset/case{n}.jpg`

Participant workflow:

1. Doctor signs in with Google or email/password.
2. Doctor completes onboarding fields: name, university, country, governorate/government area, specialty, years of experience, and academic stage such as student or graduate.
3. Doctor completes one randomized quiz attempt.
4. Each response records selected answer, confidence, and time spent.
5. Cloud Functions calculate score, accuracy, rank, percentile, and leaderboard position.

Admin workflow:

1. Upload or replace images.
2. Edit metadata and answer keys.
3. Activate exactly 20 questions for the active dataset.
4. Manage users and roles.
5. Review analytics and export CSV.

Answer-key policy:

- `correctAnswer` is stored only in the admin-protected `questions` collection.
- The doctor client receives sanitized questions and cannot read answer keys.
- Scoring is performed by Firebase Cloud Functions or by the Next.js `/api/submit-quiz` route using the same server-only answer-key policy.
- Submitted demographics are stored in Firestore `users`.
- Submitted validation responses and scores are stored in Firestore `quiz_attempts`.
