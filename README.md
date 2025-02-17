# JavaScript & Chill 🚀

This is an **Open Source** blogging platform built with **Next.js**, **Firebase**, and **Tailwind CSS**. Nova Devs has designed this project to offer an intuitive and efficient way to create, edit, and manage articles with Markdown, including images and rich formatting. 📝🖼️

## 🌟 Features

- **User Authentication** 🔐: Sign up, log in, and manage accounts with Firebase Authentication.
- **Article Management** ✍️: Create, edit, update, and delete blog posts effortlessly.
- **Markdown Support** 📜: Render Markdown files dynamically for easy content formatting.
- **Comment System** 💬: Users can comment on posts with their username and profile picture.
- **Upvotes & Downvotes** 👍👎: Engage with comments through an interactive voting system.
- **Search & Filtering** 🔍: Find articles quickly using advanced search and filtering options.
- **Fully Customizable** 🎨: Open-source project, so anyone can use, modify, and extend it!

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/novadevseu/blog-nova-devs.git
cd nova-devs-blog
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Create a `.env` file in the root directory and configure your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the project in your browser.

## 🔧 Dependencies

This project relies on the following key dependencies:

- **Next.js** ⚛️: React framework for building fast and scalable web apps.
- **React** 💙: JavaScript library for UI development.
- **Tailwind CSS** 🎨: Utility-first CSS framework for styling.
- **Firebase** 🔥: Authentication and data management.
- **React Markdown** 📝: Render Markdown dynamically within the blog.

## 📝 Markdown Rendering

We use `react-markdown` to enable dynamic Markdown rendering within our blog posts, allowing users to format content efficiently with headings, lists, code snippets, and more.

## 🔥 Firebase Integration

Firebase powers authentication, post management, and the commenting system. Each user has a unique profile, and posts are stored securely in Firebase Firestore.

## 🏗️ Deployment

Deploying this app is seamless with [Vercel](https://vercel.com/), the creators of Next.js.

Check out our [deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎉 Open Source

Nova Devs Blog is **fully open source**, meaning anyone can clone, modify, and use it however they wish. Whether you want to enhance the functionality, integrate it into another project, or just explore its features, you are welcome to contribute! 🤗✨

Happy coding! 🚀
