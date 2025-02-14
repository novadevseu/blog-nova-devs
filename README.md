# Nova Devs Blog

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It uses [Tailwind CSS](https://tailwindcss.com) for styling and [Firebase](https://firebase.google.com) for authentication and data management. The project consists of the front-end of a functional blog with authentication, posts, and comments.

## Getting Started

First, clone the repository:

```bash
git clone ${url}
cd nova-devs-blog
```

Then, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Create a `.env` file in the root of the project and add the following environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Dependencies

This project uses the following main dependencies:

- `next`: React framework for web applications.
- `react`: JavaScript library for building user interfaces.
- `tailwindcss`: CSS framework for rapid and efficient design.
- `firebase`: Platform for web and mobile application development, used here for authentication and data management.
- `react-markdown`: Library to render Markdown in React components.

## Rendering with React Markdown

We use the `react-markdown` library to render Markdown content within our React components. This allows us to easily display formatted text, code snippets, and other Markdown elements in our blog posts.

## Firebase Integration

Firebase is used for authentication and data management in this project. We utilize Firebase Authentication to handle user sign-up, login, and logout functionalities. Firebase Firestore is used to store and retrieve blog posts and comments. The environment variables required for Firebase configuration are specified in the `.env` file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
