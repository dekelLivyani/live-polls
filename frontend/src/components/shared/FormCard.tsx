import { ReactNode } from 'react'

type Props = { title: string; children: ReactNode }

export function FormCard({ title, children }: Props) {
  return (
    <div className="card form-card">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
