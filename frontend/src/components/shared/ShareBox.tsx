type Props = {
  url: string
  copied: boolean
  onCopy: () => void
}

export function ShareBox({ url, copied, onCopy }: Props) {
  return (
    <div className="share-box">
      <span>{url}</span>
      <button type="button" onClick={onCopy}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )
}
