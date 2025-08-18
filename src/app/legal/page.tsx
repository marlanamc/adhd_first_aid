import { LegalPageClient } from './LegalPageClient'
import { getTermsOfService, getPrivacyPolicy, renderMarkdown } from '@/lib/legal'

export default async function LegalPage() {
  const [termsDocument, privacyDocument] = await Promise.all([
    getTermsOfService(),
    getPrivacyPolicy()
  ])

  // Process markdown on server side
  const processedTerms = {
    ...termsDocument,
    sections: termsDocument.sections.map(section => ({
      ...section,
      content: renderMarkdown(section.content)
    }))
  }

  const processedPrivacy = {
    ...privacyDocument,
    sections: privacyDocument.sections.map(section => ({
      ...section,
      content: renderMarkdown(section.content)
    }))
  }

  return (
    <LegalPageClient 
      termsDocument={processedTerms}
      privacyDocument={processedPrivacy}
    />
  )
}