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
  X
} from 'lucide-react'
import blink from '@/blink/client'

interface BookingFlowProps {
  user: any
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
}

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
  isEmergencyAvailable: boolean
}

interface FamilyProfile {
  id: string
  name: string
  relationship: string
  phone?: string
}

const mockBusinesses: Business[] = [
  {
    id: 'biz_medical_center',
    name: 'City Medical Center',
    category: 'Healthcare',
    address: '123 Health St, Downtown',
    rating: 4.8,
    distance: '0.5 mi',
    waitTime: '15 min',
    emoji: '🏥'
  },
  {
    id: 'biz_elite_salon',
    name: 'Elite Hair Salon',
    category: 'Beauty',
    address: '456 Style Ave, Midtown',
    rating: 4.9,
    distance: '0.8 mi',
    waitTime: '25 min',
    emoji: '💇'
  },
  {
    id: 'biz_dental_care',
    name: 'Metro Dental Care',
    category: 'Healthcare',
    address: '321 Smile Blvd, Uptown',
    rating: 4.7,
    distance: '1.2 mi',
    waitTime: '10 min',
    emoji: '🦷'
  }
]

const mockServices: Record<string, Service[]> = {
  'biz_medical_center': [
    { id: 'svc_consultation', name: 'General Consultation', duration: 30, price: 150, description: 'Standard medical consultation', isEmergencyAvailable: true },
    { id: 'svc_checkup', name: 'Annual Checkup', duration: 60, price: 300, description: 'Comprehensive health examination', isEmergencyAvailable: false }
  ],
  'biz_elite_salon': [
    { id: 'svc_haircut', name: 'Haircut & Style', duration: 45, price: 80, description: 'Professional haircut and styling', isEmergencyAvailable: false },
    { id: 'svc_coloring', name: 'Hair Coloring', duration: 120, price: 200, description: 'Full hair coloring service', isEmergencyAvailable: false }
  ],
  'biz_dental_care': [
    { id: 'svc_cleaning', name: 'Dental Cleaning', duration: 60, price: 120, description: 'Professional teeth cleaning', isEmergencyAvailable: false },
    { id: 'svc_emergency', name: 'Emergency Visit', duration: 45, price: 250, description: 'Urgent dental care', isEmergencyAvailable: true }
  ]
}

const mockFamilyProfiles: FamilyProfile[] = [
  { id: 'profile_self', name: 'Myself', relationship: 'self' },
  { id: 'profile_spouse', name: 'Sarah Johnson', relationship: 'spouse', phone: '+1-555-0123' },
  { id: 'profile_child1', name: 'Emma Johnson', relationship: 'daughter' },
  { id: 'profile_child2', name: 'Alex Johnson', relationship: 'son' }
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
]

export default function BookingFlow({ user }: BookingFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<FamilyProfile>(mockFamilyProfiles[0])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isEmergency, setIsEmergency] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const steps = [
    { number: 1, title: 'Select Business', description: 'Choose where you want to book' },
    { number: 2, title: 'Choose Service', description: 'Pick the service you need' },
    { number: 3, title: 'Select Profile', description: 'Who is this appointment for?' },
    { number: 4, title: 'Pick Date & Time', description: 'When would you like to come?' },
    { number: 5, title: 'Review & Confirm', description: 'Confirm your booking details' }
  ]

  const handleBooking = async () => {
    setLoading(true)
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would normally call your booking API
      // const booking = await blink.db.appointments.create({
      //   userId: user.id,
      //   businessId: selectedBusiness?.id,
      //   serviceId: selectedService?.id,
      //   scheduledTime: new Date(`${selectedDate} ${selectedTime}`),
      //   isEmergency,
      //   notes
      // })
      
      alert('Appointment booked successfully! You will receive notifications 20 minutes before your appointment.')
      setStep(1)
      // Reset form
      setSelectedBusiness(null)
      setSelectedService(null)
      setSelectedDate(new Date())
      setSelectedTime('')
      setIsEmergency(false)
      setNotes('')
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="rainbow-text">Smart Booking</span> Flow
        </h1>
        <p className="text-muted-foreground">
          Book appointments with AI-powered recommendations and real-time availability
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
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
                <div className={`w-16 h-0.5 mx-2 transition-colors ${
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
                <h3 className="text-xl font-semibold">Select Business</h3>
                <Badge className="rainbow-gradient text-white border-0">
                  AI Recommended
                </Badge>
              </div>
              <div className="grid gap-4">
                {mockBusinesses.map((business) => (
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
                          <p className="text-sm text-muted-foreground">{business.category}</p>
                          <p className="text-xs text-muted-foreground">{business.address}</p>
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

          {step === 2 && selectedBusiness && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{selectedBusiness.emoji}</div>
                <div>
                  <h3 className="text-xl font-semibold">Choose Service</h3>
                  <p className="text-muted-foreground">{selectedBusiness.name}</p>
                </div>
              </div>
              <div className="grid gap-4">
                {mockServices[selectedBusiness.id]?.map((service) => (
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
                          {service.isEmergencyAvailable && (
                            <Badge variant="destructive" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Emergency
                            </Badge>
                          )}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Who is this appointment for?</h3>
              <div className="grid gap-4">
                {mockFamilyProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                      selectedProfile?.id === profile.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{profile.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{profile.relationship}</p>
                        {profile.phone && (
                          <p className="text-xs text-muted-foreground">{profile.phone}</p>
                        )}
                      </div>
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

          {step === 4 && (
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
              
              {/* Additional Options */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                {selectedService?.isEmergencyAvailable && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-red-500" />
                      <div>
                        <Label className="font-medium">Emergency Priority</Label>
                        <p className="text-sm text-muted-foreground">Get priority in queue (subject to approval)</p>
                      </div>
                    </div>
                    <Switch checked={isEmergency} onCheckedChange={setIsEmergency} />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <Label className="font-medium">Recurring Appointment</Label>
                      <p className="text-sm text-muted-foreground">Automatically book this appointment regularly</p>
                    </div>
                  </div>
                  <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-medium">Special Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or notes for your appointment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Review & Confirm</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card/40 border border-border/20">
                  <h4 className="font-semibold mb-2">Appointment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business:</span>
                      <span>{selectedBusiness?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span>{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">For:</span>
                      <span>{selectedProfile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{selectedDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedService?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="rainbow-text">${selectedService?.price}</span>
                    </div>
                  </div>
                </div>

                {(isEmergency || isRecurring || notes) && (
                  <div className="p-4 rounded-lg bg-card/40 border border-border/20">
                    <h4 className="font-semibold mb-2">Additional Options</h4>
                    <div className="space-y-2 text-sm">
                      {isEmergency && (
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-red-500" />
                          <span>Emergency priority requested</span>
                        </div>
                      )}
                      {isRecurring && (
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          <span>Recurring appointment enabled</span>
                        </div>
                      )}
                      {notes && (
                        <div>
                          <span className="text-muted-foreground">Notes: </span>
                          <span>{notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span className="font-semibold">AI Insights</span>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• You'll receive notifications 20 minutes before your appointment</li>
                    <li>• Current wait time is approximately {selectedBusiness?.waitTime}</li>
                    <li>• This business has a 95% on-time rating</li>
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

        {step < 5 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !selectedBusiness) ||
              (step === 2 && !selectedService) ||
              (step === 3 && !selectedProfile) ||
              (step === 4 && (!selectedDate || !selectedTime))
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
                Confirm Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}