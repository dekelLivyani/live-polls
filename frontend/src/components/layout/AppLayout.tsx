import { Navbar } from './Navbar'

type Props = { children: React.ReactNode }

export function AppLayout({ children }: Props) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">{children}</main>
    </div>
  )
}
