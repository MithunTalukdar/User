import { useEffect } from 'react'

const DEFAULT_DOMAIN = 'https://myjobmekar.vercel.app'

export default function SEOHead({
  title = 'AI Resume Builder — Professional Resume Content Generator',
  description = 'Generate professional HR summaries, cover letters, LinkedIn summaries, career objectives, and ATS resumes in seconds with Google AI. Build, refine, and export your resume.',
  canonicalPath = '',
  robots = 'index, follow',
  ogType = 'website',
  ogImage = '/og-image.png',
  schema = null,
}) {
  useEffect(() => {
    // Determine canonical absolute URL
    const siteUrl = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost'))
      ? window.location.origin
      : DEFAULT_DOMAIN
    
    const canonicalUrl = `${siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`

    // 1. Update Title
    document.title = title

    // Helper to set/create meta tag
    const setMeta = (attr, key, content) => {
      let elem = document.querySelector(`meta[${attr}="${key}"]`)
      if (!elem) {
        elem = document.createElement('meta')
        elem.setAttribute(attr, key)
        document.head.appendChild(elem)
      }
      elem.setAttribute('content', content)
    }

    // 2. Standard Meta Tags
    setMeta('name', 'description', description)
    setMeta('name', 'robots', robots)

    // 3. Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]')
    if (!canonicalTag) {
      canonicalTag = document.createElement('link')
      canonicalTag.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalTag)
    }
    canonicalTag.setAttribute('href', canonicalUrl)

    // 4. Open Graph Meta Tags
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', 'ResumeAI — AI Resume Builder')
    setMeta('property', 'og:image', fullOgImage)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('property', 'og:image:alt', 'ResumeAI - AI Resume & Career Studio Preview')

    // 5. Twitter/X Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', fullOgImage)
    setMeta('name', 'twitter:image:alt', 'ResumeAI - AI Resume & Career Studio Preview')

    // 6. JSON-LD Structured Data
    const baseSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'ResumeAI',
        'alternateName': 'AI Resume Builder & Career Studio',
        'url': siteUrl,
        'description': 'AI-powered resume generator creating ATS-friendly summaries, cover letters, and interview prep in seconds.',
        'publisher': {
          '@type': 'Organization',
          'name': 'ResumeAI Inc.',
          'url': siteUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': `${siteUrl}/logo-icon.png`,
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'ResumeAI Career Studio',
        'url': siteUrl,
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web, All Modern Browsers',
        'browserRequirements': 'Requires JavaScript',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
        },
        'featureList': [
          '12+ AI Output Content Types',
          'Professional HR Summary Generator',
          'ATS Resume Paragraphs',
          'AI Cover Letter Builder',
          'Interactive AI Interview Coach Chat',
          '1-Click PDF and DOCX Export',
        ],
      },
    ]

    // Breadcrumb schema
    if (canonicalPath && canonicalPath !== '/') {
      const pathSegment = canonicalPath.replace('/', '')
      const cleanTitle = pathSegment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      baseSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': siteUrl,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': cleanTitle,
            'item': canonicalUrl,
          },
        ],
      })
    }

    // Additional page-specific schemas (e.g. FAQPage)
    if (schema) {
      if (Array.isArray(schema)) {
        baseSchemas.push(...schema)
      } else {
        baseSchemas.push(schema)
      }
    }

    // Inject Script Tag
    let scriptTag = document.querySelector('script#json-ld-schema')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.setAttribute('id', 'json-ld-schema')
      scriptTag.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(baseSchemas.length === 1 ? baseSchemas[0] : baseSchemas)

  }, [title, description, canonicalPath, robots, ogType, ogImage, schema])

  return null
}
