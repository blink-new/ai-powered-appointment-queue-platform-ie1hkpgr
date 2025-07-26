import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Filter,
  Search,
  Route,
  Zap,
  Phone,
  Globe,
  Calendar,
  Brain
} from 'lucide-react'

interface MapsIntegrationProps {
  user: any
}

interface NearbyBusiness {
  id: string
  name: string
  category: string
  address: string
  distance: string
  walkTime: string
  driveTime: string
  waitTime: string
  rating: number
  reviews: number
  phone: string
  website?: string
  emoji: string
  isOpen: boolean
  nextAvailable: string
  aiRecommendation?: string
}

const mockNearbyBusinesses: NearbyBusiness[] = [
  {
    id: 'nearby_1',
    name: 'QuickCare Medical',
    category: 'Healthcare',
    address: '789 Fast St, Downtown',
    distance: '0.3 mi',
    walkTime: '6 min',
    driveTime: '2 min',
    waitTime: '5 min',
    rating: 4.6,
    reviews: 234,
    phone: '+1-555-0789',
    website: 'quickcare.com',
    emoji: '🏥',
    isOpen: true,
    nextAvailable: 'Now',
    aiRecommendation: 'Fastest option - 10x shorter wait than your current booking'
  },
  {
    id: 'nearby_2',
    name: 'Express Hair Studio',
    category: 'Beauty',
    address: '456 Style Blvd, Midtown',
    distance: '0.7 mi',
    walkTime: '14 min',
    driveTime: '4 min',
    waitTime: '12 min',
    rating: 4.8,
    reviews: 189,
    phone: '+1-555-0456',
    emoji: '💇',
    isOpen: true,
    nextAvailable: '2:30 PM',
    aiRecommendation: 'Higher rated with similar services'
  },
  {
    id: 'nearby_3',
    name: 'Rapid Auto Service',
    category: 'Automotive',
    address: '321 Speed Ave, Industrial',
    distance: '1.1 mi',
    walkTime: '22 min',
    driveTime: '6 min',
    waitTime: '8 min',
    rating: 4.5,
    reviews: 156,
    phone: '+1-555-0321',
    emoji: '🔧',
    isOpen: true,
    nextAvailable: '3:00 PM'
  },
  {
    id: 'nearby_4',
    name: 'Smile Express Dental',
    category: 'Healthcare',
    address: '654 Tooth Lane, Uptown',
    distance: '0.9 mi',
    walkTime: '18 min',
    driveTime: '5 min',
    waitTime: '15 min',
    rating: 4.7,
    reviews: 298,
    phone: '+1-555-0654',
    emoji: '🦷',
    isOpen: true,
    nextAvailable: '4:15 PM'
  },
  {
    id: 'nearby_5',
    name: 'Zen Wellness Spa',
    category: 'Beauty',
    address: '987 Calm St, Westside',
    distance: '1.3 mi',
    walkTime: '26 min',
    driveTime: '8 min',
    waitTime: '20 min',
    rating: 4.9,
    reviews: 412,
    phone: '+1-555-0987',
    website: 'zenwellness.com',
    emoji: '🧘',
    isOpen: true,
    nextAvailable: '5:00 PM'
  },
  {
    id: 'nearby_6',
    name: 'TechFix Repair Hub',
    category: 'Electronics',
    address: '147 Circuit Rd, Tech District',
    distance: '0.6 mi',
    walkTime: '12 min',
    driveTime: '3 min',
    waitTime: '10 min',
    rating: 4.4,
    reviews: 87,
    phone: '+1-555-0147',
    emoji: '📱',
    isOpen: false,
    nextAvailable: 'Tomorrow 9 AM'
  }
]

const categories = ['All', 'Healthcare', 'Beauty', 'Automotive', 'Electronics', 'Professional']
const sortOptions = [
  { value: 'distance', label: 'Closest First' },
  { value: 'waitTime', label: 'Shortest Wait' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'aiRecommended', label: 'AI Recommended' }
]

export default function MapsIntegration({ user }: MapsIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('distance')
  const [filteredBusinesses, setFilteredBusinesses] = useState(mockNearbyBusinesses)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<NearbyBusiness | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Use default location (NYC)
          setUserLocation({ lat: 40.7128, lng: -74.0060 })
        }
      )
    }
  }, [])

  useEffect(() => {
    // Filter and sort businesses
    const filtered = mockNearbyBusinesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           business.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort businesses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance)
        case 'waitTime':
          return parseInt(a.waitTime) - parseInt(b.waitTime)
        case 'rating':
          return b.rating - a.rating
        case 'aiRecommended':
          return (b.aiRecommendation ? 1 : 0) - (a.aiRecommendation ? 1 : 0)
        default:
          return 0
      }
    })

    setFilteredBusinesses(filtered)
  }, [searchQuery, selectedCategory, sortBy])

  const handleGetDirections = (business: NearbyBusiness) => {
    const destination = encodeURIComponent(business.address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(url, '_blank')
  }

  const handleBookNow = (business: NearbyBusiness) => {
    // In a real app, this would navigate to booking flow with pre-selected business
    alert(`Booking at ${business.name}... This would open the booking flow with this business pre-selected.`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="rainbow-text">Nearby Options</span> Finder
          </h1>
          <p className="text-muted-foreground">
            AI-powered discovery of fastest alternatives around you
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="rainbow-gradient text-white border-0">
            <MapPin className="w-4 h-4 mr-1" />
            {userLocation ? 'Location Found' : 'Getting Location...'}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/40">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for services, businesses, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder and Results */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-1">
          <Card className="border-border/40 h-96 lg:h-full">
            <CardContent className="p-0 h-full">
              <div 
                ref={mapRef}
                className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center relative overflow-hidden"
              >
                {/* Map Placeholder */}
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">
                    Google Maps integration would show<br />
                    real-time locations and routes
                  </p>
                </div>
                
                {/* Mock Map Pins */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-8 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Found {filteredBusinesses.length} nearby options
            </h3>
            <Badge variant="secondary">
              <Brain className="w-4 h-4 mr-1" />
              AI Sorted
            </Badge>
          </div>

          {filteredBusinesses.map((business) => (
            <Card 
              key={business.id} 
              className={`border-border/40 hover:border-primary/40 transition-all cursor-pointer ${
                business.aiRecommendation ? 'ring-2 ring-primary/20' : ''
              }`}
              onClick={() => setSelectedBusiness(business)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl">{business.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold">{business.name}</h4>
                        {business.aiRecommendation && (
                          <Badge className="rainbow-gradient text-white border-0 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            AI Pick
                          </Badge>
                        )}
                        {!business.isOpen && (
                          <Badge variant="destructive" className="text-xs">Closed</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{business.address}</p>
                      
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{business.rating}</span>
                          <span className="text-muted-foreground ml-1">({business.reviews})</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-primary mr-1" />
                          <span>{business.distance}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-accent mr-1" />
                          <span className="font-medium rainbow-text">Wait: {business.waitTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-xs text-muted-foreground mb-3">
                        <span>🚶 {business.walkTime}</span>
                        <span>🚗 {business.driveTime}</span>
                        <span>📅 Next: {business.nextAvailable}</span>
                      </div>

                      {business.aiRecommendation && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-3">
                          <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">AI Insight:</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{business.aiRecommendation}</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBookNow(business)
                          }}
                          className="rainbow-gradient hover:opacity-90"
                          disabled={!business.isOpen}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Book Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGetDirections(business)
                          }}
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          Directions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${business.phone}`, '_self')
                          }}
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        {business.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`https://${business.website}`, '_blank')
                            }}
                            className="border-primary/20 hover:bg-primary/10"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Website
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBusinesses.length === 0 && (
            <Card className="border-border/40">
              <CardContent className="p-12 text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or expanding your search area
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            AI Travel Insights
          </CardTitle>
          <CardDescription>
            Smart recommendations based on your location and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-700 dark:text-green-400">Fastest Option</span>
              </div>
              <p className="text-sm">QuickCare Medical is 5 minutes away with immediate availability</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Route className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-blue-700 dark:text-blue-400">Best Route</span>
              </div>
              <p className="text-sm">Take Main St to avoid traffic - saves 3 minutes</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="font-semibold text-purple-700 dark:text-purple-400">Top Rated</span>
              </div>
              <p className="text-sm">Zen Wellness Spa has 4.9 stars and premium services</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}