import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Clock,
  DollarSign,
  User,
  Building2,
  Phone,
  Mail
} from 'lucide-react'
import blink from '@/blink/client'

interface InsuranceIntegrationProps {
  user: any
}

interface InsuranceProvider {
  id: string
  name: string
  code: string
  logo?: string
  isActive: boolean
}

interface UserInsurance {
  id: string
  providerId: string
  providerName: string
  policyNumber: string
  groupNumber?: string
  memberName: string
  memberDOB: string
  isPrimary: boolean
  isActive: boolean
  effectiveDate: string
  expirationDate?: string
  copayAmount?: number
  deductibleAmount?: number
  coverageType: string
}

interface InsuranceClaim {
  id: string
  appointmentId: string
  businessName: string
  serviceName: string
  claimAmount: number
  copayAmount: number
  claimStatus: 'pending' | 'approved' | 'denied' | 'processing'
  submittedDate: string
  processedDate?: string
  denialReason?: string
  claimNumber: string
}

interface EligibilityCheck {
  id: string
  providerId: string
  businessId: string
  serviceType: string
  isEligible: boolean
  copayAmount?: number
  deductibleRemaining?: number
  coveragePercentage?: number
  priorAuthRequired: boolean
  checkedDate: string
}

const mockInsuranceProviders: InsuranceProvider[] = [
  { id: 'ins_aetna', name: 'Aetna', code: 'AETNA', isActive: true },
  { id: 'ins_bcbs', name: 'Blue Cross Blue Shield', code: 'BCBS', isActive: true },
  { id: 'ins_cigna', name: 'Cigna', code: 'CIGNA', isActive: true },
  { id: 'ins_humana', name: 'Humana', code: 'HUMANA', isActive: true },
  { id: 'ins_uhc', name: 'UnitedHealthcare', code: 'UHC', isActive: true },
  { id: 'ins_kaiser', name: 'Kaiser Permanente', code: 'KAISER', isActive: true },
  { id: 'ins_medicare', name: 'Medicare', code: 'MEDICARE', isActive: true },
  { id: 'ins_medicaid', name: 'Medicaid', code: 'MEDICAID', isActive: true }
]

const mockUserInsurance: UserInsurance[] = [
  {
    id: 'ui_1',
    providerId: 'ins_bcbs',
    providerName: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456789',
    groupNumber: 'GRP001',
    memberName: 'John Doe',
    memberDOB: '1985-06-15',
    isPrimary: true,
    isActive: true,
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    copayAmount: 25,
    deductibleAmount: 1500,
    coverageType: 'PPO'
  },
  {
    id: 'ui_2',
    providerId: 'ins_medicare',
    providerName: 'Medicare',
    policyNumber: 'MED987654321',
    memberName: 'John Doe',
    memberDOB: '1985-06-15',
    isPrimary: false,
    isActive: true,
    effectiveDate: '2024-01-01',
    copayAmount: 0,
    deductibleAmount: 250,
    coverageType: 'Medicare Supplement'
  }
]

const mockClaims: InsuranceClaim[] = [
  {
    id: 'claim_1',
    appointmentId: 'apt_1',
    businessName: 'City Medical Center',
    serviceName: 'General Consultation',
    claimAmount: 150,
    copayAmount: 25,
    claimStatus: 'approved',
    submittedDate: '2024-01-20T10:00:00Z',
    processedDate: '2024-01-22T14:30:00Z',
    claimNumber: 'CLM2024001'
  },
  {
    id: 'claim_2',
    appointmentId: 'apt_2',
    businessName: 'Metro Dental Care',
    serviceName: 'Dental Cleaning',
    claimAmount: 120,
    copayAmount: 25,
    claimStatus: 'processing',
    submittedDate: '2024-01-25T09:15:00Z',
    claimNumber: 'CLM2024002'
  },
  {
    id: 'claim_3',
    appointmentId: 'apt_3',
    businessName: 'Elite Eye Care',
    serviceName: 'Eye Exam',
    claimAmount: 200,
    copayAmount: 25,
    claimStatus: 'denied',
    submittedDate: '2024-01-18T11:45:00Z',
    processedDate: '2024-01-21T16:20:00Z',
    denialReason: 'Service not covered under current plan',
    claimNumber: 'CLM2024003'
  }
]

const mockEligibilityChecks: EligibilityCheck[] = [
  {
    id: 'elig_1',
    providerId: 'ins_bcbs',
    businessId: 'biz_medical',
    serviceType: 'General Consultation',
    isEligible: true,
    copayAmount: 25,
    deductibleRemaining: 1200,
    coveragePercentage: 80,
    priorAuthRequired: false,
    checkedDate: '2024-01-26T08:00:00Z'
  },
  {
    id: 'elig_2',
    providerId: 'ins_bcbs',
    businessId: 'biz_specialist',
    serviceType: 'Specialist Consultation',
    isEligible: true,
    copayAmount: 50,
    deductibleRemaining: 1200,
    coveragePercentage: 80,
    priorAuthRequired: true,
    checkedDate: '2024-01-26T08:05:00Z'
  }
]

export default function InsuranceIntegration({ user }: InsuranceIntegrationProps) {
  const [userInsurance, setUserInsurance] = useState<UserInsurance[]>(mockUserInsurance)
  const [claims, setClaims] = useState<InsuranceClaim[]>(mockClaims)
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityCheck[]>(mockEligibilityChecks)
  const [showAddInsurance, setShowAddInsurance] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [groupNumber, setGroupNumber] = useState('')
  const [memberName, setMemberName] = useState('')
  const [memberDOB, setMemberDOB] = useState('')
  const [loading, setLoading] = useState(false)

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 dark:bg-green-950/20'
      case 'denied': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      case 'processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const handleAddInsurance = async () => {
    if (!selectedProvider || !policyNumber || !memberName || !memberDOB) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const provider = mockInsuranceProviders.find(p => p.id === selectedProvider)
      const newInsurance: UserInsurance = {
        id: `ui_${Date.now()}`,
        providerId: selectedProvider,
        providerName: provider?.name || '',
        policyNumber,
        groupNumber: groupNumber || undefined,
        memberName,
        memberDOB,
        isPrimary: userInsurance.length === 0,
        isActive: true,
        effectiveDate: new Date().toISOString().split('T')[0],
        coverageType: 'Unknown'
      }
      
      setUserInsurance([...userInsurance, newInsurance])
      setShowAddInsurance(false)
      
      // Reset form
      setSelectedProvider('')
      setPolicyNumber('')
      setGroupNumber('')
      setMemberName('')
      setMemberDOB('')
      
      alert('Insurance added successfully!')
    } catch (error) {
      console.error('Failed to add insurance:', error)
      alert('Failed to add insurance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEligibilityCheck = async (businessId: string, serviceType: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate eligibility check
      const newCheck: EligibilityCheck = {
        id: `elig_${Date.now()}`,
        providerId: userInsurance[0]?.providerId || '',
        businessId,
        serviceType,
        isEligible: Math.random() > 0.2, // 80% chance of eligibility
        copayAmount: Math.random() > 0.5 ? 25 : 50,
        deductibleRemaining: Math.floor(Math.random() * 1500),
        coveragePercentage: Math.random() > 0.5 ? 80 : 70,
        priorAuthRequired: Math.random() > 0.7,
        checkedDate: new Date().toISOString()
      }
      
      setEligibilityChecks([newCheck, ...eligibilityChecks])
      alert(`Eligibility check complete: ${newCheck.isEligible ? 'Covered' : 'Not covered'}`)
    } catch (error) {
      console.error('Eligibility check failed:', error)
      alert('Eligibility check failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalClaimAmount = claims.reduce((sum, claim) => sum + claim.claimAmount, 0)
  const approvedClaims = claims.filter(claim => claim.claimStatus === 'approved')
  const pendingClaims = claims.filter(claim => claim.claimStatus === 'pending' || claim.claimStatus === 'processing')

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="rainbow-text">Insurance</span> Integration
        </h1>
        <p className="text-muted-foreground">
          Manage insurance cards • Check eligibility • Track claims • Streamline healthcare payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userInsurance.filter(i => i.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{claims.length}</p>
                <p className="text-sm text-muted-foreground">Total Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">${totalClaimAmount}</p>
                <p className="text-sm text-muted-foreground">Claim Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round((approvedClaims.length / claims.length) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insurance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insurance">Insurance Cards</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        {/* Insurance Cards Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Insurance Cards</h2>
            <Button 
              onClick={() => setShowAddInsurance(true)}
              className="rainbow-gradient hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Insurance
            </Button>
          </div>

          {showAddInsurance && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Add New Insurance</CardTitle>
                <CardDescription>Enter your insurance information to enable coverage verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Insurance Provider *</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your insurance provider" />
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
                  
                  <div>
                    <Label htmlFor="policy">Policy Number *</Label>
                    <Input
                      id="policy"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="Enter policy number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="group">Group Number</Label>
                    <Input
                      id="group"
                      value={groupNumber}
                      onChange={(e) => setGroupNumber(e.target.value)}
                      placeholder="Enter group number (optional)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="member">Member Name *</Label>
                    <Input
                      id="member"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="Full name as on card"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={memberDOB}
                      onChange={(e) => setMemberDOB(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Button 
                    onClick={handleAddInsurance}
                    disabled={loading}
                    className="rainbow-gradient hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Insurance
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddInsurance(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {userInsurance.map((insurance) => (
              <Card key={insurance.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-6 h-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold text-lg">{insurance.providerName}</h3>
                          <p className="text-sm text-muted-foreground">{insurance.coverageType}</p>
                        </div>
                        {insurance.isPrimary && (
                          <Badge className="rainbow-gradient text-white border-0">Primary</Badge>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Policy Number</p>
                          <p className="font-mono">{insurance.policyNumber}</p>
                        </div>
                        {insurance.groupNumber && (
                          <div>
                            <p className="text-muted-foreground">Group Number</p>
                            <p className="font-mono">{insurance.groupNumber}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Member Name</p>
                          <p>{insurance.memberName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Date of Birth</p>
                          <p>{new Date(insurance.memberDOB).toLocaleDateString()}</p>
                        </div>
                        {insurance.copayAmount && (
                          <div>
                            <p className="text-muted-foreground">Copay</p>
                            <p className="font-semibold text-green-600">${insurance.copayAmount}</p>
                          </div>
                        )}
                        {insurance.deductibleAmount && (
                          <div>
                            <p className="text-muted-foreground">Deductible</p>
                            <p className="font-semibold text-blue-600">${insurance.deductibleAmount}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border/20">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download Card
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Eligibility Tab */}
        <TabsContent value="eligibility" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Eligibility Verification</h2>
            <Button 
              onClick={() => handleEligibilityCheck('biz_test', 'Test Service')}
              disabled={loading || userInsurance.length === 0}
              className="rainbow-gradient hover:opacity-90"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Check Eligibility
                </>
              )}
            </Button>
          </div>

          {userInsurance.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Insurance Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add your insurance information to check eligibility for services
                </p>
                <Button 
                  onClick={() => setShowAddInsurance(true)}
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Insurance
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {eligibilityChecks.map((check) => (
                <Card key={check.id} className="border-border/40">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {check.isEligible ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          )}
                          <div>
                            <h3 className="font-semibold">{check.serviceType}</h3>
                            <p className="text-sm text-muted-foreground">
                              Checked {new Date(check.checkedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={check.isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {check.isEligible ? 'Covered' : 'Not Covered'}
                          </Badge>
                        </div>
                        
                        {check.isEligible && (
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            {check.copayAmount && (
                              <div>
                                <p className="text-muted-foreground">Your Copay</p>
                                <p className="font-semibold text-green-600">${check.copayAmount}</p>
                              </div>
                            )}
                            {check.coveragePercentage && (
                              <div>
                                <p className="text-muted-foreground">Coverage</p>
                                <p className="font-semibold text-blue-600">{check.coveragePercentage}%</p>
                              </div>
                            )}
                            {check.deductibleRemaining !== undefined && (
                              <div>
                                <p className="text-muted-foreground">Deductible Remaining</p>
                                <p className="font-semibold text-purple-600">${check.deductibleRemaining}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {check.priorAuthRequired && (
                          <div className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Prior authorization required for this service
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Insurance Claims</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{pendingClaims.length} Pending</Badge>
              <Badge variant="outline">{approvedClaims.length} Approved</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {claims.map((claim) => (
              <Card key={claim.id} className="border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold">{claim.businessName}</h3>
                          <p className="text-sm text-muted-foreground">{claim.serviceName}</p>
                        </div>
                        <Badge className={getClaimStatusColor(claim.claimStatus)}>
                          {claim.claimStatus.charAt(0).toUpperCase() + claim.claimStatus.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Claim Number</p>
                          <p className="font-mono">{claim.claimNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Claim Amount</p>
                          <p className="font-semibold">${claim.claimAmount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Your Copay</p>
                          <p className="font-semibold text-green-600">${claim.copayAmount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p>{new Date(claim.submittedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {claim.processedDate && (
                        <p className="text-sm text-muted-foreground">
                          Processed on {new Date(claim.processedDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {claim.denialReason && (
                        <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-800 dark:text-red-200">
                              <strong>Denial Reason:</strong> {claim.denialReason}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border/20">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {claim.claimStatus === 'denied' && (
                          <Button variant="outline" size="sm" className="text-blue-600">
                            <Upload className="w-4 h-4 mr-1" />
                            Appeal
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-6">
          <h2 className="text-2xl font-semibold">Benefits Summary</h2>
          
          {userInsurance.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Insurance Information</h3>
                <p className="text-muted-foreground mb-4">
                  Add your insurance to view benefits and coverage details
                </p>
                <Button 
                  onClick={() => setShowAddInsurance(true)}
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Insurance
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {userInsurance.map((insurance) => (
                <Card key={insurance.id} className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span>{insurance.providerName}</span>
                      {insurance.isPrimary && (
                        <Badge className="rainbow-gradient text-white border-0">Primary</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{insurance.coverageType} Plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Cost Sharing
                        </h4>
                        {insurance.copayAmount && (
                          <div>
                            <p className="text-sm text-muted-foreground">Primary Care Copay</p>
                            <p className="text-2xl font-bold text-green-600">${insurance.copayAmount}</p>
                          </div>
                        )}
                        {insurance.deductibleAmount && (
                          <div>
                            <p className="text-sm text-muted-foreground">Annual Deductible</p>
                            <p className="text-2xl font-bold text-blue-600">${insurance.deductibleAmount}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Coverage Period
                        </h4>
                        <div>
                          <p className="text-sm text-muted-foreground">Effective Date</p>
                          <p className="font-semibold">{new Date(insurance.effectiveDate).toLocaleDateString()}</p>
                        </div>
                        {insurance.expirationDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">Expiration Date</p>
                            <p className="font-semibold">{new Date(insurance.expirationDate).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Quick Actions
                        </h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check Eligibility
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            View Claims
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Download Card
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}