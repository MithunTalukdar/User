import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Icon from '../components/Icon'

export default function CoverLetterBuilderPage() {
  return (
    <div className="seo-page-container">
      <SEOHead
        title="AI Cover Letter Builder — Tailored & Compelling Letters in Seconds"
        description="Craft job-specific, persuasive cover letters tailored to your target company and job title with AI. Stand out to hiring managers."
        canonicalPath="/cover-letter-builder"
      />

      <header className="seo-page-header">
        <div className="seo-badge">
          <Icon name="sparkles" size={14} />
          <span>Automated Job Applications</span>
        </div>
        <h1 className="seo-h1">AI Cover Letter Builder & Generator</h1>
        <p className="seo-subtitle">
          Transform your career achievements into compelling, customized cover letters that get you noticed by recruiters.
        </p>
      </header>

      <section className="seo-content-block">
        <div className="seo-steps-grid">
          <div className="seo-step-card">
            <span className="seo-step-badge">Step 1</span>
            <h3>Provide Your Background</h3>
            <p>Input your skills, key achievements, and target job title into the studio.</p>
          </div>
          <div className="seo-step-card">
            <span className="seo-step-badge">Step 2</span>
            <h3>AI Crafts Your Letter</h3>
            <p>Our algorithms generate an introduction, value proposition, and closing pitch tailored to your industry.</p>
          </div>
          <div className="seo-step-card">
            <span className="seo-step-badge">Step 3</span>
            <h3>1-Click Polish & Export</h3>
            <p>Refine tone to be assertive, professional, or creative, and export straight to PDF or Word DOCX.</p>
          </div>
        </div>
      </section>

      <section className="seo-content-block">
        <h2>What Makes a Great Cover Letter?</h2>
        <div className="seo-features-3col">
          <div className="seo-feature-box">
            <div className="seo-feat-icon">🔥</div>
            <h3>Hook the Reader Fast</h3>
            <p>Engaging opening paragraphs that highlight your strongest metric or achievement right away.</p>
          </div>
          <div className="seo-feature-box">
            <div className="seo-feat-icon">🎯</div>
            <h3>Company Alignment</h3>
            <p>Demonstrates deep understanding of the employer’s problems and how your skills solve them.</p>
          </div>
          <div className="seo-feature-box">
            <div className="seo-feat-icon">🚀</div>
            <h3>Clear Call to Action</h3>
            <p>Polite, confident closing statements that invite the recruiter for an initial interview call.</p>
          </div>
        </div>
      </section>

      <div className="seo-cta-banner">
        <h2>Generate your tailored cover letter now</h2>
        <p>Join thousands of job seekers landing interviews with ResumeAI.</p>
        <div className="seo-cta-buttons">
          <Link to="/resume-builder" className="btn btn-primary">
            <Icon name="wand" size={16} />
            Generate Cover Letter
          </Link>
          <Link to="/resume-templates" className="btn btn-ghost">
            View Resume Templates →
          </Link>
        </div>
      </div>
    </div>
  )
}
