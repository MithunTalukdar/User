import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Icon from '../components/Icon'

export default function AboutPage() {
  return (
    <div className="seo-page-container">
      <SEOHead
        title="About ResumeAI — Mission, Technology & Team"
        description="Learn about ResumeAI, our mission to democratize career growth with advanced Google AI technology, and how we help job seekers land dream roles."
        canonicalPath="/about"
      />

      <header className="seo-page-header">
        <div className="seo-badge">
          <Icon name="sparkles" size={14} />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="seo-h1">Empowering Careers with Generative AI</h1>
        <p className="seo-subtitle">
          We build intuitive AI tools that turn complex career histories into compelling resumes, recruiter summaries, and interview narratives.
        </p>
      </header>

      <section className="seo-content-block">
        <div className="about-grid">
          <div className="about-text-card">
            <h2>The Challenge with Traditional Resumes</h2>
            <p>
              Job applications are increasingly scanned by automated Applicant Tracking Systems (ATS) and overwhelmed HR managers who spend less than 6 seconds per resume. Talented professionals often miss out because of poor formatting or missing keywords.
            </p>
            <h2>Our AI Solution</h2>
            <p>
              ResumeAI bridges this gap by applying modern LLM technology to analyze job requirements, synthesize achievements, and craft 12+ tailored career documents in real time.
            </p>
          </div>
          <div className="about-stats-card">
            <div className="stat-item">
              <span className="stat-num">12+</span>
              <span className="stat-label">AI Output Formats</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">90%+</span>
              <span className="stat-label">ATS Keyword Match Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">&lt; 2 min</span>
              <span className="stat-label">Average Creation Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Privacy & Data Control</span>
            </div>
          </div>
        </div>
      </section>

      <div className="seo-cta-banner">
        <h2>Start building your standout resume today</h2>
        <p>No credit card required. Free to build and export.</p>
        <div className="seo-cta-buttons">
          <Link to="/resume-builder" className="btn btn-primary">
            Get Started Now
          </Link>
          <Link to="/faq" className="btn btn-ghost">
            Read Our FAQs →
          </Link>
        </div>
      </div>
    </div>
  )
}
