type Props = {
  value: string
  index: number
  showRemove: boolean
  onChange: (index: number, value: string) => void
  onRemove: (index: number) => void
}

export function OptionRow({ value, index, showRemove, onChange, onRemove }: Props) {
  return (
    <div className="option-row">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Option ${index + 1}`}
      />
      {showRemove && (
        <button type="button" className="remove-btn" onClick={() => onRemove(index)}>
          ✕
        </button>
      )}
    </div>
  )
}
