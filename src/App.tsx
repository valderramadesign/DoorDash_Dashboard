import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MarketplaceCommandCenter } from '@/features/command-center/MarketplaceCommandCenter'

function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <TopBar />
        <main>
          <MarketplaceCommandCenter />
        </main>
      </div>
    </div>
  )
}

export default App
