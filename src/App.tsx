import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  MapPin, 
  Zap, 
  Users, 
  Brain, 
  Bell, 
  Calendar, 
  Shield,
  Smartphone,
  Globe,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Menu,
  X,
  Home,
  BookOpen,
  Map,
  Settings,
  MessageCircle,
  BarChart3,
  Building2,
  UserPlus
} from 'lucide-react'
import blink from '@/blink/client'

// Import components
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/Dashboard'
import BookingFlow from '@/components/BookingFlow'
import EnhancedBookingFlow from '@/components/EnhancedBookingFlow'
import MapsIntegration from '@/components/MapsIntegration'
import QueueTracker from '@/components/QueueTracker'
import AdminPanel from '@/components/AdminPanel'
import AIAssistant from '@/components/AIAssistant'
import Navigation from '@/components/Navigation'
import WaitlistManager from '@/components/WaitlistManager'
import InsuranceIntegration from '@/components/InsuranceIntegration'
import LoyaltyProgram from '@/components/LoyaltyProgram'
import MLPredictionEngine from '@/components/MLPredictionEngine'
import IndiaFocusedFeatures from '@/components/IndiaFocusedFeatures'
import AdvancedAnalytics from '@/components/AdvancedAnalytics'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="rainbow-animated w-16 h-16 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {user ? (
          <AuthenticatedApp user={user} />
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

function AuthenticatedApp({ user }: { user: any }) {
  return (
    <div className="flex h-screen bg-background">
      <Navigation user={user} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/booking" element={<EnhancedBookingFlow user={user} />} />
          <Route path="/booking-simple" element={<BookingFlow user={user} />} />
          <Route path="/queue" element={<QueueTracker user={user} />} />
          <Route path="/maps" element={<MapsIntegration user={user} />} />
          <Route path="/admin" element={<AdminPanel user={user} />} />
          <Route path="/assistant" element={<AIAssistant user={user} />} />
          <Route path="/waitlist" element={<WaitlistManager user={user} />} />
          <Route path="/insurance" element={<InsuranceIntegration user={user} />} />
          <Route path="/loyalty" element={<LoyaltyProgram user={user} />} />
          <Route path="/ml-engine" element={<MLPredictionEngine user={user} />} />
          <Route path="/international" element={<IndiaFocusedFeatures user={user} />} />
          <Route path="/analytics" element={<AdvancedAnalytics user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App