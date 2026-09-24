import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function TermsPage() {
  return (
    <div className="seo-page-container">
      <SEOHead
        title="Terms of Service — ResumeAI"
        description="Review the terms and conditions governing the use of ResumeAI's resume generation and career assistant services."
        canonicalPath="/terms"
        robots="index, follow"
      />

      <header className="seo-page-header">
        <h1 className="seo-h1">Terms of Service</h1>
        <p className="seo-subtitle">Last updated: September 2026</p>
      </header>

      <div className="legal-content-card">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using ResumeAI, you agree to comply with these terms of service and all applicable laws and regulations.
        </p>

        <h2>2. Use of Generated Content</h2>
        <p>
          You retain full ownership of the personal content you input and the resulting resume documents generated. You are responsible for ensuring that the information on your resume is accurate and truthful.
        </p>

        <h2>3. Service Availability</h2>
        <p>
          We strive for 99.9% uptime for our AI career studio. Scheduled maintenance and feature upgrades are communicated transparently.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link to="/" className="btn btn-ghost">← Return to Home</Link>
        </div>
      </div>
    </div>
  )
}
