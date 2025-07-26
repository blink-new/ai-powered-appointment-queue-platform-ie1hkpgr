import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPin, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  Building2,
  Car,
  Utensils,
  GraduationCap,
  Heart,
  Briefcase,
  Music,
  ShoppingBag,
  Home,
  Wrench,
  Smartphone,
  Languages,
  Shield,
  TrendingUp,
  Zap,
  Globe,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Award,
  Target,
  Sparkles,
  Flame,
  Crown,
  Rocket
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import blink from '@/blink/client'

interface City {
  id: string
  name: string
  country: string
  timezone: string
  currency: string
  language_code: string
  coordinates: string
  population: number
}

interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  description: string
  is_government: boolean
  is_emergency: boolean
  requires_documents: boolean
  average_duration: number
  popularity_score: number
}

const IndiaFocusedFeatures = ({ user }: { user: any }) => {
  const [cities, setCities] = useState<City[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('hi')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('cities')

  // Indian languages with beautiful flags and cultural elements
  const indianLanguages = [
    { code: 'hi', name: 'हिन्दी', english: 'Hindi', flag: '🇮🇳', color: '#FF6B35' },
    { code: 'en', name: 'English', english: 'English', flag: '🇬🇧', color: '#4285F4' },
    { code: 'bn', name: 'বাংলা', english: 'Bengali', flag: '🏴', color: '#00A86B' },
    { code: 'te', name: 'తెలుగు', english: 'Telugu', flag: '🏴', color: '#FFD700' },
    { code: 'mr', name: 'मराठी', english: 'Marathi', flag: '🏴', color: '#FF4500' },
    { code: 'ta', name: 'தமிழ்', english: 'Tamil', flag: '🏴', color: '#DC143C' },
    { code: 'gu', name: 'ગુજરાતી', english: 'Gujarati', flag: '🏴', color: '#32CD32' },
    { code: 'kn', name: 'ಕನ್ನಡ', english: 'Kannada', flag: '🏴', color: '#FF1493' },
    { code: 'ml', name: 'മലയാളം', english: 'Malayalam', flag: '🏴', color: '#8A2BE2' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🏴', color: '#FF6347' },
    { code: 'or', name: 'ଓଡ଼ିଆ', english: 'Odia', flag: '🏴', color: '#20B2AA' },
    { code: 'as', name: 'অসমীয়া', english: 'Assamese', flag: '🏴', color: '#9370DB' }
  ]

  // Indian service categories with cultural context
  const indianServiceCategories = [
    { id: 'healthcare', name: 'Healthcare & Medical', icon: '🏥', color: '#E74C3C', description: 'Hospitals, clinics, diagnostic centers', popular: true },
    { id: 'government', name: 'Government Services', icon: '🏛️', color: '#3498DB', description: 'Aadhaar, PAN, passport, licenses', popular: true },
    { id: 'banking', name: 'Banking & Finance', icon: '🏦', color: '#2ECC71', description: 'Banks, ATMs, loan centers, insurance', popular: true },
    { id: 'beauty', name: 'Beauty & Wellness', icon: '💄', color: '#E91E63', description: 'Salons, spas, beauty parlors', popular: true },
    { id: 'automotive', name: 'Automotive Services', icon: '🚗', color: '#FF9800', description: 'Car service, bike repair, fuel stations', popular: true },
    { id: 'education', name: 'Education & Training', icon: '📚', color: '#9C27B0', description: 'Schools, colleges, coaching centers', popular: true },
    { id: 'food', name: 'Restaurants & Food', icon: '🍽️', color: '#FF5722', description: 'Restaurants, cafes, food courts', popular: true },
    { id: 'retail', name: 'Shopping & Retail', icon: '🛍️', color: '#607D8B', description: 'Malls, markets, electronics stores', popular: false },
    { id: 'telecom', name: 'Telecom Services', icon: '📱', color: '#00BCD4', description: 'Mobile recharge, broadband, DTH', popular: false },
    { id: 'transport', name: 'Transportation', icon: '🚌', color: '#795548', description: 'Bus, train, metro, taxi booking', popular: false },
    { id: 'real_estate', name: 'Real Estate', icon: '🏠', color: '#4CAF50', description: 'Property registration, home loans', popular: false },
    { id: 'legal', name: 'Legal Services', icon: '⚖️', color: '#673AB7', description: 'Lawyers, notary, court services', popular: false },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#FF4081', description: 'Cinemas, events, amusement parks', popular: false },
    { id: 'religious', name: 'Religious Services', icon: '🕉️', color: '#FF6F00', description: 'Temples, religious ceremonies', popular: false },
    { id: 'postal', name: 'Postal Services', icon: '📮', color: '#8BC34A', description: 'Post office, courier, logistics', popular: false }
  ]

  const cityEmojis: { [key: string]: string } = {
    'new_york': '🏙️', // Bangalore
    'london': '🏛️', // Delhi  
    'tokyo': '🌊', // Mumbai
    'kolkata': '📚',
    'pune': '🎓',
    'hyderabad': '💎',
    'chennai': '🏖️',
    'ahmedabad': '🏭',
    'jaipur': '🏰',
    'lucknow': '🕌'
  }

  const loadIndianData = async () => {
    try {
      setLoading(true)
      
      // Load Indian cities
      const citiesData = await blink.db.cities.list()
      setCities(citiesData || [])
      
      // Load service categories
      const categoriesData = await blink.db.service_categories_enhanced.list()
      setServiceCategories(categoriesData || [])
      
      // Set default city to Bangalore
      if (citiesData && citiesData.length > 0) {
        const bangalore = citiesData.find(city => city.name === 'Bangalore') || citiesData[0]
        setSelectedCity(bangalore)
      }
      
    } catch (error) {
      console.error('Error loading Indian data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserPreferences = async (preferences: any) => {
    try {
      await blink.db.user_preferences.upsert({
        id: `pref_${user.id}`,
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
    }
  }

  useEffect(() => {
    loadIndianData()
  }, [])

  const handleCityChange = (city: City) => {
    setSelectedCity(city)
    updateUserPreferences({ preferred_city: city.id })
  }

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    updateUserPreferences({ preferred_language: languageCode })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatTime = () => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              background: [
                'linear-gradient(45deg, #FF6B35, #F7931E)',
                'linear-gradient(45deg, #F7931E, #FFD700)', 
                'linear-gradient(45deg, #FFD700, #32CD32)',
                'linear-gradient(45deg, #32CD32, #00CED1)',
                'linear-gradient(45deg, #00CED1, #FF6B35)'
              ]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              background: { duration: 3, repeat: Infinity }
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
          >
            <Globe className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Loading Smart Q India
            </h2>
            <p className="text-muted-foreground mt-2">Connecting to major Indian cities...</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 30%, rgba(50, 205, 50, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  background: [
                    'linear-gradient(45deg, #FF6B35, #F7931E, #FFD700)',
                    'linear-gradient(45deg, #FFD700, #32CD32, #00CED1)',
                    'linear-gradient(45deg, #00CED1, #FF6B35, #F7931E)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-6 rounded-3xl"
              >
                <Globe className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 text-2xl"
              >
                🇮🇳
              </motion.div>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold"
            >
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Smart Q
              </span>
              <motion.span
                animate={{ 
                  color: ['#FF6B35', '#F7931E', '#FFD700', '#32CD32', '#00CED1', '#FF6B35']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="ml-4"
              >
                India
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300 max-w-4xl mx-auto"
            >
              भारत का सबसे बड़ा AI-powered appointment platform
              <br />
              <span className="text-lg text-gray-400">
                Available in 10+ major cities • 15+ service categories • 12+ Indian languages
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mt-6"
            >
              {['🏥 Healthcare', '🏛️ Government', '🏦 Banking', '💄 Beauty', '🚗 Automotive'].map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium"
                >
                  {service}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="cities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                🏙️ Cities
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500">
                🏢 Services
              </TabsTrigger>
              <TabsTrigger value="languages" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500">
                🗣️ Languages
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500">
                ⚡ Features
              </TabsTrigger>
            </TabsList>

            {/* Cities Tab */}
            <TabsContent value="cities" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Major Indian Cities</h2>
                <p className="text-gray-300">Choose your city to get started with Smart Q</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {cities.map((city, index) => (
                    <motion.div
                      key={city.id}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -10,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                          selectedCity?.id === city.id 
                            ? 'ring-4 ring-orange-500 bg-gradient-to-br from-orange-500/20 to-pink-500/20' 
                            : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                        }`}
                        onClick={() => handleCityChange(city)}
                      >
                        <CardHeader className="pb-3 relative">
                          <div className="absolute top-4 right-4 text-3xl">
                            {cityEmojis[city.id] || '🏙️'}
                          </div>
                          <CardTitle className="text-xl text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-400" />
                            {city.name}
                          </CardTitle>
                          <CardDescription className="text-gray-300">
                            {city.country}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Clock className="w-4 h-4 text-blue-400" />
                            {formatTime()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Users className="w-4 h-4 text-green-400" />
                            {(city.population / 1000000).toFixed(1)}M people
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {city.currency}
                            </Badge>
                            {selectedCity?.id === city.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 text-sm font-medium">Selected</span>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Service Categories</h2>
                <p className="text-gray-300">Book appointments across all major service categories in India</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {indianServiceCategories.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50, rotateY: -90 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -10,
                        rotateY: 5,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Card className="h-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 overflow-hidden group">
                        <CardHeader className="pb-3 relative">
                          <div className="absolute top-4 right-4 text-2xl group-hover:scale-125 transition-transform">
                            {service.icon}
                          </div>
                          {service.popular && (
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute top-2 left-2"
                            >
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            </motion.div>
                          )}
                          <CardTitle className="text-lg text-white pr-12">
                            {service.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-300">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: service.color }}
                            />
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="text-white hover:text-orange-400 transition-colors cursor-pointer"
                            >
                              <Rocket className="w-5 h-5" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Indian Languages</h2>
                <p className="text-gray-300">Smart Q supports 12+ major Indian languages</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <AnimatePresence>
                  {indianLanguages.map((language, index) => (
                    <motion.div
                      key={language.code}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -5,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedLanguage === language.code 
                            ? 'ring-4 ring-orange-500 bg-gradient-to-br from-orange-500/30 to-pink-500/30' 
                            : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                        }`}
                        onClick={() => handleLanguageChange(language.code)}
                      >
                        <CardContent className="p-4 text-center space-y-3">
                          <motion.div
                            animate={{ 
                              color: selectedLanguage === language.code ? language.color : '#ffffff'
                            }}
                            className="text-2xl font-bold"
                          >
                            {language.name}
                          </motion.div>
                          <div className="text-sm text-gray-300">
                            {language.english}
                          </div>
                          <div className="text-2xl">
                            {language.flag}
                          </div>
                          {selectedLanguage === language.code && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 text-xs font-medium">Active</span>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Revolutionary Features</h2>
                <p className="text-gray-300">Cutting-edge technology designed for Indian users</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Smartphone,
                    title: 'Progressive Web App',
                    description: 'Install on any device, works offline',
                    features: ['Offline queue tracking', 'Push notifications', 'Home screen install'],
                    color: 'from-blue-500 to-purple-500'
                  },
                  {
                    icon: Languages,
                    title: 'Voice Commands (Hindi)',
                    description: 'Control with voice in Indian languages',
                    features: ['"नजदीकी अस्पताल में अपॉइंटमेंट बुक करें"', '"मेरी क्यू पोजीशन चेक करें"', '"कल का अपॉइंटमेंट कैंसल करें"'],
                    color: 'from-green-500 to-teal-500'
                  },
                  {
                    icon: Shield,
                    title: 'Aadhaar Integration',
                    description: 'Secure authentication with Aadhaar',
                    features: ['Aadhaar-based login', 'OTP verification', 'Secure document storage'],
                    color: 'from-orange-500 to-red-500'
                  },
                  {
                    icon: CreditCard,
                    title: 'UPI Payments',
                    description: 'Pay with UPI, cards, wallets',
                    features: ['UPI integration', 'Paytm, PhonePe support', 'EMI options'],
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: TrendingUp,
                    title: 'AI Predictions',
                    description: 'Smart wait time predictions',
                    features: ['Traffic-based estimates', 'Festival adjustments', 'Weather considerations'],
                    color: 'from-yellow-500 to-orange-500'
                  },
                  {
                    icon: Award,
                    title: 'Loyalty Rewards',
                    description: 'Earn points and rewards',
                    features: ['Cashback on bookings', 'Priority queue access', 'Exclusive discounts'],
                    color: 'from-pink-500 to-rose-500'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="h-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <CardTitle className="text-white">{feature.title}</CardTitle>
                            <CardDescription className="text-gray-300">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {feature.features.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.1) + (i * 0.05) }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{item}</span>
                          </motion.div>
                        ))}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity`}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Explore Feature
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Current Selection Summary */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 left-6 right-6 z-50"
            >
              <Card className="bg-gradient-to-r from-orange-500/90 to-pink-500/90 backdrop-blur-sm border-orange-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="text-3xl"
                      >
                        {cityEmojis[selectedCity.id] || '🏙️'}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Currently in {selectedCity.name}
                        </h3>
                        <p className="text-orange-100">
                          {formatTime()} • {selectedCity.currency} • {(selectedCity.population / 1000000).toFixed(1)}M people
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-100 text-sm">Language</p>
                      <p className="font-bold text-white text-lg">
                        {indianLanguages.find(l => l.code === selectedLanguage)?.name} 
                        <span className="ml-2">
                          {indianLanguages.find(l => l.code === selectedLanguage)?.flag}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default IndiaFocusedFeatures