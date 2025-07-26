import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  Star,
  Activity,
  MapPin
} from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'

interface AnalyticsData {
  totalUsers: number
  activeQueues: number
  avgWaitTime: number
  satisfactionScore: number
  revenue: number
  bookingsToday: number
  emergencyRequests: number
  mlAccuracy: number
}

const AdvancedAnalytics = ({ user }: { user: any }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeQueues: 0,
    avgWaitTime: 0,
    satisfactionScore: 0,
    revenue: 0,
    bookingsToday: 0,
    emergencyRequests: 0,
    mlAccuracy: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const waitTimeData = [
    { time: '9:00', waitTime: 15, predicted: 18 },
    { time: '10:00', waitTime: 22, predicted: 20 },
    { time: '11:00', waitTime: 18, predicted: 16 },
    { time: '12:00', waitTime: 35, predicted: 32 },
    { time: '13:00', waitTime: 28, predicted: 30 },
    { time: '14:00', waitTime: 20, predicted: 22 },
    { time: '15:00', waitTime: 25, predicted: 24 },
    { time: '16:00', waitTime: 30, predicted: 28 }
  ]

  const bookingTrends = [
    { date: 'Mon', bookings: 45, revenue: 2250 },
    { date: 'Tue', bookings: 52, revenue: 2600 },
    { date: 'Wed', bookings: 38, revenue: 1900 },
    { date: 'Thu', bookings: 61, revenue: 3050 },
    { date: 'Fri', bookings: 73, revenue: 3650 },
    { date: 'Sat', bookings: 89, revenue: 4450 },
    { date: 'Sun', bookings: 67, revenue: 3350 }
  ]

  const serviceDistribution = [
    { name: 'Healthcare', value: 35, color: '#EF4444' },
    { name: 'Beauty', value: 25, color: '#EC4899' },
    { name: 'Automotive', value: 20, color: '#F59E0B' },
    { name: 'Government', value: 12, color: '#3B82F6' },
    { name: 'Other', value: 8, color: '#8B5CF6' }
  ]

  const cityPerformance = [
    { city: 'New York', users: 12500, satisfaction: 4.8, revenue: 125000 },
    { city: 'London', users: 8900, satisfaction: 4.7, revenue: 89000 },
    { city: 'Tokyo', users: 15600, satisfaction: 4.9, revenue: 156000 },
    { city: 'Paris', users: 7200, satisfaction: 4.6, revenue: 72000 },
    { city: 'Dubai', users: 5800, satisfaction: 4.8, revenue: 58000 }
  ]

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Simulate real-time data updates
      setAnalyticsData({
        totalUsers: 47832 + Math.floor(Math.random() * 100),
        activeQueues: 1247 + Math.floor(Math.random() * 50),
        avgWaitTime: 18.5 + Math.random() * 5,
        satisfactionScore: 4.7 + Math.random() * 0.3,
        revenue: 892450 + Math.floor(Math.random() * 10000),
        bookingsToday: 3456 + Math.floor(Math.random() * 100),
        emergencyRequests: 23 + Math.floor(Math.random() * 10),
        mlAccuracy: 89.2 + Math.random() * 5
      })
      
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
    const interval = setInterval(loadAnalyticsData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading && analyticsData.totalUsers === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="rainbow-animated w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8 text-white animate-pulse" />
        </div>
        <p className="text-center text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'rainbow-animated' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.totalUsers)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.activeQueues)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8.2%</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgWaitTime.toFixed(1)}min</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-15.3%</span> improvement
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+23.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="performance">⚡ Performance</TabsTrigger>
          <TabsTrigger value="cities">🌍 Cities</TabsTrigger>
          <TabsTrigger value="ml">🧠 ML Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wait Time Prediction */}
            <Card>
              <CardHeader>
                <CardTitle>Wait Time Prediction vs Actual</CardTitle>
                <CardDescription>
                  ML model accuracy in predicting wait times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={waitTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="waitTime" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Booking Trends</CardTitle>
                <CardDescription>
                  Bookings and revenue over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Service Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Service Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of bookings by service category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {serviceDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm">{entry.name} ({entry.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Satisfaction Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {analyticsData.satisfactionScore.toFixed(1)}/5.0
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= analyticsData.satisfactionScore
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">ML Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  {analyticsData.mlAccuracy.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Prediction accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Today's Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {formatNumber(analyticsData.bookingsToday)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +15% vs yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Emergency Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {analyticsData.emergencyRequests}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active emergencies
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {cityPerformance.map((city, index) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rainbow-animated p-3 rounded-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{city.city}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(city.users)} active users
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{city.satisfaction}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(city.revenue)} revenue
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* ML Insights Tab */}
        <TabsContent value="ml" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Model Performance
                </CardTitle>
                <CardDescription>
                  Real-time ML model accuracy and predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Service Time Predictor</span>
                    <span className="text-sm font-semibold">92.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.3%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Queue Length Predictor</span>
                    <span className="text-sm font-semibold">87.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87.8%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Demand Forecaster</span>
                    <span className="text-sm font-semibold">84.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '84.1%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Prediction Accuracy
                </CardTitle>
                <CardDescription>
                  How accurate our predictions are across different time ranges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 15 minutes</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    95.2% accurate
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 30 minutes</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    89.7% accurate
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 1 hour</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    78.3% accurate
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next 2 hours</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    65.1% accurate
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50 dark:bg-red-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      High Wait Times Detected
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Downtown Medical Center has wait times exceeding 45 minutes
                    </p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:bg-green-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      System Performance Optimal
                    </h4>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      All systems running smoothly with 99.9% uptime
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Success
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAnalytics