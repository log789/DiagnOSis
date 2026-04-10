DiagnOSis is an AI-powered healthcare ecosystem that creates a real-time Digital Twin of patients, enabling predictive care, smart medication tracking, and instant telemedicine. It seamlessly connects patients, doctors, and hospitals for faster, smarter, and life-saving decisions.

## Foundation Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Firebase Authentication + Firestore
- Zustand state management

## Project Structure

- `app`
- `components`
- `lib`
- `store`
- `services`
- `types`

## Implemented Foundation

- Firebase email/password auth with registration and login
- Firestore user profile persistence in `users` collection:
  - `uid`
  - `name`
  - `email`
  - `role`
- Role-based dashboards:
  - `patient` -> `/patient/dashboard`
  - `doctor` -> `/doctor/dashboard`
  - `hospital` -> `/hospital/dashboard`
- Middleware route protection using role cookie (`diagnosis-role`)
- Placeholder API routes:
  - `POST /api/future/emergency`
  - `POST /api/future/offline-mode`
  - `POST /api/future/emotion-detection`

## Setup

1. Install Node.js 18+.
2. Install dependencies:
   - `npm install`
3. Copy env template and fill Firebase values:
   - `cp .env.example .env.local` (or create manually on Windows)
4. Run:
   - `npm run dev`

## Notes

- This version intentionally includes **UI placeholders only** for AI modules.
- No n8n integration is included in this phase.
