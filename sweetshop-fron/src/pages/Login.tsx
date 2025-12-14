import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
// Remove useToast import
import { toast } from 'sonner' // Add sonner toast

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  // Remove: const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      // Replace with sonner toast
      toast.error('Please fill all fields')
      // OR simple alert: alert('❌ Please fill all fields')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      // Replace with sonner toast
      toast.success('Logged in successfully')
      // OR simple alert: alert('✅ Login successful!')
      navigate('/')
    } catch (error) {
      // Replace with sonner toast
      toast.error('Invalid credentials')
      // OR simple alert: alert('❌ Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-secondary rounded-lg">
            <p className="text-sm font-medium mb-2">Demo credentials:</p>
            <p className="text-xs text-muted-foreground">User: user@example.com / password</p>
            <p className="text-xs text-muted-foreground">Admin: admin@example.com / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}