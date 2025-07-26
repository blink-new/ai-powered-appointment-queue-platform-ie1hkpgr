import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Gift, 
  Star, 
  Trophy, 
  Crown, 
  Zap,
  Calendar,
  ShoppingBag,
  Award,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Sparkles,
  Heart,
  Coffee,
  Scissors,
  Car,
  Stethoscope
} from 'lucide-react'
import blink from '@/blink/client'

interface LoyaltyProgramProps {
  user: any
}

interface LoyaltyAccount {
  id: string
  businessId: string
  businessName: string
  businessCategory: string
  businessEmoji: string
  pointsBalance: number
  lifetimePoints: number
  tierLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextTierPoints: number
  pointsToNextTier: number
  memberSince: string
  lastActivity: string
  totalVisits: number
  totalSpent: number
}

interface Reward {
  id: string
  businessId: string
  title: string
  description: string
  pointsCost: number
  value: number
  category: 'discount' | 'freebie' | 'upgrade' | 'exclusive'
  isAvailable: boolean
  expiresAt?: string
  termsConditions: string
  emoji: string
}

interface PointsTransaction {
  id: string
  businessId: string
  businessName: string
  type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  points: number
  description: string
  date: string
  appointmentId?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  pointsAwarded: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const mockLoyaltyAccounts: LoyaltyAccount[] = [
  {
    id: 'loyalty_1',
    businessId: 'biz_medical',
    businessName: 'City Medical Center',
    businessCategory: 'Healthcare',
    businessEmoji: '🏥',
    pointsBalance: 1250,
    lifetimePoints: 3400,
    tierLevel: 'gold',
    nextTierPoints: 5000,
    pointsToNextTier: 1600,
    memberSince: '2023-06-15',
    lastActivity: '2024-01-20',
    totalVisits: 12,
    totalSpent: 1800
  },
  {
    id: 'loyalty_2',
    businessId: 'biz_salon',
    businessName: 'Elite Hair Salon',
    businessCategory: 'Beauty',
    businessEmoji: '💇',
    pointsBalance: 850,
    lifetimePoints: 2100,
    tierLevel: 'silver',
    nextTierPoints: 2500,
    pointsToNextTier: 400,
    memberSince: '2023-09-10',
    lastActivity: '2024-01-18',
    totalVisits: 8,
    totalSpent: 640
  },
  {
    id: 'loyalty_3',
    businessId: 'biz_auto',
    businessName: 'Quick Lube Express',
    businessCategory: 'Automotive',
    businessEmoji: '🚗',
    pointsBalance: 320,
    lifetimePoints: 890,
    tierLevel: 'bronze',
    nextTierPoints: 1000,
    pointsToNextTier: 110,
    memberSince: '2023-11-22',
    lastActivity: '2024-01-15',
    totalVisits: 6,
    totalSpent: 270
  }
]

const mockRewards: Reward[] = [
  {
    id: 'reward_1',
    businessId: 'biz_medical',
    title: '20% Off Next Consultation',
    description: 'Get 20% discount on your next general consultation appointment',
    pointsCost: 500,
    value: 30,
    category: 'discount',
    isAvailable: true,
    expiresAt: '2024-03-31',
    termsConditions: 'Valid for general consultations only. Cannot be combined with insurance.',
    emoji: '💊'
  },
  {
    id: 'reward_2',
    businessId: 'biz_medical',
    title: 'Free Health Screening',
    description: 'Complimentary basic health screening including blood pressure and BMI',
    pointsCost: 800,
    value: 50,
    category: 'freebie',
    isAvailable: true,
    termsConditions: 'Must be redeemed within 60 days. Appointment required.',
    emoji: '🩺'
  },
  {
    id: 'reward_3',
    businessId: 'biz_salon',
    title: 'Free Hair Wash & Blow Dry',
    description: 'Complimentary hair wash and professional blow dry service',
    pointsCost: 300,
    value: 25,
    category: 'freebie',
    isAvailable: true,
    termsConditions: 'Valid with any paid service. Cannot be used alone.',
    emoji: '💇'
  },
  {
    id: 'reward_4',
    businessId: 'biz_salon',
    title: 'VIP Treatment Upgrade',
    description: 'Upgrade any service to include premium products and extended treatment',
    pointsCost: 1200,
    value: 75,
    category: 'upgrade',
    isAvailable: true,
    termsConditions: 'Subject to availability. Must be requested at booking.',
    emoji: '👑'
  },
  {
    id: 'reward_5',
    businessId: 'biz_auto',
    title: 'Free Car Wash',
    description: 'Complimentary exterior car wash with any oil change service',
    pointsCost: 200,
    value: 15,
    category: 'freebie',
    isAvailable: true,
    termsConditions: 'Valid with oil change service only.',
    emoji: '🚿'
  }
]

const mockTransactions: PointsTransaction[] = [
  {
    id: 'trans_1',
    businessId: 'biz_medical',
    businessName: 'City Medical Center',
    type: 'earned',
    points: 150,
    description: 'General Consultation - $150 spent',
    date: '2024-01-20T10:30:00Z',
    appointmentId: 'apt_1'
  },
  {
    id: 'trans_2',
    businessId: 'biz_salon',
    businessName: 'Elite Hair Salon',
    type: 'redeemed',
    points: -300,
    description: 'Redeemed: Free Hair Wash & Blow Dry',
    date: '2024-01-18T14:15:00Z'
  },
  {
    id: 'trans_3',
    businessId: 'biz_medical',
    businessName: 'City Medical Center',
    type: 'bonus',
    points: 100,
    description: 'Birthday Bonus Points',
    date: '2024-01-15T00:00:00Z'
  },
  {
    id: 'trans_4',
    businessId: 'biz_auto',
    businessName: 'Quick Lube Express',
    type: 'earned',
    points: 45,
    description: 'Oil Change Service - $45 spent',
    date: '2024-01-15T16:45:00Z',
    appointmentId: 'apt_4'
  }
]

const mockAchievements: Achievement[] = [
  {
    id: 'ach_1',
    title: 'First Visit',
    description: 'Completed your first appointment',
    icon: '🎯',
    unlockedAt: '2023-06-15T10:00:00Z',
    pointsAwarded: 50,
    rarity: 'common'
  },
  {
    id: 'ach_2',
    title: 'Loyal Customer',
    description: 'Completed 10 appointments',
    icon: '⭐',
    unlockedAt: '2023-12-10T15:30:00Z',
    pointsAwarded: 200,
    rarity: 'rare'
  },
  {
    id: 'ach_3',
    title: 'Health Enthusiast',
    description: 'Completed 5 health screenings',
    icon: '💪',
    unlockedAt: '2024-01-05T09:15:00Z',
    pointsAwarded: 300,
    rarity: 'epic'
  },
  {
    id: 'ach_4',
    title: 'Early Bird',
    description: 'Booked 5 appointments before 9 AM',
    icon: '🌅',
    unlockedAt: '2023-11-20T08:00:00Z',
    pointsAwarded: 150,
    rarity: 'rare'
  }
]

export default function LoyaltyProgram({ user }: LoyaltyProgramProps) {
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<LoyaltyAccount[]>(mockLoyaltyAccounts)
  const [rewards, setRewards] = useState<Reward[]>(mockRewards)
  const [transactions, setTransactions] = useState<PointsTransaction[]>(mockTransactions)
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [selectedBusiness, setSelectedBusiness] = useState<string>(loyaltyAccounts[0]?.businessId || '')

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20'
      case 'silver': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
      case 'gold': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
      case 'platinum': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Award className="w-4 h-4" />
      case 'silver': return <Star className="w-4 h-4" />
      case 'gold': return <Trophy className="w-4 h-4" />
      case 'platinum': return <Crown className="w-4 h-4" />
      default: return <Award className="w-4 h-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return 'text-green-600'
      case 'bonus': return 'text-blue-600'
      case 'redeemed': return 'text-orange-600'
      case 'expired': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
      case 'rare': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
      case 'epic': return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20'
      case 'legendary': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const handleRedeemReward = async (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    const account = loyaltyAccounts.find(a => a.businessId === reward?.businessId)
    
    if (!reward || !account || account.pointsBalance < reward.pointsCost) {
      alert('Insufficient points or reward not found')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update points balance
      setLoyaltyAccounts(accounts => 
        accounts.map(acc => 
          acc.businessId === reward.businessId 
            ? { ...acc, pointsBalance: acc.pointsBalance - reward.pointsCost }
            : acc
        )
      )
      
      // Add transaction
      const newTransaction: PointsTransaction = {
        id: `trans_${Date.now()}`,
        businessId: reward.businessId,
        businessName: account.businessName,
        type: 'redeemed',
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.title}`,
        date: new Date().toISOString()
      }
      
      setTransactions([newTransaction, ...transactions])
      alert(`Successfully redeemed: ${reward.title}`)
    } catch (error) {
      console.error('Failed to redeem reward:', error)
      alert('Failed to redeem reward. Please try again.')
    }
  }

  const totalPoints = loyaltyAccounts.reduce((sum, account) => sum + account.pointsBalance, 0)
  const totalLifetimePoints = loyaltyAccounts.reduce((sum, account) => sum + account.lifetimePoints, 0)
  const selectedAccount = loyaltyAccounts.find(acc => acc.businessId === selectedBusiness)
  const businessRewards = rewards.filter(r => r.businessId === selectedBusiness)
  const recentTransactions = transactions.slice(0, 10)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="rainbow-text">Loyalty</span> Rewards
        </h1>
        <p className="text-muted-foreground">
          Earn points • Unlock rewards • Achieve milestones • Get exclusive perks
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Available Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalLifetimePoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Lifetime Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{loyaltyAccounts.length}</p>
                <p className="text-sm text-muted-foreground">Programs Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{achievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">My Programs</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* My Programs Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Loyalty Programs</h2>
          
          <div className="grid gap-6">
            {loyaltyAccounts.map((account) => (
              <Card key={account.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{account.businessEmoji}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{account.businessName}</h3>
                        <p className="text-muted-foreground">{account.businessCategory}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTierColor(account.tierLevel)}>
                            {getTierIcon(account.tierLevel)}
                            <span className="ml-1 capitalize">{account.tierLevel}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Member since {new Date(account.memberSince).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold rainbow-text">{account.pointsBalance.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">points available</p>
                    </div>
                  </div>
                  
                  {/* Progress to Next Tier */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress to {account.tierLevel === 'platinum' ? 'Max Tier' : 'Next Tier'}</span>
                      <span className="text-sm text-muted-foreground">
                        {account.lifetimePoints.toLocaleString()} / {account.nextTierPoints.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={(account.lifetimePoints / account.nextTierPoints) * 100} 
                      className="h-2"
                    />
                    {account.tierLevel !== 'platinum' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.pointsToNextTier.toLocaleString()} points to next tier
                      </p>
                    )}
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Visits</p>
                      <p className="font-semibold">{account.totalVisits}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Spent</p>
                      <p className="font-semibold">${account.totalSpent}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lifetime Points</p>
                      <p className="font-semibold">{account.lifetimePoints.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Activity</p>
                      <p className="font-semibold">{new Date(account.lastActivity).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border/20">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedBusiness(account.businessId)}
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      View Rewards
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Available Rewards</h2>
            <select 
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="px-3 py-2 border border-border/40 rounded-md bg-background"
            >
              {loyaltyAccounts.map((account) => (
                <option key={account.businessId} value={account.businessId}>
                  {account.businessEmoji} {account.businessName}
                </option>
              ))}
            </select>
          </div>
          
          {selectedAccount && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedAccount.businessEmoji}</div>
                    <div>
                      <h3 className="font-semibold">{selectedAccount.businessName}</h3>
                      <p className="text-sm text-muted-foreground">
                        You have {selectedAccount.pointsBalance.toLocaleString()} points available
                      </p>
                    </div>
                  </div>
                  <Badge className={getTierColor(selectedAccount.tierLevel)}>
                    {getTierIcon(selectedAccount.tierLevel)}
                    <span className="ml-1 capitalize">{selectedAccount.tierLevel} Member</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            {businessRewards.map((reward) => (
              <Card key={reward.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{reward.emoji}</div>
                      <div>
                        <h3 className="font-semibold">{reward.title}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <Badge variant={reward.category === 'exclusive' ? 'default' : 'secondary'}>
                      {reward.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{reward.pointsCost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">${reward.value}</p>
                        <p className="text-xs text-muted-foreground">value</p>
                      </div>
                    </div>
                    {reward.expiresAt && (
                      <div className="text-right">
                        <p className="text-sm text-red-600">Expires</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reward.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-4">
                    {reward.termsConditions}
                  </p>
                  
                  <Button 
                    onClick={() => handleRedeemReward(reward.id)}
                    disabled={!selectedAccount || selectedAccount.pointsBalance < reward.pointsCost}
                    className="w-full rainbow-gradient hover:opacity-90 disabled:opacity-50"
                  >
                    {selectedAccount && selectedAccount.pointsBalance >= reward.pointsCost ? (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem Reward
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Insufficient Points
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <h2 className="text-2xl font-semibold">Points History</h2>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100 dark:bg-green-950/20' :
                        transaction.type === 'bonus' ? 'bg-blue-100 dark:bg-blue-950/20' :
                        transaction.type === 'redeemed' ? 'bg-orange-100 dark:bg-orange-950/20' :
                        'bg-red-100 dark:bg-red-950/20'
                      }`}>
                        {transaction.type === 'earned' && <TrendingUp className="w-5 h-5 text-green-600" />}
                        {transaction.type === 'bonus' && <Sparkles className="w-5 h-5 text-blue-600" />}
                        {transaction.type === 'redeemed' && <Gift className="w-5 h-5 text-orange-600" />}
                        {transaction.type === 'expired' && <Clock className="w-5 h-5 text-red-600" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{transaction.businessName}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Achievements</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Unlocked</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-600">
                            +{achievement.pointsAwarded} points
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Progress Towards New Achievements */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Progress Towards New Achievements</span>
              </CardTitle>
              <CardDescription>Keep using our services to unlock more rewards!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🏆 VIP Status (20 appointments)</span>
                    <span className="text-sm text-muted-foreground">15/20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">💎 Big Spender ($5,000 total)</span>
                    <span className="text-sm text-muted-foreground">$2,710/$5,000</span>
                  </div>
                  <Progress value={54} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">🌟 Referral Master (5 referrals)</span>
                    <span className="text-sm text-muted-foreground">2/5</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}