# AI Resume Builder

A full-stack application for building, managing, and exporting professional resumes powered by AI. It features a modern, responsive user interface and a robust backend with secure authentication and OTP-based email verification.

## Features

- **User Authentication**: Secure registration and login with JWT, including an OTP-based password reset flow.
- **AI-Powered Resume Generation**: Automatically generate and refine resume content using OpenAI's API.
- **Profile Management**: Save, edit, and manage multiple resume profiles.
- **Export Options**: Export resumes directly to PDF and DOCX formats.
- **Modern UI**: A premium, responsive design with dark mode support.

## Tech Stack

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **Vanilla CSS**: Custom, polished design system without external frameworks

### Backend
- **Node.js & Express**: API server
- **MongoDB**: Database for users and profiles
- **Nodemailer**: Email sending for OTP verification
- **OpenAI**: AI integration for content generation

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- OpenAI API Key (optional, but required for AI features)
- Gmail account with an App Password (for email verification features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MithunTalukdar/User.git
   cd User
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB URI, OpenAI API key, and SMTP credentials.

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You will need two separate terminals to run both the frontend and the backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Environment Variables

The backend requires several environment variables to function correctly. See `server/.env.example` for the required keys.

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure string for signing JWT tokens.
- `SMTP_USER` & `SMTP_PASS`: Credentials for sending OTP emails (e.g., Gmail App Password).
- `OPENAI_API_KEY`: Required for AI generation features.

## License

This project is licensed under the MIT License.
