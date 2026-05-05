import AdminSidebar from '@/components/AdminSidebar'
import ToastContainer from '@/components/ToastContainer'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ink-bg)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
