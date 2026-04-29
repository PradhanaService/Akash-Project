# Code Snippet Manager

A polished developer tool for saving, organizing, searching, viewing, and copying private code snippets. The app uses Firebase only: Firebase Authentication for accounts and Cloud Firestore for user-owned snippet storage.

## Features

- Email/password signup, login, logout, and protected dashboard
- Create, read, update, and delete snippets
- Snippet fields: title, language, code, description, tags, created date, updated date, and user ID
- Search by title, language, or tag
- Filter by programming language and tag
- Sort by newest or oldest
- Syntax-highlighted full-screen code view
- Copy-to-clipboard actions
- Loading, empty, and error states
- Responsive dark developer-style UI built with Tailwind CSS

## Tech Stack

- React + Vite
- Firebase modular SDK
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS
- prism-react-renderer
- React Router
- Lucide React icons

## Screenshots

Add screenshots after running the app locally.

![Login screen placeholder](docs/screenshots/login-placeholder.png)

![Dashboard placeholder](docs/screenshots/dashboard-placeholder.png)

![Full-screen snippet view placeholder](docs/screenshots/snippet-view-placeholder.png)

## Getting Started

Install dependencies:

```bash
npm install
```

Create a Firebase project:

1. Open the Firebase Console.
2. Create a new project.
3. Add a Web app.
4. Enable Authentication with the Email/Password provider.
5. Create a Cloud Firestore database.
6. Copy the Firebase web config values.
7. Publish the Firestore security rules from `firestore.rules`.

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Deploy Firestore rules with the Firebase CLI:

```bash
firebase login
firebase use code-snippet-manager-1ef54
firebase deploy --only firestore:rules
```

You can also paste the contents of `firestore.rules` into Firebase Console > Firestore Database > Rules and click **Publish**.

## Firestore Collections

### `users`

Each user document is stored with the Firebase Auth UID as the document ID.

```js
{
  name: "Ada Lovelace",
  email: "ada@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `snippets`

Each snippet is a document with a `userId` field. The dashboard only queries snippets where `userId` matches the signed-in user.

```js
{
  title: "Debounce helper",
  language: "javascript",
  code: "export function debounce(fn, delay) { ... }",
  description: "Reusable debounce utility for UI events.",
  tags: ["utility", "frontend"],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  userId: "firebase-auth-uid"
}
```

## Firestore Security Rules

The project includes these rules in `firestore.rules`. They keep user profiles and snippets private to the authenticated owner.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }

    match /snippets/{snippetId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;

      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Notes for Interview Demo

- Use the signup flow to create a fresh user.
- Create snippets in multiple languages with tags.
- Demonstrate search, language filtering, tag filtering, sorting, edit, delete, copy, and full-screen view.
- Mention that the app has no backend server; Firebase Auth and Firestore handle identity and persistence.
