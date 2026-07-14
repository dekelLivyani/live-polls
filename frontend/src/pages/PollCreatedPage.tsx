import { useParams, Link } from 'react-router-dom'
import { FormCard } from '@/components/shared/FormCard'
import { ShareBox } from '@/components/shared/ShareBox'
import { useCopyLink } from '@/hooks'

export default function PollCreatedPage() {
  const { id } = useParams<{ id: string }>()
  const shareUrl = `${window.location.origin}/polls/${id}`
  const { copied, copy } = useCopyLink(shareUrl)

  return (
    <FormCard title="🎉 Poll created!">
      <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
        Share this link so people can vote:
      </p>
      <ShareBox url={shareUrl} copied={copied} onCopy={copy} />
      <Link to="/create" className="alt-link" style={{ display: 'block', marginTop: '1.5rem' }}>
        + Create another poll
      </Link>
    </FormCard>
  )
}
