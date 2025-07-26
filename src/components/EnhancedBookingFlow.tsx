import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Brain,
  CreditCard,
  User,
  Plus,
  X,
  Heart,
  Shield,
  Video,
  UserPlus,
  Star,
  Gift,
  Phone,
  Mail,
  Building2,
  Stethoscope,
  Car,
  Scissors,
  Dumbbell,
  Scale,
  BookOpen,
  Home,
  Camera,
  Utensils,
  Baby,
  Laptop
} from 'lucide-react'
import blink from '@/blink/client'

interface EnhancedBookingFlowProps {
  user: any
}

interface BusinessCategory {
  id: string
  name: string
  emoji: string
  description: string
  businesses: Business[]
}

interface Business {
  id: string
  name: string
  category: string
  address: string
  rating: number
  distance: string
  waitTime: string
  emoji: string
  chainId?: string
  isVirtualAvailable: boolean
  acceptsInsurance: boolean
  hasLoyaltyProgram: boolean
  emergencyAvailable: boolean
}

interface EnhancedService {
  id: string
  name: string
  duration: number
  price: number
  description: string
  isEmergencyAvailable: boolean
  isVirtualAvailable: boolean
  requiresInsurance: boolean
  maxGroupSize: number
  preparationInstructions?: string
}

interface FamilyProfile {
  id: string
  name: string
  relationship: string
  phone?: string
  email?: string
  dateOfBirth?: string
  insuranceId?: string
}

interface InsuranceProvider {
  id: string
  name: string
  code: string
}

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  isPrimary: boolean
}

// Comprehensive business categories with services
const businessCategories: BusinessCategory[] = [
  {
    id: 'cat_healthcare',
    name: 'Healthcare',
    emoji: '🏥',
    description: 'Medical services, clinics, hospitals',
    businesses: [
      {
        id: 'biz_city_medical',
        name: 'City Medical Center',
        category: 'Healthcare',
        address: '123 Health St, Downtown',
        rating: 4.8,
        distance: '0.5 mi',
        waitTime: '15 min',
        emoji: '🏥',
        isVirtualAvailable: true,
        acceptsInsurance: true,
        hasLoyaltyProgram: false,
        emergencyAvailable: true
      },
      {
        id: 'biz_urgent_care',
        name: 'QuickCare Urgent Care',
        category: 'Healthcare',
        address: '456 Emergency Ave, Midtown',
        rating: 4.6,
        distance: '0.8 mi',
        waitTime: '8 min',
        emoji: '🚑',
        chainId: 'chain_urgent_care',
        isVirtualAvailable: false,
        acceptsInsurance: true,
        hasLoyaltyProgram: false,
        emergencyAvailable: true
      }
    ]
  },
  {
    id: 'cat_dental',
    name: 'Dental Care',
    emoji: '🦷',
    description: 'Dental clinics, orthodontists, oral surgeons',
    businesses: [
      {
        id: 'biz_metro_dental',
        name: 'Metro Dental Care',
        category: 'Dental',
        address: '321 Smile Blvd, Uptown',
        rating: 4.7,
        distance: '1.2 mi',
        waitTime: '10 min',
        emoji: '🦷',
        isVirtualAvailable: false,
        acceptsInsurance: true,
        hasLoyaltyProgram: true,
        emergencyAvailable: true
      }
    ]
  },
  {
    id: 'cat_beauty',
    name: 'Beauty & Salon',
    emoji: '💇',
    description: 'Hair salons, nail salons, spas',
    businesses: [
      {
        id: 'biz_elite_salon',
        name: 'Elite Hair Salon',
        category: 'Beauty',
        address: '456 Style Ave, Midtown',
        rating: 4.9,
        distance: '0.8 mi',
        waitTime: '25 min',
        emoji: '💇',
        chainId: 'chain_supercuts',
        isVirtualAvailable: false,
        acceptsInsurance: false,
        hasLoyaltyProgram: true,
        emergencyAvailable: false
      }
    ]
  },
  {
    id: 'cat_automotive',
    name: 'Automotive',
    emoji: '🚗',
    description: 'Car repair, maintenance, detailing',
    businesses: [
      {
        id: 'biz_quick_lube',
        name: 'Quick Lube Express',
        category: 'Automotive',
        address: '789 Auto St, Industrial',
        rating: 4.5,
        distance: '2.1 mi',
        waitTime: '12 min',
        emoji: '🚗',
        chainId: 'chain_jiffy_lube',
        isVirtualAvailable: false,
        acceptsInsurance: false,
        hasLoyaltyProgram: true,
        emergencyAvailable: false
      }
    ]
  },
  {
    id: 'cat_fitness',
    name: 'Fitness & Wellness',
    emoji: '💪',
    description: 'Gyms, yoga studios, personal trainers',
    businesses: [
      {
        id: 'biz_fitness_center',
        name: 'FitLife Wellness Center',
        category: 'Fitness',
        address: '555 Fitness Blvd, Westside',
        rating: 4.4,
        distance: '1.5 mi',
        waitTime: '5 min',
        emoji: '💪',
        isVirtualAvailable: true,
        acceptsInsurance: false,
        hasLoyaltyProgram: true,
        emergencyAvailable: false
      }
    ]
  },
  {
    id: 'cat_veterinary',
    name: 'Veterinary',
    emoji: '🐕',
    description: 'Pet care, veterinary clinics',
    businesses: [
      {
        id: 'biz_pet_clinic',
        name: 'Happy Paws Veterinary',
        category: 'Veterinary',
        address: '222 Pet Lane, Suburbs',
        rating: 4.8,
        distance: '1.8 mi',
        waitTime: '18 min',
        emoji: '🐕',
        isVirtualAvailable: true,
        acceptsInsurance: false,
        hasLoyaltyProgram: true,
        emergencyAvailable: true
      }
    ]
  }
]

// Enhanced services for each business
const enhancedServices: Record<string, EnhancedService[]> = {
  'biz_city_medical': [
    { 
      id: 'svc_consultation', 
      name: 'General Consultation', 
      duration: 30, 
      price: 150, 
      description: 'Standard medical consultation with physician', 
      isEmergencyAvailable: true,
      isVirtualAvailable: true,
      requiresInsurance: true,
      maxGroupSize: 1,
      preparationInstructions: 'Bring insurance card and list of current medications'
    },
    { 
      id: 'svc_checkup', 
      name: 'Annual Physical Exam', 
      duration: 60, 
      price: 300, 
      description: 'Comprehensive health examination and screening', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: true,
      maxGroupSize: 1,
      preparationInstructions: 'Fast for 12 hours before appointment for blood work'
    },
    { 
      id: 'svc_telemedicine', 
      name: 'Virtual Consultation', 
      duration: 20, 
      price: 75, 
      description: 'Online video consultation with healthcare provider', 
      isEmergencyAvailable: false,
      isVirtualAvailable: true,
      requiresInsurance: true,
      maxGroupSize: 1
    }
  ],
  'biz_metro_dental': [
    { 
      id: 'svc_cleaning', 
      name: 'Dental Cleaning', 
      duration: 60, 
      price: 120, 
      description: 'Professional teeth cleaning and examination', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: true,
      maxGroupSize: 1
    },
    { 
      id: 'svc_emergency_dental', 
      name: 'Emergency Dental Visit', 
      duration: 45, 
      price: 250, 
      description: 'Urgent dental care for pain or injury', 
      isEmergencyAvailable: true,
      isVirtualAvailable: false,
      requiresInsurance: true,
      maxGroupSize: 1
    },
    { 
      id: 'svc_family_cleaning', 
      name: 'Family Cleaning Package', 
      duration: 180, 
      price: 400, 
      description: 'Dental cleaning for up to 4 family members', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: true,
      maxGroupSize: 4
    }
  ],
  'biz_elite_salon': [
    { 
      id: 'svc_haircut', 
      name: 'Haircut & Style', 
      duration: 45, 
      price: 80, 
      description: 'Professional haircut and styling', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 1
    },
    { 
      id: 'svc_group_styling', 
      name: 'Group Styling Session', 
      duration: 120, 
      price: 300, 
      description: 'Hair styling for special events (up to 4 people)', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 4,
      preparationInstructions: 'Wash hair 24 hours before appointment'
    }
  ],
  'biz_quick_lube': [
    { 
      id: 'svc_oil_change', 
      name: 'Oil Change Service', 
      duration: 30, 
      price: 45, 
      description: 'Quick oil change and basic inspection', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 1
    },
    { 
      id: 'svc_fleet_service', 
      name: 'Fleet Service Package', 
      duration: 180, 
      price: 200, 
      description: 'Oil change service for multiple vehicles', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 5
    }
  ],
  'biz_fitness_center': [
    { 
      id: 'svc_personal_training', 
      name: 'Personal Training Session', 
      duration: 60, 
      price: 100, 
      description: 'One-on-one fitness training session', 
      isEmergencyAvailable: false,
      isVirtualAvailable: true,
      requiresInsurance: false,
      maxGroupSize: 1
    },
    { 
      id: 'svc_group_fitness', 
      name: 'Group Fitness Class', 
      duration: 45, 
      price: 25, 
      description: 'Group fitness class (up to 12 participants)', 
      isEmergencyAvailable: false,
      isVirtualAvailable: true,
      requiresInsurance: false,
      maxGroupSize: 12
    }
  ],
  'biz_pet_clinic': [
    { 
      id: 'svc_pet_checkup', 
      name: 'Pet Wellness Exam', 
      duration: 45, 
      price: 85, 
      description: 'Comprehensive pet health examination', 
      isEmergencyAvailable: false,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 1
    },
    { 
      id: 'svc_pet_emergency', 
      name: 'Emergency Pet Care', 
      duration: 60, 
      price: 200, 
      description: 'Urgent veterinary care for sick or injured pets', 
      isEmergencyAvailable: true,
      isVirtualAvailable: false,
      requiresInsurance: false,
      maxGroupSize: 1
    }
  ]
}

const mockFamilyProfiles: FamilyProfile[] = [
  { id: 'profile_self', name: 'Myself', relationship: 'self', email: 'user@example.com' },
  { id: 'profile_spouse', name: 'Sarah Johnson', relationship: 'spouse', phone: '+1-555-0123', email: 'sarah@example.com' },
  { id: 'profile_child1', name: 'Emma Johnson', relationship: 'daughter', dateOfBirth: '2015-03-15' },
  { id: 'profile_child2', name: 'Alex Johnson', relationship: 'son', dateOfBirth: '2018-07-22' },
  { id: 'profile_parent', name: 'Robert Smith', relationship: 'father', phone: '+1-555-0456', insuranceId: 'ins_medicare' }
]

const mockInsuranceProviders: InsuranceProvider[] = [
  { id: 'ins_aetna', name: 'Aetna', code: 'AETNA' },
  { id: 'ins_bcbs', name: 'Blue Cross Blue Shield', code: 'BCBS' },
  { id: 'ins_cigna', name: 'Cigna', code: 'CIGNA' },
  { id: 'ins_medicare', name: 'Medicare', code: 'MEDICARE' }
]

const mockEmergencyContacts: EmergencyContact[] = [
  { id: 'ec_1', name: 'Sarah Johnson', relationship: 'spouse', phone: '+1-555-0123', email: 'sarah@example.com', isPrimary: true },
  { id: 'ec_2', name: 'Robert Smith', relationship: 'father', phone: '+1-555-0456', isPrimary: false }
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
]

export default function EnhancedBookingFlow({ user }: EnhancedBookingFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [selectedService, setSelectedService] = useState<EnhancedService | null>(null)
  const [selectedProfiles, setSelectedProfiles] = useState<FamilyProfile[]>([mockFamilyProfiles[0]])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [isVirtual, setIsVirtual] = useState(false)
  const [notes, setNotes] = useState('')
  const [selectedInsurance, setSelectedInsurance] = useState<string>('')
  const [paymentPlan, setPaymentPlan] = useState<string>('full')
  const [addToWaitlist, setAddToWaitlist] = useState(false)
  const [notifyEmergencyContacts, setNotifyEmergencyContacts] = useState(false)
  const [loading, setLoading] = useState(false)

  const steps = [
    { number: 1, title: 'Select Category', description: 'Choose service category' },
    { number: 2, title: 'Select Business', description: 'Choose where you want to book' },
    { number: 3, title: 'Choose Service', description: 'Pick the service you need' },
    { number: 4, title: 'Select Profiles', description: 'Who is this appointment for?' },
    { number: 5, title: 'Pick Date & Time', description: 'When would you like to come?' },
    { number: 6, title: 'Additional Options', description: 'Insurance, payment, preferences' },
    { number: 7, title: 'Review & Confirm', description: 'Confirm your booking details' }
  ]

  const handleProfileToggle = (profile: FamilyProfile) => {
    if (selectedProfiles.find(p => p.id === profile.id)) {
      setSelectedProfiles(selectedProfiles.filter(p => p.id !== profile.id))
    } else {
      if (selectedService && selectedProfiles.length < selectedService.maxGroupSize) {
        setSelectedProfiles([...selectedProfiles, profile])
      }
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedService) return 0
    const basePrice = selectedService.price * selectedProfiles.length
    const emergencyFee = isEmergency ? 50 : 0
    return basePrice + emergencyFee
  }

  const handleBooking = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would create the booking with all the enhanced features
      alert(`Booking confirmed! ${selectedProfiles.length > 1 ? 'Group booking' : 'Appointment'} created successfully.`)
      
      // Reset form
      setStep(1)
      setSelectedCategory(null)
      setSelectedBusiness(null)
      setSelectedService(null)
      setSelectedProfiles([mockFamilyProfiles[0]])
      setSelectedDate(new Date())
      setSelectedTime('')
      setIsEmergency(false)
      setIsVirtual(false)
      setNotes('')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="rainbow-text">Enhanced Booking</span> System
        </h1>
        <p className="text-muted-foreground">
          Advanced booking with 18+ service categories, group bookings, insurance, and smart features
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 overflow-x-auto">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center min-w-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                step >= stepItem.number 
                  ? 'rainbow-gradient text-white border-transparent' 
                  : 'border-border text-muted-foreground'
              }`}>
                {step > stepItem.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{stepItem.number}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 transition-colors ${
                  step > stepItem.number ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="font-semibold">{steps[step - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[step - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border/40 mb-8">
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Select Service Category</h3>
                <Badge className="rainbow-gradient text-white border-0">
                  18+ Categories
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businessCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                      selectedCategory?.id === category.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{category.emoji}</div>
                      <h4 className="font-semibold mb-1">{category.name}</h4>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {category.businesses.length} locations
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && selectedCategory && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{selectedCategory.emoji}</div>
                <div>
                  <h3 className="text-xl font-semibold">Select Business</h3>
                  <p className="text-muted-foreground">{selectedCategory.name}</p>
                </div>
              </div>
              <div className="grid gap-4">
                {selectedCategory.businesses.map((business) => (
                  <div
                    key={business.id}
                    onClick={() => setSelectedBusiness(business)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                      selectedBusiness?.id === business.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{business.emoji}</div>
                        <div>
                          <h4 className="font-semibold">{business.name}</h4>
                          <p className="text-sm text-muted-foreground">{business.address}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {business.isVirtualAvailable && <Badge variant="outline"><Video className="w-3 h-3 mr-1" />Virtual</Badge>}
                            {business.acceptsInsurance && <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Insurance</Badge>}
                            {business.hasLoyaltyProgram && <Badge variant="outline"><Gift className="w-3 h-3 mr-1" />Rewards</Badge>}
                            {business.emergencyAvailable && <Badge variant="destructive"><Zap className="w-3 h-3 mr-1" />Emergency</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm">⭐ {business.rating}</span>
                          <Badge variant="secondary">{business.distance}</Badge>
                        </div>
                        <p className="text-sm font-medium rainbow-text">Wait: {business.waitTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && selectedBusiness && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{selectedBusiness.emoji}</div>
                <div>
                  <h3 className="text-xl font-semibold">Choose Service</h3>
                  <p className="text-muted-foreground">{selectedBusiness.name}</p>
                </div>
              </div>
              <div className="grid gap-4">
                {enhancedServices[selectedBusiness.id]?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                      selectedService?.id === service.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{service.name}</h4>
                          <div className="flex space-x-1">
                            {service.isEmergencyAvailable && <Badge variant="destructive" className="text-xs"><Zap className="w-3 h-3" /></Badge>}
                            {service.isVirtualAvailable && <Badge variant="outline" className="text-xs"><Video className="w-3 h-3" /></Badge>}
                            {service.requiresInsurance && <Badge variant="outline" className="text-xs"><Shield className="w-3 h-3" /></Badge>}
                            {service.maxGroupSize > 1 && <Badge variant="secondary" className="text-xs"><Users className="w-3 h-3 mr-1" />{service.maxGroupSize}</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                          <span className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            ${service.price}
                          </span>
                        </div>
                        {service.preparationInstructions && (
                          <p className="text-xs text-blue-600 mt-2">
                            📋 {service.preparationInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && selectedService && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Select Participants</h3>
                <Badge className="rainbow-gradient text-white border-0">
                  Max {selectedService.maxGroupSize} {selectedService.maxGroupSize === 1 ? 'person' : 'people'}
                </Badge>
              </div>
              <div className="grid gap-4">
                {mockFamilyProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleProfileToggle(profile)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                      selectedProfiles.find(p => p.id === profile.id)
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40'
                    } ${
                      selectedService.maxGroupSize === 1 && selectedProfiles.length === 1 && !selectedProfiles.find(p => p.id === profile.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedProfiles.find(p => p.id === profile.id)
                            ? 'bg-primary border-primary'
                            : 'border-border'
                        }`}>
                          {selectedProfiles.find(p => p.id === profile.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{profile.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{profile.relationship}</p>
                          {profile.phone && <p className="text-xs text-muted-foreground">{profile.phone}</p>}
                          {profile.dateOfBirth && <p className="text-xs text-muted-foreground">DOB: {profile.dateOfBirth}</p>}
                        </div>
                      </div>
                      {selectedProfiles.find(p => p.id === profile.id) && (
                        <Badge className="rainbow-gradient text-white border-0">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Select Date & Time</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Choose Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border border-border/40"
                  />
                </div>
                <div>
                  <Label className="text-base font-medium mb-3 block">Available Times</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className={selectedTime === time ? "rainbow-gradient text-white" : ""}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Virtual Option */}
              {selectedService?.isVirtualAvailable && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-border/20">
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-primary" />
                    <div>
                      <Label className="font-medium">Virtual Appointment</Label>
                      <p className="text-sm text-muted-foreground">Join via video call from anywhere</p>
                    </div>
                  </div>
                  <Switch checked={isVirtual} onCheckedChange={setIsVirtual} />
                </div>
              )}

              {/* Waitlist Option */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-border/20">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <div>
                    <Label className="font-medium">Add to Waitlist</Label>
                    <p className="text-sm text-muted-foreground">Get notified if earlier slots become available</p>
                  </div>
                </div>
                <Switch checked={addToWaitlist} onCheckedChange={setAddToWaitlist} />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Additional Options</h3>
              
              <Tabs defaultValue="insurance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="insurance" className="space-y-4">
                  {selectedService?.requiresInsurance && (
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select Insurance Provider</Label>
                      <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your insurance provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInsuranceProviders.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name} ({provider.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="payment" className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Payment Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="full"
                          name="payment"
                          value="full"
                          checked={paymentPlan === 'full'}
                          onChange={(e) => setPaymentPlan(e.target.value)}
                        />
                        <Label htmlFor="full">Pay in Full (${calculateTotalPrice()})</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="installments"
                          name="payment"
                          value="installments"
                          checked={paymentPlan === 'installments'}
                          onChange={(e) => setPaymentPlan(e.target.value)}
                        />
                        <Label htmlFor="installments">3 Monthly Installments (${Math.ceil(calculateTotalPrice() / 3)} each)</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="emergency" className="space-y-4">
                  {selectedService?.isEmergencyAvailable && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-red-500" />
                        <div>
                          <Label className="font-medium">Emergency Priority</Label>
                          <p className="text-sm text-muted-foreground">Get priority in queue (+$50 fee)</p>
                        </div>
                      </div>
                      <Switch checked={isEmergency} onCheckedChange={setIsEmergency} />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-border/20">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Notify Emergency Contacts</Label>
                        <p className="text-sm text-muted-foreground">Alert your emergency contacts about this appointment</p>
                      </div>
                    </div>
                    <Switch checked={notifyEmergencyContacts} onCheckedChange={setNotifyEmergencyContacts} />
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-border/20">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <div>
                        <Label className="font-medium">Recurring Appointment</Label>
                        <p className="text-sm text-muted-foreground">Automatically book this appointment regularly</p>
                      </div>
                    </div>
                    <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-base font-medium">Special Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Review & Confirm</h3>
              <div className="space-y-4">
                {/* Appointment Details */}
                <div className="p-4 rounded-lg bg-card/40 border border-border/20">
                  <h4 className="font-semibold mb-2">Appointment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedCategory?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business:</span>
                      <span>{selectedBusiness?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span>{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Participants:</span>
                      <span>{selectedProfiles.length} {selectedProfiles.length === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedTime} {isVirtual && '(Virtual)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedService?.duration} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="p-4 rounded-lg bg-card/40 border border-border/20">
                  <h4 className="font-semibold mb-2">Participants</h4>
                  <div className="space-y-2">
                    {selectedProfiles.map((profile) => (
                      <div key={profile.id} className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-primary" />
                        <span>{profile.name}</span>
                        <Badge variant="outline" className="text-xs">{profile.relationship}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-4 rounded-lg bg-card/40 border border-border/20">
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Service ({selectedProfiles.length}x):</span>
                      <span>${selectedService ? selectedService.price * selectedProfiles.length : 0}</span>
                    </div>
                    {isEmergency && (
                      <div className="flex justify-between">
                        <span>Emergency Fee:</span>
                        <span>$50</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="rainbow-text">${calculateTotalPrice()}</span>
                    </div>
                    {paymentPlan === 'installments' && (
                      <p className="text-xs text-muted-foreground">
                        3 monthly payments of ${Math.ceil(calculateTotalPrice() / 3)}
                      </p>
                    )}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="font-semibold">AI Insights</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• You'll receive notifications 20 minutes before your appointment</li>
                    <li>• Current wait time is approximately {selectedBusiness?.waitTime}</li>
                    <li>• This business has a {selectedBusiness?.rating}/5 star rating</li>
                    {selectedProfiles.length > 1 && <li>• Group booking confirmed for {selectedProfiles.length} participants</li>}
                    {isVirtual && <li>• Virtual appointment link will be sent via email</li>}
                    {addToWaitlist && <li>• You'll be notified if earlier slots become available</li>}
                    {isEmergency && <li>• Emergency requests are typically approved within 5 minutes</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="border-primary/20 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {step < 7 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !selectedCategory) ||
              (step === 2 && !selectedBusiness) ||
              (step === 3 && !selectedService) ||
              (step === 4 && selectedProfiles.length === 0) ||
              (step === 5 && (!selectedDate || !selectedTime)) ||
              (step === 6 && selectedService?.requiresInsurance && !selectedInsurance)
            }
            className="rainbow-gradient hover:opacity-90"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleBooking}
            disabled={loading}
            className="rainbow-gradient hover:opacity-90"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm {selectedProfiles.length > 1 ? 'Group ' : ''}Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}