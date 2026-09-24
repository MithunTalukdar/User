import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function PrivacyPolicyPage() {
  return (
    <div className="seo-page-container">
      <SEOHead
        title="Privacy Policy — ResumeAI"
        description="Learn how ResumeAI protects your career data, handles encryption, and respects your privacy rights."
        canonicalPath="/privacy"
        robots="index, follow"
      />

      <header className="seo-page-header">
        <h1 className="seo-h1">Privacy Policy</h1>
        <p className="seo-subtitle">Last updated: September 2026</p>
      </header>

      <div className="legal-content-card">
        <h2>1. Information We Collect</h2>
        <p>
          We collect personal information that you provide when registering an account and entering career details into our resume builder (such as your name, email address, work experience, education, and skills).
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          Your information is solely used to generate your requested career documents (resumes, HR summaries, cover letters, bios) using generative AI algorithms and to manage your saved drafts.
        </p>

        <h2>3. Data Protection & Security</h2>
        <p>
          We implement industry-standard encryption protocols (TLS/HTTPS in transit and secure database hashing at rest). We do not sell, rent, or distribute your personal career data to third-party advertisers or recruitment agencies.
        </p>

        <h2>4. Your Rights & Deletion</h2>
        <p>
          You have full control over your career data. You can edit or permanently delete your profile drafts and account credentials at any time from your account settings.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link to="/" className="btn btn-ghost">← Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
