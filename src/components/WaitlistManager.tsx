import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Clock, 
  Bell, 
  CheckCircle, 
  X, 
  Calendar,
  MapPin,
  Zap,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react'
import blink from '@/blink/client'

interface WaitlistManagerProps {
  user: any
}

interface WaitlistItem {
  id: string
  businessName: string
  serviceName: string
  preferredDate: string
  preferredTimeRange: string
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired'
  autoBook: boolean
  maxWaitDays: number
  createdAt: string
  estimatedWaitTime: string
  priority: 'normal' | 'high' | 'urgent'
}

const mockWaitlistItems: WaitlistItem[] = [
  {
    id: 'wait_1',
    businessName: 'City Medical Center',
    serviceName: 'General Consultation',
    preferredDate: '2024-01-28',
    preferredTimeRange: '9:00 AM - 12:00 PM',
    status: 'active',
    autoBook: true,
    maxWaitDays: 7,
    createdAt: '2024-01-26T10:30:00Z',
    estimatedWaitTime: '2-3 days',
    priority: 'high'
  },
  {
    id: 'wait_2',
    businessName: 'Elite Hair Salon',
    serviceName: 'Haircut & Style',
    preferredDate: '2024-01-29',
    preferredTimeRange: '2:00 PM - 6:00 PM',
    status: 'active',
    autoBook: false,
    maxWaitDays: 14,
    createdAt: '2024-01-25T14:15:00Z',
    estimatedWaitTime: '5-7 days',
    priority: 'normal'
  },
  {
    id: 'wait_3',
    businessName: 'Metro Dental Care',
    serviceName: 'Emergency Dental Visit',
    preferredDate: '2024-01-27',
    preferredTimeRange: 'Any time',
    status: 'fulfilled',
    autoBook: true,
    maxWaitDays: 1,
    createdAt: '2024-01-26T16:45:00Z',
    estimatedWaitTime: 'Same day',
    priority: 'urgent'
  }
]

export default function WaitlistManager({ user }: WaitlistManagerProps) {
  const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>(mockWaitlistItems)
  const [showAddForm, setShowAddForm] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500'
      case 'fulfilled': return 'bg-green-500'
      case 'cancelled': return 'bg-gray-500'
      case 'expired': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-50 dark:bg-red-950/20'
      case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/20'
      case 'normal': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const handleCancelWaitlist = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWaitlistItems(items => 
        items.map(item => 
          item.id === id ? { ...item, status: 'cancelled' as const } : item
        )
      )
    } catch (error) {
      console.error('Failed to cancel waitlist:', error)
    }
  }

  const handleToggleAutoBook = async (id: string, autoBook: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setWaitlistItems(items => 
        items.map(item => 
          item.id === id ? { ...item, autoBook } : item
        )
      )
    } catch (error) {
      console.error('Failed to update auto-book:', error)
    }
  }

  const activeItems = waitlistItems.filter(item => item.status === 'active')
  const completedItems = waitlistItems.filter(item => item.status !== 'active')

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="rainbow-text">Smart Waitlist</span> Manager
        </h1>
        <p className="text-muted-foreground">
          Auto-book when slots open up • Get notified instantly • Never miss an opportunity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeItems.length}</p>
                <p className="text-sm text-muted-foreground">Active Waitlists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedItems.filter(i => i.status === 'fulfilled').length}</p>
                <p className="text-sm text-muted-foreground">Fulfilled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{activeItems.filter(i => i.autoBook).length}</p>
                <p className="text-sm text-muted-foreground">Auto-Book Enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">2.3</p>
                <p className="text-sm text-muted-foreground">Avg Wait (days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card className="border-border/40 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified when slots become available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <Label className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Instant alerts on your device</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-green-500" />
                <div>
                  <Label className="font-medium">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Text message notifications</p>
                </div>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <div>
                  <Label className="font-medium">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">Detailed email notifications</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Waitlists */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Active Waitlists</h2>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="rainbow-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Waitlist
          </Button>
        </div>
        
        {activeItems.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Waitlists</h3>
              <p className="text-muted-foreground mb-4">
                Add yourself to waitlists to get notified when appointments become available
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Waitlist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeItems.map((item) => (
              <Card key={item.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                        <h3 className="font-semibold">{item.businessName}</h3>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {item.priority === 'high' && <Zap className="w-3 h-3 mr-1" />}
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{item.serviceName}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>Preferred: {new Date(item.preferredDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{item.preferredTimeRange}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-primary" />
                          <span>Est. wait: {item.estimatedWaitTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>Max wait: {item.maxWaitDays} days</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-green-500" />
                          <Label className="text-sm">Auto-book when available</Label>
                          <Switch 
                            checked={item.autoBook}
                            onCheckedChange={(checked) => handleToggleAutoBook(item.id, checked)}
                            size="sm"
                          />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelWaitlist(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="grid gap-4">
          {completedItems.slice(0, 3).map((item) => (
            <Card key={item.id} className="border-border/40 opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <div>
                      <h4 className="font-medium">{item.businessName}</h4>
                      <p className="text-sm text-muted-foreground">{item.serviceName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'fulfilled' ? 'default' : 'secondary'}>
                      {item.status === 'fulfilled' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Booked Successfully
                        </>
                      ) : (
                        item.status.charAt(0).toUpperCase() + item.status.slice(1)
                      )}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 mt-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full rainbow-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold">AI Waitlist Insights</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>• <strong>Best booking times:</strong> Tuesday-Thursday, 2-4 PM</p>
              <p>• <strong>Fastest fulfillment:</strong> Healthcare appointments (avg 1.2 days)</p>
              <p>• <strong>Success rate:</strong> 89% of waitlists get fulfilled within max wait time</p>
            </div>
            <div className="space-y-2">
              <p>• <strong>Tip:</strong> Enable auto-book for 3x faster booking</p>
              <p>• <strong>Peak cancellation times:</strong> Monday mornings, Friday afternoons</p>
              <p>• <strong>Your pattern:</strong> Most successful waitlists are 3-7 days out</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}