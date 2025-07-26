import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  MapPin, 
  Brain, 
  Bell, 
  Calendar,
  ArrowRight,
  Plus,
  Zap,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react'
import blink from '@/blink/client'

interface DashboardProps {
  user: any
}

const mockQueues = [
  {
    id: 'queue_1',
    emoji: "🏥",
    business: "City Medical Center",
    service: "General Consultation",
    position: "#3",
    waitTime: "12 min",
    status: "waiting",
    estimatedTime: "2:45 PM"
  },
  {
    id: 'queue_2',
    emoji: "💇",
    business: "Elite Hair Salon",
    service: "Haircut & Style",
    position: "#1",
    waitTime: "5 min",
    status: "next",
    estimatedTime: "1:30 PM"
  },
  {
    id: 'queue_3',
    emoji: "🔧",
    business: "Quick Fix Auto",
    service: "Oil Change",
    position: "#2",
    waitTime: "18 min",
    status: "waiting",
    estimatedTime: "3:15 PM"
  }
]

const aiRecommendations = [
  {
    icon: MapPin,
    title: "Faster Option Nearby",
    description: "Metro Dental is 3 min away with no wait vs 25 min here",
    action: "View on Map",
    priority: "high"
  },
  {
    icon: Clock,
    title: "Reschedule Suggestion",
    description: "Tomorrow 2 PM has 90% less wait time historically",
    action: "Reschedule",
    priority: "medium"
  },
  {
    icon: Zap,
    title: "Auto-Book Available",
    description: "Enable auto-booking for next cancellation at preferred locations",
    action: "Enable",
    priority: "low"
  }
]

const upcomingAppointments = [
  {
    id: 'apt_1',
    business: "Zen Spa & Wellness",
    service: "Relaxation Massage",
    date: "Today",
    time: "4:00 PM",
    status: "confirmed"
  },
  {
    id: 'apt_2',
    business: "Metro Dental Care",
    service: "Dental Cleaning",
    date: "Tomorrow",
    time: "10:30 AM",
    status: "confirmed"
  },
  {
    id: 'apt_3',
    business: "City Medical Center",
    service: "Follow-up",
    date: "Friday",
    time: "2:15 PM",
    status: "pending"
  }
]

export default function Dashboard({ user }: DashboardProps) {
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({
    activeQueues: 3,
    nextAppointment: "12min",
    nearbyOptions: 8,
    aiAccuracy: "95%"
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        nextAppointment: Math.max(1, parseInt(prev.nextAppointment) - 1) + "min"
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Your <span className="rainbow-text">Smart Queue</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.email?.split('@')[0]}! Manage appointments, track queues, and never wait in uncertainty again.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/booking">
            <Button className="rainbow-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
          <Link to="/assistant">
            <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
              <Brain className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/40 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Queues</p>
                <p className="text-3xl font-bold rainbow-text">{stats.activeQueues}</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Appointment</p>
                <p className="text-3xl font-bold rainbow-text">{stats.nextAppointment}</p>
              </div>
              <Bell className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nearby Options</p>
                <p className="text-3xl font-bold rainbow-text">{stats.nearbyOptions}</p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 hover:border-primary/20 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Predictions</p>
                <p className="text-3xl font-bold rainbow-text">{stats.aiAccuracy}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Live Queue Status */}
        <Card className="border-border/40">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <div className="pulse-rainbow w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                Live Queue Status
              </CardTitle>
              <CardDescription>
                Real-time updates from your active appointments
              </CardDescription>
            </div>
            <Link to="/queue">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockQueues.map((queue) => (
              <div key={queue.id} className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-border/20 hover:border-primary/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{queue.emoji}</div>
                  <div>
                    <p className="font-semibold">{queue.business}</p>
                    <p className="text-sm text-muted-foreground">{queue.service}</p>
                    <p className="text-xs text-muted-foreground">Est. {queue.estimatedTime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={queue.status === 'next' ? 'default' : 'secondary'}
                    className={queue.status === 'next' ? 'rainbow-gradient text-white border-0' : ''}
                  >
                    {queue.position}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{queue.waitTime}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Smart suggestions to optimize your time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border transition-colors hover:border-primary/40 ${
                rec.priority === 'high' ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20' :
                rec.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20' :
                'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <rec.icon className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card className="border-border/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Your scheduled appointments for the next few days
            </CardDescription>
          </div>
          <Link to="/booking">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Book New
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-lg bg-card/40 border border-border/20 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                    {apt.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{apt.date}</span>
                </div>
                <h4 className="font-semibold mb-1">{apt.business}</h4>
                <p className="text-sm text-muted-foreground mb-2">{apt.service}</p>
                <p className="text-sm font-medium rainbow-text">{apt.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/maps" className="block">
          <Card className="border-border/40 hover:border-primary/40 transition-colors cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Find Nearby</h3>
              <p className="text-sm text-muted-foreground">Discover faster options around you</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/queue" className="block">
          <Card className="border-border/40 hover:border-primary/40 transition-colors cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <Activity className="w-8 h-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Queue Tracker</h3>
              <p className="text-sm text-muted-foreground">Monitor all your queues in real-time</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/assistant" className="block">
          <Card className="border-border/40 hover:border-primary/40 transition-colors cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Get help with voice and chat</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin" className="block">
          <Card className="border-border/40 hover:border-primary/40 transition-colors cursor-pointer group">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Admin Panel</h3>
              <p className="text-sm text-muted-foreground">Manage your business operations</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}