import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  Bell,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react'
import blink from '@/blink/client'

interface AdminPanelProps {
  user: any
}

interface Business {
  id: string
  name: string
  category: string
  address: string
  phone: string
  email: string
  isActive: boolean
  totalAppointments: number
  avgWaitTime: number
  rating: number
}

interface QueueManagement {
  id: string
  customerName: string
  service: string
  scheduledTime: string
  status: 'waiting' | 'in_service' | 'completed' | 'no_show'
  position: number
  isEmergency: boolean
  estimatedDuration: number
  actualStartTime?: string
}

interface Analytics {
  totalRevenue: number
  totalAppointments: number
  avgWaitTime: number
  customerSatisfaction: number
  noShowRate: number
  emergencyRequests: number
}

const mockBusinesses: Business[] = [
  {
    id: 'biz_1',
    name: 'City Medical Center',
    category: 'Healthcare',
    address: '123 Health St, Downtown',
    phone: '+1-555-0123',
    email: 'admin@citymedical.com',
    isActive: true,
    totalAppointments: 1247,
    avgWaitTime: 18,
    rating: 4.8
  },
  {
    id: 'biz_2',
    name: 'Elite Hair Salon',
    category: 'Beauty',
    address: '456 Style Ave, Midtown',
    phone: '+1-555-0456',
    email: 'info@elitehair.com',
    isActive: true,
    totalAppointments: 892,
    avgWaitTime: 12,
    rating: 4.9
  }
]

const mockQueue: QueueManagement[] = [
  {
    id: 'q_1',
    customerName: 'John Smith',
    service: 'General Consultation',
    scheduledTime: '2:30 PM',
    status: 'in_service',
    position: 1,
    isEmergency: false,
    estimatedDuration: 30,
    actualStartTime: '2:32 PM'
  },
  {
    id: 'q_2',
    customerName: 'Sarah Johnson',
    service: 'Annual Checkup',
    scheduledTime: '3:00 PM',
    status: 'waiting',
    position: 2,
    isEmergency: false,
    estimatedDuration: 60
  },
  {
    id: 'q_3',
    customerName: 'Mike Davis',
    service: 'Emergency Visit',
    scheduledTime: '3:15 PM',
    status: 'waiting',
    position: 1,
    isEmergency: true,
    estimatedDuration: 45
  }
]

const mockAnalytics: Analytics = {
  totalRevenue: 45680,
  totalAppointments: 234,
  avgWaitTime: 15,
  customerSatisfaction: 4.7,
  noShowRate: 8.5,
  emergencyRequests: 12
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(mockBusinesses[0])
  const [queueItems, setQueueItems] = useState<QueueManagement[]>(mockQueue)
  const [analytics, setAnalytics] = useState<Analytics>(mockAnalytics)
  const [isAddingBusiness, setIsAddingBusiness] = useState(false)

  const handleStatusUpdate = (queueId: string, newStatus: QueueManagement['status']) => {
    setQueueItems(prev => prev.map(item => 
      item.id === queueId 
        ? { 
            ...item, 
            status: newStatus,
            actualStartTime: newStatus === 'in_service' ? new Date().toLocaleTimeString() : item.actualStartTime
          }
        : item
    ))
  }

  const handleEmergencyApproval = (queueId: string, approved: boolean) => {
    if (approved) {
      // Move emergency to front of queue
      setQueueItems(prev => {
        const items = [...prev]
        const emergencyIndex = items.findIndex(item => item.id === queueId)
        if (emergencyIndex > -1) {
          const emergencyItem = items.splice(emergencyIndex, 1)[0]
          emergencyItem.position = 1
          // Update positions for other items
          items.forEach(item => {
            if (item.position < emergencyItem.position) {
              item.position += 1
            }
          })
          items.unshift(emergencyItem)
        }
        return items
      })
    }
    alert(`Emergency request ${approved ? 'approved' : 'denied'}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_service': return 'text-blue-500'
      case 'completed': return 'text-green-500'
      case 'no_show': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_service': return 'default'
      case 'completed': return 'secondary'
      case 'no_show': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="rainbow-text">Admin</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your businesses, queues, and analyze performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedBusiness.id} onValueChange={(value) => {
            const business = mockBusinesses.find(b => b.id === value)
            if (business) setSelectedBusiness(business)
          }}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockBusinesses.map(business => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsAddingBusiness(true)}
            className="rainbow-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold rainbow-text">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold rainbow-text">{analytics.totalAppointments}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait</p>
                <p className="text-2xl font-bold rainbow-text">{analytics.avgWaitTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold rainbow-text">{analytics.customerSatisfaction}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No-Show</p>
                <p className="text-2xl font-bold rainbow-text">{analytics.noShowRate}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emergency</p>
                <p className="text-2xl font-bold rainbow-text">{analytics.emergencyRequests}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue">Live Queue</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Live Queue Management */}
        <TabsContent value="queue" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Live Queue Management - {selectedBusiness.name}
              </CardTitle>
              <CardDescription>
                Monitor and manage customer queues in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queueItems.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border transition-all ${
                    item.isEmergency ? 'border-red-500/40 bg-red-500/5' : 'border-border/40 bg-card/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold rainbow-text">#{item.position}</div>
                          {item.isEmergency && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              <Zap className="w-3 h-3 mr-1" />
                              Emergency
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.customerName}</h4>
                          <p className="text-sm text-muted-foreground">{item.service}</p>
                          <p className="text-xs text-muted-foreground">
                            Scheduled: {item.scheduledTime} • Duration: {item.estimatedDuration}m
                          </p>
                          {item.actualStartTime && (
                            <p className="text-xs text-muted-foreground">
                              Started: {item.actualStartTime}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusBadge(item.status)} className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          {item.status === 'waiting' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'in_service')}
                              className="rainbow-gradient hover:opacity-90"
                            >
                              Start Service
                            </Button>
                          )}
                          {item.status === 'in_service' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(item.id, 'completed')}
                              className="border-green-500/20 hover:bg-green-500/10 text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {item.isEmergency && item.status === 'waiting' && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEmergencyApproval(item.id, true)}
                                className="border-green-500/20 hover:bg-green-500/10 text-green-600"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEmergencyApproval(item.id, false)}
                                className="border-red-500/20 hover:bg-red-500/10 text-red-600"
                              >
                                Deny
                              </Button>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(item.id, 'no_show')}
                            className="border-red-500/20 hover:bg-red-500/10 text-red-600"
                          >
                            No Show
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {queueItems.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No customers in queue</h3>
                    <p className="text-muted-foreground">Queue is empty. New appointments will appear here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Management */}
        <TabsContent value="businesses" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                Business Management
              </CardTitle>
              <CardDescription>
                Manage your business locations and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBusinesses.map((business) => (
                  <div key={business.id} className="p-4 rounded-lg border border-border/40 bg-card/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{business.name}</h4>
                          <p className="text-sm text-muted-foreground">{business.category}</p>
                          <p className="text-xs text-muted-foreground">{business.address}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span>📞 {business.phone}</span>
                            <span>📧 {business.email}</span>
                            <span>⭐ {business.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right text-sm">
                          <p className="font-semibold">{business.totalAppointments}</p>
                          <p className="text-muted-foreground">appointments</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-semibold rainbow-text">{business.avgWaitTime}m</p>
                          <p className="text-muted-foreground">avg wait</p>
                        </div>
                        <Switch checked={business.isActive} />
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold rainbow-text">{analytics.customerSatisfaction}/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Wait Time</span>
                    <span className="font-bold rainbow-text">{analytics.avgWaitTime} minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>No-Show Rate</span>
                    <span className="font-bold rainbow-text">{analytics.noShowRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Emergency Requests</span>
                    <span className="font-bold rainbow-text">{analytics.emergencyRequests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-bold rainbow-text">${analytics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Appointments</span>
                    <span className="font-bold rainbow-text">{analytics.totalAppointments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average per Appointment</span>
                    <span className="font-bold rainbow-text">${Math.round(analytics.totalRevenue / analytics.totalAppointments)}</span>
                  </div>
                  <Button className="w-full rainbow-gradient hover:opacity-90">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Business Settings
              </CardTitle>
              <CardDescription>
                Configure your business operations and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue={selectedBusiness.name} />
                  </div>
                  <div>
                    <Label htmlFor="businessCategory">Category</Label>
                    <Select defaultValue={selectedBusiness.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Professional">Professional Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="businessAddress">Address</Label>
                    <Textarea id="businessAddress" defaultValue={selectedBusiness.address} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input id="businessPhone" defaultValue={selectedBusiness.phone} />
                  </div>
                  <div>
                    <Label htmlFor="businessEmail">Email</Label>
                    <Input id="businessEmail" type="email" defaultValue={selectedBusiness.email} />
                  </div>
                  <div className="space-y-3">
                    <Label>Notification Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emergency Alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Queue Updates</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Reports</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-border/40">
                <Button className="rainbow-gradient hover:opacity-90">
                  Save Changes
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}