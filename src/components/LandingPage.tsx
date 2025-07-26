import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  MapPin, 
  Zap, 
  Users, 
  Brain, 
  Bell, 
  Calendar, 
  Shield,
  Smartphone,
  Globe,
  ArrowRight,
  Play
} from 'lucide-react'
import blink from '@/blink/client'

const features = [
  {
    icon: Clock,
    title: "20-Minute Smart Alerts",
    description: "Get voice and push notifications exactly when you need them, never miss your turn again."
  },
  {
    icon: Brain,
    title: "AI Time Prediction",
    description: "Machine learning predicts exact wait times based on service complexity and historical data."
  },
  {
    icon: Zap,
    title: "Emergency Boost",
    description: "Priority queue system for urgent cases with admin approval and automatic reshuffling."
  },
  {
    icon: MapPin,
    title: "Fastest Nearby Options",
    description: "AI finds and suggests faster alternatives nearby with real-time availability."
  },
  {
    icon: Users,
    title: "Family Profiles",
    description: "Manage multiple profiles for family members, book for others seamlessly."
  },
  {
    icon: Bell,
    title: "Live Status Tracking",
    description: "Real-time updates when service starts, stops, or delays occur."
  },
  {
    icon: Calendar,
    title: "Auto-Book Next Slot",
    description: "Monitors cancellations and automatically books the next available slot for you."
  },
  {
    icon: Shield,
    title: "Recurring Scheduling",
    description: "Set up automatic recurring appointments for regular services."
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Available in Hindi, Bengali, Tamil, English with voice alerts in your language."
  }
]

const industries = [
  {
    emoji: "🏥",
    name: "Healthcare",
    description: "Clinics, hospitals, dental offices"
  },
  {
    emoji: "💇",
    name: "Beauty & Wellness",
    description: "Salons, spas, barbershops"
  },
  {
    emoji: "🔧",
    name: "Repair Services",
    description: "Auto repair, electronics, appliances"
  },
  {
    emoji: "🎓",
    name: "Education",
    description: "Schools, tutoring, consultations"
  },
  {
    emoji: "🏛️",
    name: "Government",
    description: "DMV, permits, public services"
  },
  {
    emoji: "🏪",
    name: "Retail",
    description: "Customer service, consultations"
  },
  {
    emoji: "⚖️",
    name: "Professional",
    description: "Legal, financial, consulting"
  },
  {
    emoji: "🍽️",
    name: "Food & Dining",
    description: "Restaurants, takeout, catering"
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rainbow-gradient w-10 h-10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold rainbow-text">Smart Q</span>
          </div>
          <Button 
            onClick={() => blink.auth.login()}
            className="rainbow-gradient hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="rainbow-gradient mb-6 text-white border-0">
            🚀 Revolutionary Queue Management
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Never Wait in the{' '}
            <span className="rainbow-text">Dark</span>{' '}
            Again
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered real-time appointment and queue management that eliminates waiting uncertainty. 
            Get 20-minute alerts, find fastest nearby options, and book with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => blink.auth.login()}
              className="rainbow-gradient hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Free Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/10 text-lg px-8 py-6"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold rainbow-text">20min</div>
              <div className="text-sm text-muted-foreground">Smart Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold rainbow-text">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold rainbow-text">24/7</div>
              <div className="text-sm text-muted-foreground">Live Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Revolutionary Features for{' '}
              <span className="rainbow-text">Every Industry</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From clinics to salons, repair shops to schools - transform how your customers experience waiting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/40 hover:border-primary/40 transition-colors group">
                <CardHeader>
                  <div className="rainbow-gradient w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:rainbow-glow transition-all">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Perfect for{' '}
              <span className="rainbow-text">Any Industry</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              One platform, endless possibilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="text-center border-border/40 hover:border-primary/40 transition-colors group">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{industry.emoji}</div>
                  <h3 className="font-semibold mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/20">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Eliminate{' '}
            <span className="rainbow-text">Waiting Frustration</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of businesses and customers who've revolutionized their appointment experience
          </p>
          <Button 
            size="lg" 
            onClick={() => blink.auth.login()}
            className="rainbow-gradient hover:opacity-90 transition-opacity text-lg px-12 py-6"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="rainbow-gradient w-8 h-8 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold rainbow-text">Smart Q</span>
          </div>
          <p className="text-muted-foreground">
            Transforming appointments and queues with AI-powered intelligence
          </p>
        </div>
      </footer>
    </div>
  )
}