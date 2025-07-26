import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { 
  Clock, 
  Bell, 
  Zap, 
  Users, 
  Activity,
  Volume2,
  VolumeX,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react'
import blink from '@/blink/client'

interface QueueTrackerProps {
  user: any
}

interface QueueItem {
  id: string
  business: string
  service: string
  emoji: string
  position: number
  totalInQueue: number
  estimatedWaitTime: number
  actualWaitTime?: number
  status: 'waiting' | 'next' | 'in_service' | 'completed' | 'delayed'
  scheduledTime: string
  estimatedStartTime: string
  isEmergency: boolean
  lastUpdated: Date
  notifications: {
    voice: boolean
    push: boolean
    sms: boolean
  }
}

const mockQueueItems: QueueItem[] = [
  {
    id: 'queue_1',
    business: 'City Medical Center',
    service: 'General Consultation',
    emoji: '🏥',
    position: 1,
    totalInQueue: 8,
    estimatedWaitTime: 5,
    status: 'next',
    scheduledTime: '2:30 PM',
    estimatedStartTime: '2:35 PM',
    isEmergency: false,
    lastUpdated: new Date(),
    notifications: { voice: true, push: true, sms: false }
  },
  {
    id: 'queue_2',
    business: 'Elite Hair Salon',
    service: 'Haircut & Style',
    emoji: '💇',
    position: 3,
    totalInQueue: 6,
    estimatedWaitTime: 18,
    status: 'waiting',
    scheduledTime: '3:00 PM',
    estimatedStartTime: '3:18 PM',
    isEmergency: false,
    lastUpdated: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    notifications: { voice: true, push: true, sms: true }
  },
  {
    id: 'queue_3',
    business: 'Quick Fix Auto',
    service: 'Oil Change',
    emoji: '🔧',
    position: 2,
    totalInQueue: 5,
    estimatedWaitTime: 25,
    status: 'delayed',
    scheduledTime: '4:00 PM',
    estimatedStartTime: '4:25 PM',
    isEmergency: false,
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    notifications: { voice: false, push: true, sms: false }
  },
  {
    id: 'queue_4',
    business: 'Metro Dental Care',
    service: 'Emergency Visit',
    emoji: '🦷',
    position: 1,
    totalInQueue: 3,
    estimatedWaitTime: 2,
    status: 'in_service',
    scheduledTime: '1:45 PM',
    estimatedStartTime: '1:47 PM',
    isEmergency: true,
    lastUpdated: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    notifications: { voice: true, push: true, sms: true }
  }
]

export default function QueueTracker({ user }: QueueTrackerProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(mockQueueItems)
  const [globalNotifications, setGlobalNotifications] = useState({
    voice: true,
    push: true,
    sms: false
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueItems(prev => prev.map(item => {
        // Simulate queue movement and time updates
        const newEstimatedWaitTime = Math.max(0, item.estimatedWaitTime - 1)
        let newStatus = item.status
        let newPosition = item.position

        // Simulate status changes
        if (newEstimatedWaitTime <= 2 && item.status === 'waiting') {
          newStatus = 'next'
        }
        if (newEstimatedWaitTime === 0 && item.status === 'next') {
          newStatus = 'in_service'
        }

        // Simulate position changes
        if (Math.random() > 0.8 && item.position > 1) {
          newPosition = Math.max(1, item.position - 1)
        }

        return {
          ...item,
          estimatedWaitTime: newEstimatedWaitTime,
          status: newStatus,
          position: newPosition,
          lastUpdated: new Date()
        }
      }))
      setLastRefresh(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastRefresh(new Date())
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'next': return 'text-green-500'
      case 'in_service': return 'text-blue-500'
      case 'delayed': return 'text-red-500'
      case 'completed': return 'text-gray-500'
      default: return 'text-yellow-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'next': return <Bell className="w-4 h-4" />
      case 'in_service': return <Activity className="w-4 h-4" />
      case 'delayed': return <AlertTriangle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getProgressValue = (item: QueueItem) => {
    const totalEstimated = 30 // Assume 30 minutes total service time
    const remaining = item.estimatedWaitTime
    return Math.max(0, ((totalEstimated - remaining) / totalEstimated) * 100)
  }

  const toggleNotification = (itemId: string, type: 'voice' | 'push' | 'sms') => {
    setQueueItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, notifications: { ...item.notifications, [type]: !item.notifications[type] } }
        : item
    ))
  }

  const handleEmergencyBoost = (itemId: string) => {
    // In a real app, this would send a request to the business
    alert('Emergency boost request sent to business. You will be notified of approval status.')
  }

  const handleReschedule = (itemId: string) => {
    // In a real app, this would open the booking flow
    alert('Opening reschedule options...')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="rainbow-text">Live Queue</span> Tracker
          </h1>
          <p className="text-muted-foreground">
            Real-time updates on all your appointments and queue positions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-primary/20 hover:bg-primary/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Global Notification Settings */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control how you receive queue updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Voice Alerts</p>
                  <p className="text-sm text-muted-foreground">Spoken notifications</p>
                </div>
              </div>
              <Switch 
                checked={globalNotifications.voice} 
                onCheckedChange={(checked) => setGlobalNotifications(prev => ({ ...prev, voice: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser alerts</p>
                </div>
              </div>
              <Switch 
                checked={globalNotifications.push} 
                onCheckedChange={(checked) => setGlobalNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Text messages</p>
                </div>
              </div>
              <Switch 
                checked={globalNotifications.sms} 
                onCheckedChange={(checked) => setGlobalNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Queues */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Queues ({queueItems.length})</h2>
        
        {queueItems.map((item) => (
          <Card key={item.id} className={`border-border/40 transition-all ${
            item.status === 'next' ? 'ring-2 ring-green-500/20 border-green-500/40' :
            item.status === 'delayed' ? 'ring-2 ring-red-500/20 border-red-500/40' :
            item.status === 'in_service' ? 'ring-2 ring-blue-500/20 border-blue-500/40' :
            'hover:border-primary/40'
          }`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Business Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-4xl">{item.emoji}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold">{item.business}</h3>
                      {item.isEmergency && (
                        <Badge className="rainbow-gradient text-white border-0 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Emergency
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{item.service}</p>
                    <p className="text-sm text-muted-foreground">
                      Scheduled: {item.scheduledTime} • Est. Start: {item.estimatedStartTime}
                    </p>
                  </div>
                </div>

                {/* Queue Status */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <span className={`font-semibold capitalize ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold rainbow-text">#{item.position}</p>
                      <p className="text-sm text-muted-foreground">of {item.totalInQueue}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Queue Progress</span>
                      <span>{Math.round(getProgressValue(item))}%</span>
                    </div>
                    <Progress value={getProgressValue(item)} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Est. Wait: <span className="font-bold ml-1 rainbow-text">{item.estimatedWaitTime} min</span>
                    </span>
                    <span className="text-muted-foreground">
                      Updated {Math.floor((Date.now() - item.lastUpdated.getTime()) / 60000)}m ago
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 min-w-0 lg:min-w-[200px]">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReschedule(item.id)}
                      className="flex-1 border-primary/20 hover:bg-primary/10"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                    {!item.isEmergency && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEmergencyBoost(item.id)}
                        className="flex-1 border-red-500/20 hover:bg-red-500/10 text-red-600"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Boost
                      </Button>
                    )}
                  </div>

                  {/* Individual Notification Controls */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Alerts:</span>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleNotification(item.id, 'voice')}
                        className={`p-1 h-6 w-6 ${item.notifications.voice ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {item.notifications.voice ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleNotification(item.id, 'push')}
                        className={`p-1 h-6 w-6 ${item.notifications.push ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <Bell className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleNotification(item.id, 'sms')}
                        className={`p-1 h-6 w-6 ${item.notifications.sms ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status-specific alerts */}
              {item.status === 'next' && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-700 dark:text-green-400">You're Next!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Please be ready. You'll be called in approximately {item.estimatedWaitTime} minutes.
                  </p>
                </div>
              )}

              {item.status === 'delayed' && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-700 dark:text-red-400">Delay Notice</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Your appointment is running behind schedule. New estimated time: {item.estimatedStartTime}
                  </p>
                </div>
              )}

              {item.status === 'in_service' && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-blue-700 dark:text-blue-400">In Service</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Your appointment is currently in progress. Estimated completion in {item.estimatedWaitTime} minutes.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {queueItems.length === 0 && (
          <Card className="border-border/40">
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Queues</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any appointments in queue right now
              </p>
              <Button className="rainbow-gradient hover:opacity-90">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}