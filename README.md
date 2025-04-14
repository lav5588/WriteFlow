# 📝 WriteFlow – A Modern Full-Stack Blogging Platform

WriteFlow is a feature-rich, full-stack blogging application built with **Next.js** that allows users to write, manage, and publish blog content with ease. Designed with a sleek UI using **ShadCN** and **Tailwind CSS**, WriteFlow integrates a powerful rich-text editor (Tiptap) and supports a complete content management workflow including draft saving, publishing, image uploads (ImageKit integration in progress), and more.

Key highlights of WriteFlow:
- 🔐 Auth system using **Auth.js** with **Credential Provider** (including password reset via email)
- 📝 Rich-text editing with **Tiptap**
- 📄 Blog management (Create, Edit, Save as Draft, Publish/Unpublish, Delete)
- 🖼️ Image upload support via **ImageKit** *(in progress)*
- 📧 Password reset via **Resend**
- ⚡ Server-side pagination for scalability
- 🌐 Fully responsive & accessible UI using **ShadCN + Tailwind CSS**
- 🧱 Modular architecture with reusable components

---

## 🚀 Getting Started (Run Locally)

Follow these steps to run WriteFlow on your local machine:

### 1. **Clone the Repository**

```bash
git clone https://github.com/lav5588/WriteFlow
cd writeflow
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory and add the following environment variables:

```env
MONGODB_URI = your_mongodb_connection_url
NEXTAUTH_SECRET = your_nextauth_secret
RESEND_API_KEY = your_resend_api_key
VERIFIED_DOMAIN_ON_RESEND = your_verification_domain

CLOUDINARY_CLOUD_NAME = your_cludinary_name
CLOUDINARY_API_KEY = your_cludinary_api_key
CLOUDINARY_API_SECRET = your_cludinary_api_secret


IMAGEKIT_ID = your_imagekit_id
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = your_imagekit_url_endpoint
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY = your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY = your_imagekit_private_key
```

>⚠️ Make sure to replace these with your actual credentials.

#### **Configure the auth.js environment**
```
 npx auth secret
```

### 4. **Run the Development Server**

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action!

---

## 🧰 Tech Stack

- **Frontend:** Next.js, React.js, Tailwind CSS, ShadCN
- **Authentication:** Auth.js (Credential Provider)
- **Editor:** Tiptap
- **Database:** MongoDB
- **Email Service:** Resend
- **Image Uploads:** ImageKit *(integration in progress)*

---

## 📦 Features in Progress
- 🧹 Blog cleanup and tag categorization
- 📈 Admin dashboard and analytics

---
