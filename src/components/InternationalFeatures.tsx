import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  MapPin, 
  Clock, 
  DollarSign, 
  Languages, 
  Smartphone,
  Shield,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Building2,
  Plane,
  Car,
  Utensils,
  GraduationCap,
  Heart,
  Briefcase,
  Music,
  ShoppingBag,
  Home,
  Wrench
} from 'lucide-react'
import { motion } from 'framer-motion'
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

const InternationalFeatures = ({ user }: { user: any }) => {
  const [cities, setCities] = useState<City[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [loading, setLoading] = useState(true)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  const categoryIcons: { [key: string]: any } = {
    'healthcare': Heart,
    'government': Building2,
    'beauty': Star,
    'automotive': Car,
    'education': GraduationCap,
    'entertainment': Music,
    'transportation': Plane,
    'financial': DollarSign,
    'food': Utensils,
    'professional': Briefcase,
    'retail': ShoppingBag,
    'home': Home,
    'repair': Wrench
  }

  const loadInternationalData = async () => {
    try {
      setLoading(true)
      
      // Load cities
      const citiesData = await blink.db.cities.list()
      setCities(citiesData || [])
      
      // Load service categories
      const categoriesData = await blink.db.service_categories_enhanced.list()
      setServiceCategories(categoriesData || [])
      
      // Set default city (user's location or New York)
      if (citiesData && citiesData.length > 0) {
        setSelectedCity(citiesData[0])
      }
      
    } catch (error) {
      console.error('Error loading international data:', error)
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
    loadInternationalData()
  }, [])

  const handleCityChange = (city: City) => {
    setSelectedCity(city)
    updateUserPreferences({ preferred_city: city.id })
  }

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    updateUserPreferences({ preferred_language: languageCode })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date())
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="rainbow-animated w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Globe className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-center text-muted-foreground">Loading international features...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rainbow-animated p-4 rounded-2xl inline-block"
        >
          <Globe className="w-12 h-12 text-white" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Smart Q Global
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Available in 15+ cities worldwide with 25+ service categories
          </p>
        </div>
      </div>

      <Tabs defaultValue="cities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cities">🌍 Cities</TabsTrigger>
          <TabsTrigger value="services">🏢 Services</TabsTrigger>
          <TabsTrigger value="languages">🗣️ Languages</TabsTrigger>
          <TabsTrigger value="features">⚡ Features</TabsTrigger>
        </TabsList>

        {/* Cities Tab */}
        <TabsContent value="cities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <motion.div
                key={city.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedCity?.id === city.id 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleCityChange(city)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{city.name}</CardTitle>
                      <Badge variant="secondary">{city.country}</Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatTime(city.timezone)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4" />
                        {city.currency}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        {(city.population / 1000000).toFixed(1)}M people
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {city.coordinates.split(',')[0].substring(0, 6)}°, {city.coordinates.split(',')[1].substring(0, 6)}°
                        </span>
                      </div>
                      {selectedCity?.id === city.id && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {serviceCategories.map((service) => {
              const IconComponent = categoryIcons[service.id.split('_')[0]] || Building2
              return (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg text-white"
                          style={{ backgroundColor: service.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                          <div className="flex gap-1 mt-1">
                            {service.is_government && (
                              <Badge variant="secondary" className="text-xs">
                                <Building2 className="w-3 h-3 mr-1" />
                                Gov
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.average_duration}min avg
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {service.popularity_score}% popular
                        </div>
                      </div>
                      {service.requires_documents && (
                        <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                          <Shield className="w-3 h-3" />
                          Documents required
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {languages.map((language) => (
              <motion.div
                key={language.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedLanguage === language.code 
                      ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{language.flag}</div>
                    <h3 className="font-semibold">{language.name}</h3>
                    <p className="text-sm text-muted-foreground">{language.code.toUpperCase()}</p>
                    {selectedLanguage === language.code && (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Progressive Web App
                </CardTitle>
                <CardDescription>
                  Install Smart Q on any device for native app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Offline queue tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Push notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Home screen installation</span>
                </div>
                <Button className="w-full rainbow-animated">
                  Install App
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Voice Commands
                </CardTitle>
                <CardDescription>
                  Control Smart Q with voice in 12+ languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">"Book appointment at nearest clinic"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">"Check my queue position"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">"Cancel tomorrow's appointment"</span>
                </div>
                <Button className="w-full rainbow-animated">
                  Enable Voice
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Biometric Security
                </CardTitle>
                <CardDescription>
                  Secure access with Face ID, Touch ID, or fingerprint
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Face ID authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Fingerprint login</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Secure payment authorization</span>
                </div>
                <Button className="w-full rainbow-animated">
                  Setup Biometrics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  AI Analytics
                </CardTitle>
                <CardDescription>
                  Smart insights and predictive recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Demand forecasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Personalized recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Fraud detection</span>
                </div>
                <Button className="w-full rainbow-animated">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Current Selection Summary */}
      {selectedCity && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Current Location</h3>
                <p className="text-muted-foreground">
                  {selectedCity.name}, {selectedCity.country} • {formatTime(selectedCity.timezone)} • {selectedCity.currency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Language</p>
                <p className="font-semibold">
                  {languages.find(l => l.code === selectedLanguage)?.name} 
                  {languages.find(l => l.code === selectedLanguage)?.flag}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default InternationalFeatures