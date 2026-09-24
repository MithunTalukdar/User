import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Icon from '../components/Icon'

export default function NotFoundPage() {
  return (
    <div className="seo-page-container not-found-page">
      <SEOHead
        title="404 — Page Not Found | ResumeAI"
        description="The page you are looking for does not exist or has been moved."
        canonicalPath="/404"
        robots="noindex, nofollow"
      />

      <div className="not-found-card">
        <div className="not-found-icon-halo">
          <img src="/logo-icon.png" alt="ResumeAI" className="not-found-logo" />
        </div>
        <span className="error-code-badge">404 ERROR</span>
        <h1 className="seo-h1">Page Not Found</h1>
        <p className="seo-subtitle">
          The page you requested could not be found. It may have been moved, renamed, or temporarily unavailable.
        </p>

        <div className="not-found-links">
          <h3>Popular Destinations:</h3>
          <div className="not-found-pills">
            <Link to="/resume-builder" className="btn btn-primary">
              <Icon name="sparkles" size={15} />
              AI Resume Builder
            </Link>
            <Link to="/resume-templates" className="btn">
              <Icon name="file" size={15} />
              Resume Templates
            </Link>
            <Link to="/career-assistant" className="btn">
              <Icon name="chat" size={15} />
              Career Assistant
            </Link>
            <Link to="/faq" className="btn">
              <Icon name="helpCircle" size={15} />
              FAQ & Guides
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Link to="/" className="btn btn-ghost">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
