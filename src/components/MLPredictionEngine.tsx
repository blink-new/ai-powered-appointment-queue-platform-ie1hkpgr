import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap,
  BarChart3,
  Target,
  Cpu,
  Database,
  Network,
  AlertTriangle,
  CheckCircle,
  Timer,
  Gauge,
  LineChart,
  PieChart,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Layers,
  GitBranch,
  Server
} from 'lucide-react'
import blink from '@/blink/client'

interface MLPredictionEngineProps {
  user: any
}

interface PredictionModel {
  id: string
  name: string
  type: 'service_time' | 'queue_engine' | 'crowd_model'
  accuracy: number
  status: 'training' | 'active' | 'testing' | 'deprecated'
  lastTrained: string
  predictions: number
  mae: number
  version: string
}

interface QueueMetrics {
  totalQueues: number
  activeCustomers: number
  avgWaitTime: number
  predictionAccuracy: number
  realTimeUpdates: number
  emergencyBoosts: number
}

interface FeatureStore {
  serviceMetadata: number
  queueEvents: number
  contextFeatures: number
  capacitySnapshots: number
  outcomeLabels: number
}

export default function MLPredictionEngine({ user }: MLPredictionEngineProps) {
  const [models, setModels] = useState<PredictionModel[]>([])
  const [metrics, setMetrics] = useState<QueueMetrics>({
    totalQueues: 0,
    activeCustomers: 0,
    avgWaitTime: 0,
    predictionAccuracy: 0,
    realTimeUpdates: 0,
    emergencyBoosts: 0
  })
  const [featureStore, setFeatureStore] = useState<FeatureStore>({
    serviceMetadata: 0,
    queueEvents: 0,
    contextFeatures: 0,
    capacitySnapshots: 0,
    outcomeLabels: 0
  })
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isTraining, setIsTraining] = useState(false)
  const [realTimeData, setRealTimeData] = useState<any[]>([])

  const loadMLData = async () => {
    try {
      // Load ML models
      const mockModels: PredictionModel[] = [
        {
          id: 'service_time_v3',
          name: 'Service Time Predictor',
          type: 'service_time',
          accuracy: 87.3,
          status: 'active',
          lastTrained: '2024-01-25T10:30:00Z',
          predictions: 15420,
          mae: 4.2,
          version: 'v3.1.2'
        },
        {
          id: 'queue_engine_v2',
          name: 'Real-Time Queue Engine',
          type: 'queue_engine',
          accuracy: 92.1,
          status: 'active',
          lastTrained: '2024-01-25T08:15:00Z',
          predictions: 8930,
          mae: 3.8,
          version: 'v2.4.1'
        },
        {
          id: 'crowd_model_v1',
          name: 'Crowd Prediction Model',
          type: 'crowd_model',
          accuracy: 78.9,
          status: 'testing',
          lastTrained: '2024-01-24T16:45:00Z',
          predictions: 2340,
          mae: 6.1,
          version: 'v1.2.0'
        }
      ]
      setModels(mockModels)

      // Load metrics
      setMetrics({
        totalQueues: 247,
        activeCustomers: 1834,
        avgWaitTime: 18.5,
        predictionAccuracy: 89.2,
        realTimeUpdates: 45230,
        emergencyBoosts: 23
      })

      // Load feature store data
      setFeatureStore({
        serviceMetadata: 12450,
        queueEvents: 89340,
        contextFeatures: 156780,
        capacitySnapshots: 34560,
        outcomeLabels: 67890
      })

    } catch (error) {
      console.error('Error loading ML data:', error)
    }
  }

  const updateRealTimeMetrics = () => {
    // Simulate real-time updates
    setMetrics(prev => ({
      ...prev,
      activeCustomers: prev.activeCustomers + Math.floor(Math.random() * 10 - 5),
      avgWaitTime: Math.max(5, prev.avgWaitTime + (Math.random() - 0.5) * 2),
      realTimeUpdates: prev.realTimeUpdates + Math.floor(Math.random() * 50)
    }))

    // Add real-time prediction data
    const newDataPoint = {
      timestamp: new Date().toISOString(),
      predicted: Math.random() * 30 + 10,
      actual: Math.random() * 30 + 10,
      accuracy: 85 + Math.random() * 10
    }
    setRealTimeData(prev => [...prev.slice(-19), newDataPoint])
  }

  useEffect(() => {
    loadMLData()
    const interval = setInterval(updateRealTimeMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleModelRetrain = async (modelId: string) => {
    setIsTraining(true)
    try {
      // Simulate model retraining
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              lastTrained: new Date().toISOString(),
              accuracy: Math.min(95, model.accuracy + Math.random() * 3),
              mae: Math.max(2, model.mae - Math.random() * 0.5)
            }
          : model
      ))
    } catch (error) {
      console.error('Error retraining model:', error)
    } finally {
      setIsTraining(false)
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'training': return 'bg-yellow-500'
      case 'testing': return 'bg-blue-500'
      case 'deprecated': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'service_time': return <Timer className="w-4 h-4" />
      case 'queue_engine': return <Gauge className="w-4 h-4" />
      case 'crowd_model': return <Users className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Smart Q ML Engine
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time AI prediction system for queue management and wait-time optimization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="border-green-500 text-green-400">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Button 
            onClick={() => loadMLData()} 
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Queues</p>
                <p className="text-2xl font-bold text-white">{metrics.totalQueues}</p>
              </div>
              <div className="rainbow-animated p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Live Customers</p>
                <p className="text-2xl font-bold text-white">{metrics.activeCustomers.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Wait Time</p>
                <p className="text-2xl font-bold text-white">{metrics.avgWaitTime.toFixed(1)}m</p>
              </div>
              <div className="bg-orange-500 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Prediction Accuracy</p>
                <p className="text-2xl font-bold text-white">{metrics.predictionAccuracy.toFixed(1)}%</p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Real-time Updates</p>
                <p className="text-2xl font-bold text-white">{metrics.realTimeUpdates.toLocaleString()}</p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Emergency Boosts</p>
                <p className="text-2xl font-bold text-white">{metrics.emergencyBoosts}</p>
              </div>
              <div className="bg-red-500 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="models" className="data-[state=active]:bg-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            ML Models
          </TabsTrigger>
          <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-600">
            <Network className="w-4 h-4 mr-2" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-purple-600">
            <Database className="w-4 h-4 mr-2" />
            Feature Store
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-purple-600">
            <Eye className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        {/* ML Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getModelTypeIcon(model.type)}
                      <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                    </div>
                    <Badge className={`${getModelStatusColor(model.status)} text-white`}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">
                    Version {model.version} • {model.predictions.toLocaleString()} predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Accuracy</span>
                      <span className="text-white font-medium">{model.accuracy.toFixed(1)}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">MAE</p>
                      <p className="text-white font-medium">{model.mae.toFixed(1)} min</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Last Trained</p>
                      <p className="text-white font-medium">
                        {new Date(model.lastTrained).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => handleModelRetrain(model.id)}
                      disabled={isTraining}
                    >
                      {isTraining ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Play className="w-3 h-3 mr-1" />
                      )}
                      Retrain
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-slate-600 text-slate-400 hover:bg-slate-700"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Smart Q ML Architecture
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time prediction pipeline with continuous learning and auto-scaling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Architecture Diagram */}
              <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                <div className="space-y-4">
                  {/* Layer 1: Data Collection */}
                  <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-6 h-6 text-blue-400" />
                      <div>
                        <h4 className="font-semibold text-white">Data Collection Layer</h4>
                        <p className="text-sm text-slate-400">Real-time event streaming from all queues</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      Kafka + Redis
                    </Badge>
                  </div>

                  {/* Layer 2: Feature Engineering */}
                  <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Layers className="w-6 h-6 text-purple-400" />
                      <div>
                        <h4 className="font-semibold text-white">Feature Engineering</h4>
                        <p className="text-sm text-slate-400">Context-aware feature extraction and normalization</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      Spark + Feast
                    </Badge>
                  </div>

                  {/* Layer 3: ML Models */}
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-6 h-6 text-green-400" />
                      <div>
                        <h4 className="font-semibold text-white">ML Prediction Models</h4>
                        <p className="text-sm text-slate-400">LightGBM + Queue Simulation + Time Series</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {"< 500ms"}
                    </Badge>
                  </div>

                  {/* Layer 4: API & Notifications */}
                  <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Server className="w-6 h-6 text-orange-400" />
                      <div>
                        <h4 className="font-semibold text-white">API & Notifications</h4>
                        <p className="text-sm text-slate-400">Real-time predictions and smart alerts</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      GraphQL + WebSocket
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Performance Targets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inference Latency</span>
                      <span className="text-green-400 font-medium">{"< 500ms"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prediction Accuracy</span>
                      <span className="text-green-400 font-medium">85-95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Model Retraining</span>
                      <span className="text-blue-400 font-medium">Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Throughput</span>
                      <span className="text-purple-400 font-medium">10K+ req/sec</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ML Framework</span>
                      <span className="text-white font-medium">LightGBM + PyTorch</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Feature Store</span>
                      <span className="text-white font-medium">Feast + Redis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Streaming</span>
                      <span className="text-white font-medium">Kafka + Flink</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Orchestration</span>
                      <span className="text-white font-medium">Airflow + MLflow</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Store Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Feature Store Metrics
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time feature engineering and data pipeline status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Service Metadata</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {featureStore.serviceMetadata.toLocaleString()} records
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Queue Events</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {featureStore.queueEvents.toLocaleString()} events
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Context Features</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      {featureStore.contextFeatures.toLocaleString()} features
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Capacity Snapshots</span>
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      {featureStore.capacitySnapshots.toLocaleString()} snapshots
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Outcome Labels</span>
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      {featureStore.outcomeLabels.toLocaleString()} labels
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  Data Pipeline Health
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time monitoring of data ingestion and processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Kafka Ingestion</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Feature Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Model Serving</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data Quality</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 text-sm">Monitoring</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Categories */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Feature Categories & Engineering</CardTitle>
              <CardDescription className="text-slate-400">
                Comprehensive feature extraction for multi-industry queue prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Service Metadata</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Service type embeddings</li>
                    <li>• Historical duration patterns</li>
                    <li>• Complexity scoring</li>
                    <li>• Resource requirements</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Context Features</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Time-based patterns</li>
                    <li>• Weather conditions</li>
                    <li>• Local events impact</li>
                    <li>• Staff availability</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h4 className="font-semibold text-white mb-2">Queue Dynamics</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Real-time position tracking</li>
                    <li>• Service velocity metrics</li>
                    <li>• Emergency boost patterns</li>
                    <li>• Capacity utilization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LineChart className="w-5 h-5 mr-2" />
                  Prediction Accuracy Trends
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time model performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-slate-400">Live accuracy monitoring</p>
                    <p className="text-2xl font-bold text-white mt-2">89.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Model Performance Distribution
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Accuracy breakdown by service category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Healthcare</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-white text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Beauty & Salon</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87} className="w-20 h-2" />
                      <span className="text-white text-sm">87%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Automotive</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-white text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Dining</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-20 h-2" />
                      <span className="text-white text-sm">78%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert System */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                System Alerts & Monitoring
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time alerts for model performance and system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">All models performing within SLA</p>
                      <p className="text-sm text-slate-400">Accuracy above 85% threshold</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Healthy
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">High traffic detected in downtown area</p>
                      <p className="text-sm text-slate-400">Adjusting wait time predictions</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Monitoring
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Scheduled model retraining in progress</p>
                      <p className="text-sm text-slate-400">Service time predictor v3.1.3</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    Training
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}