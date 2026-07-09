import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FormCard } from '../components/FormCard'

export default function PollCreatedPage() {
  const { id } = useParams<{ id: string }>()
  const shareUrl = `${window.location.origin}/polls/${id}`
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for non-secure contexts
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <FormCard title="🎉 הסקר נוצר!">
      <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
        שתף את הלינק הבא כדי שאנשים יוכלו להצביע:
      </p>
      <div className="share-box">
        <span>{shareUrl}</span>
        <button type="button" onClick={copyLink}>
          {copied ? '✓ הועתק' : 'העתק'}
        </button>
      </div>
      <Link to="/create" className="alt-link" style={{ display: 'block', marginTop: '1.5rem' }}>
        + צור סקר נוסף
      </Link>
    </FormCard>
  )
}
