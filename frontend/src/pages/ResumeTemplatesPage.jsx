import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Icon from '../components/Icon'
import { DEMO_PROFILES } from '../profile.meta'

export default function ResumeTemplatesPage() {
  return (
    <div className="seo-page-container">
      <SEOHead
        title="Professional Resume Templates & Examples — ResumeAI"
        description="Explore curated professional resume examples and templates for Software Engineers, Product Managers, UI/UX Designers, and Marketing Leaders."
        canonicalPath="/resume-templates"
      />

      <header className="seo-page-header">
        <div className="seo-badge">
          <Icon name="wand" size={14} />
          <span>Industry Proven Frameworks</span>
        </div>
        <h1 className="seo-h1">Professional Resume Templates & Samples</h1>
        <p className="seo-subtitle">
          Tested and optimized for top recruiters, Fortune 500 hiring managers, and applicant tracking systems.
        </p>
      </header>

      <div className="templates-grid">
        {DEMO_PROFILES.map((profile) => (
          <article key={profile.id} className="template-card">
            <div className="template-card-header">
              <span className="template-icon">{profile.icon}</span>
              <div>
                <h2>{profile.name}</h2>
                <span className="template-badge">{profile.data.level.toUpperCase()} LEVEL</span>
              </div>
            </div>

            <div className="template-section-preview">
              <h3>Core Skills Highlighted:</h3>
              <p className="template-skills-list">{profile.data.skills}</p>
            </div>

            <div className="template-section-preview">
              <h3>Experience Summary:</h3>
              <p className="template-exp-snippet">{profile.data.experience}</p>
            </div>

            <div className="template-card-footer">
              <Link to="/resume-builder" className="btn btn-primary" style={{ width: '100%' }}>
                <Icon name="sparkles" size={15} />
                Use This Profile Sample
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="seo-content-block">
        <h2>Why Use AI-Generated Resume Templates?</h2>
        <div className="seo-features-3col">
          <div className="seo-feature-box">
            <div className="seo-feat-icon">🎯</div>
            <h3>ATS Keyword Matching</h3>
            <p>Every template is infused with role-specific keywords that increase your ATS match score above 90%.</p>
          </div>
          <div className="seo-feature-box">
            <div className="seo-feat-icon">⚡</div>
            <h3>Dynamic Seniority Tuning</h3>
            <p>Switch between Beginner, Mid-level, and Executive phrasing tailored to your career milestones.</p>
          </div>
          <div className="seo-feature-box">
            <div className="seo-feat-icon">📑</div>
            <h3>12 Synchronized Documents</h3>
            <p>Generate matching cover letters, LinkedIn bios, and elevator pitches matching your resume design.</p>
          </div>
        </div>
      </section>

      <div className="seo-cta-banner">
        <h2>Ready to build your custom resume?</h2>
        <p>Choose any template or create your own from scratch in seconds.</p>
        <div className="seo-cta-buttons">
          <Link to="/resume-builder" className="btn btn-primary">
            Start Building Now
          </Link>
          <Link to="/faq" className="btn btn-ghost">
            Read Resume FAQs →
          </Link>
        </div>
      </div>
    </div>
  )
}
