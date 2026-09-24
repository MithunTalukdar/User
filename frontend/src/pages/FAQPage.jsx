import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import Icon from '../components/Icon'

export const FAQ_ITEMS = [
  {
    q: 'What is an AI Resume Builder and how does it work?',
    a: 'An AI Resume Builder is an intelligent career platform powered by advanced natural language processing. It analyzes your career details, skills, and target job roles to write tailored, ATS-friendly resumes, professional HR summaries, cover letters, and interview talking points in seconds.',
  },
  {
    q: 'How does ResumeAI ensure my resume passes ATS (Applicant Tracking Systems)?',
    a: 'ResumeAI optimizes industry-standard keywords, clean formatting, and punchy action verbs tailored to your seniority level (Beginner, Mid, Senior). This ensures applicant tracking algorithms parse your experience accurately without formatting errors.',
  },
  {
    q: 'What career document formats can I generate with ResumeAI?',
    a: 'ResumeAI generates 12+ distinct career documents simultaneously: Professional HR Summaries, Resume Summaries, About Me bios, Professional Bios, Self Introductions, Interview Pitches, LinkedIn Summaries, ATS Resume Paragraphs, Cover Letters, Email Introductions, Skill Descriptions, and Career Objectives.',
  },
  {
    q: 'Can I export my resume to PDF and Microsoft Word DOCX?',
    a: 'Yes! You can export your generated resume kit directly into clean, recruiter-ready PDF and editable Microsoft Word (.docx) formats with a single click.',
  },
  {
    q: 'How can the AI Assistant Coach help me prepare for job interviews?',
    a: 'The built-in AI Assistant Coach acts as your 24/7 career mentor. You can ask it to generate mock interview questions, help explain career gaps, refine your LinkedIn headline, or tailor your elevator pitch for specific companies.',
  },
  {
    q: 'Is my personal career data safe and private?',
    a: 'Absolutely. We adhere to strict data privacy standards. Your personal profile and saved resumes are encrypted and never shared with third-party recruiters without your explicit consent.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a,
      },
    })),
  }

  return (
    <div className="seo-page-container">
      <SEOHead
        title="Frequently Asked Questions (FAQ) — AI Resume Builder"
        description="Find answers to common questions about AI resume generation, ATS optimization, cover letters, interview coaching, and PDF/DOCX exports."
        canonicalPath="/faq"
        schema={faqSchema}
      />

      <header className="seo-page-header">
        <div className="seo-badge">
          <Icon name="helpCircle" size={14} />
          <span>Knowledge Base & FAQs</span>
        </div>
        <h1 className="seo-h1">Frequently Asked Questions</h1>
        <p className="seo-subtitle">
          Everything you need to know about crafting world-class resumes and accelerating your career with ResumeAI.
        </p>
      </header>

      <div className="faq-accordion-wrap">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <div key={item.q} className={`faq-card ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                aria-expanded={isOpen}
              >
                <span className="faq-q-text">{item.q}</span>
                <Icon name="chevronDown" size={18} className="faq-chev" />
              </button>
              {isOpen && (
                <div className="faq-answer-body">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="seo-cta-banner">
        <h2>Ready to build your standout resume?</h2>
        <p>Start crafting your professional resume and HR summaries in less than 2 minutes.</p>
        <div className="seo-cta-buttons">
          <Link to="/resume-builder" className="btn btn-primary">
            <Icon name="sparkles" size={16} />
            Launch AI Resume Builder
          </Link>
          <Link to="/resume-templates" className="btn btn-ghost">
            Browse Sample Templates →
          </Link>
        </div>
      </div>
    </div>
  )
}
