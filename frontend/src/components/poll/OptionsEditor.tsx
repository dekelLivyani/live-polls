import { OptionRow } from './OptionRow'

type Props = {
  options: string[]
  onUpdate: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

export function OptionsEditor({ options, onUpdate, onAdd, onRemove }: Props) {
  return (
    <>
      <label>Answer options</label>
      {options.map((opt, i) => (
        <OptionRow
          index={i}
          value={opt}
          showRemove={options.length > 2}
          onChange={onUpdate}
          onRemove={onRemove}
        />
      ))}
      <button type="button" className="secondary" onClick={onAdd}>
        + Add option
      </button>
    </>
  )
}
