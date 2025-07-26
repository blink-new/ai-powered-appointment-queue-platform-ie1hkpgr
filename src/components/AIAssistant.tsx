import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  Volume2,
  VolumeX,
  Brain,
  Clock,
  MapPin,
  Calendar,
  Zap,
  User,
  Bot,
  Loader2,
  Play,
  Pause,
  Square
} from 'lucide-react'
import blink from '@/blink/client'

interface AIAssistantProps {
  user: any
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isVoice?: boolean
  audioUrl?: string
}

interface QuickAction {
  id: string
  label: string
  icon: any
  description: string
  action: string
}

const quickActions: QuickAction[] = [
  {
    id: 'check_wait',
    label: 'Check Wait Times',
    icon: Clock,
    description: 'Get current wait times for your appointments',
    action: 'What are my current wait times?'
  },
  {
    id: 'find_nearby',
    label: 'Find Nearby',
    icon: MapPin,
    description: 'Find faster alternatives nearby',
    action: 'Find me faster options nearby for my next appointment'
  },
  {
    id: 'book_appointment',
    label: 'Book Appointment',
    icon: Calendar,
    description: 'Schedule a new appointment',
    action: 'Help me book a new appointment'
  },
  {
    id: 'emergency_help',
    label: 'Emergency Help',
    icon: Zap,
    description: 'Get priority assistance',
    action: 'I need emergency priority for my appointment'
  }
]

const sampleResponses = [
  "I can see you have 3 active appointments. Your next one at City Medical Center has a 5-minute wait time. Would you like me to check for faster alternatives nearby?",
  "Based on your location, I found QuickCare Medical just 0.3 miles away with no wait time. They offer the same service and have excellent ratings. Should I help you reschedule?",
  "I'd be happy to help you book a new appointment! What type of service are you looking for, and do you have a preferred location or time?",
  "I've submitted your emergency priority request to the business. Emergency requests are typically approved within 5 minutes. I'll notify you as soon as I receive a response.",
  "Your appointment at Elite Hair Salon has been moved up by 10 minutes due to a cancellation. You're now scheduled for 2:50 PM instead of 3:00 PM.",
  "I notice you have a recurring appointment pattern. Would you like me to automatically book your next monthly checkup at City Medical Center?",
  "The weather looks great today! Your walk to the dental appointment will take about 12 minutes. I recommend leaving at 2:15 PM to arrive on time."
]

export default function AIAssistant({ user }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${user.email?.split('@')[0]}! I'm your AI assistant. I can help you manage appointments, find nearby options, check wait times, and handle emergency requests. How can I assist you today?`,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateVoiceResponse = async (text: string) => {
    try {
      // In a real app, you would use blink.ai.generateSpeech
      // const { url } = await blink.ai.generateSpeech({
      //   text,
      //   voice: 'nova'
      // })
      // playAudio(url)
      
      // For demo, we'll simulate voice generation
      console.log('Voice response generated for:', text)
    } catch (error) {
      console.error('Voice generation failed:', error)
    }
  }

  const handleSendMessage = async (content: string, isVoice = false) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      isVoice
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)

      // Generate voice response if enabled
      if (voiceEnabled) {
        generateVoiceResponse(randomResponse)
      }
    }, 1500)
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true)
      
      // Convert blob to base64 for transcription
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const base64Data = dataUrl.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      // In a real app, you would use blink.ai.transcribeAudio
      // const { text } = await blink.ai.transcribeAudio({
      //   audio: base64Audio,
      //   language: 'en'
      // })
      
      // For demo, simulate transcription
      const mockTranscriptions = [
        "What's my wait time at the medical center?",
        "Find me a faster hair salon nearby",
        "Book me an appointment for tomorrow",
        "I need emergency priority for my dental appointment",
        "Cancel my appointment at the auto shop"
      ]
      const transcribedText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
      
      await handleSendMessage(transcribedText, true)
    } catch (error) {
      console.error('Transcription failed:', error)
      alert('Voice transcription failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data])
      }
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await transcribeAudio(audioBlob)
        setAudioChunks([])
      }
      
      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording failed:', error)
      alert('Microphone access denied or not available')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(audioUrl)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.action)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="rainbow-text">AI Assistant</span>
          </h1>
          <p className="text-muted-foreground">
            Get help with appointments, queues, and smart recommendations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="rainbow-gradient text-white border-0">
            <Brain className="w-4 h-4 mr-1" />
            AI Powered
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="border-primary/20 hover:bg-primary/10"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks I can help you with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleQuickAction(action)}
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border/40 hover:border-primary/40 hover:bg-primary/5"
              >
                <action.icon className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="border-border/40 h-96">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            Chat with AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary/20' 
                      : 'rainbow-gradient'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-card border border-border/40'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.isVoice && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="rainbow-gradient w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-xs lg:max-w-md">
                    <div className="p-3 rounded-lg bg-card border border-border/40">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/40 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask me anything about your appointments..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                  className="pr-12"
                />
                <Button
                  size="sm"
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-1 top-1 h-8 w-8 p-0 rainbow-gradient hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`w-10 h-10 p-0 ${
                  isRecording 
                    ? 'animate-pulse' 
                    : 'border-primary/20 hover:bg-primary/10'
                }`}
              >
                {isRecording ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {isRecording && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Recording... Click stop when finished</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            What I Can Help With
          </CardTitle>
          <CardDescription>
            Powered by advanced AI to understand your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <Clock className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-semibold mb-1">Queue Management</h4>
              <p className="text-sm text-muted-foreground">
                Check wait times, get updates, and manage your queue position
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <MapPin className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-semibold mb-1">Location Services</h4>
              <p className="text-sm text-muted-foreground">
                Find nearby alternatives, get directions, and compare options
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <Calendar className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-semibold mb-1">Booking Assistant</h4>
              <p className="text-sm text-muted-foreground">
                Schedule appointments, reschedule, and manage recurring bookings
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <Zap className="w-6 h-6 text-red-500 mb-2" />
              <h4 className="font-semibold mb-1">Emergency Support</h4>
              <p className="text-sm text-muted-foreground">
                Handle urgent requests, priority booking, and emergency assistance
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
              <Volume2 className="w-6 h-6 text-yellow-500 mb-2" />
              <h4 className="font-semibold mb-1">Voice Interaction</h4>
              <p className="text-sm text-muted-foreground">
                Speak naturally, get voice responses, and hands-free operation
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
              <Brain className="w-6 h-6 text-indigo-500 mb-2" />
              <h4 className="font-semibold mb-1">Smart Predictions</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered insights, recommendations, and predictive assistance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element for voice playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(null)}
        className="hidden"
      />
    </div>
  )
}