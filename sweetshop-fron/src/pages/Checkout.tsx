import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { Check } from 'lucide-react'
import { orderService } from '@/services/order.service'

export default function Checkout() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if any field is empty
    const isEmpty = Object.values(form).some(value => !value.trim())
    if (isEmpty) {
      alert('❌ Please fill all fields')
      return
    }

    // Check if cart is empty
    if (items.length === 0) {
      alert('🛒 Your cart is empty!')
      return
    }

    try {
      setLoading(true)
      
      // Create order via backend
      const payload = {
        items,
        total,
        shippingAddress: { ...form },
        paymentMethod: 'COD'
      }

      await orderService.createOrder(payload)

      // Clear cart
      clearCart()

      // Success message
      alert(`✅ Order placed successfully!`)
      navigate('/orders')
    } catch (error) {
      alert('❌ Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Full Name', field: 'name', placeholder: 'John Doe' },
                  { label: 'Address', field: 'address', placeholder: 'Street address' },
                  { label: 'City', field: 'city', placeholder: 'City' },
                  { label: 'Pincode', field: 'pincode', placeholder: 'Pincode' },
                  { label: 'Phone Number', field: 'phone', placeholder: 'Phone number' }
                ].map(({ label, field, placeholder }) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium">{label}</label>
                    <Input
                      placeholder={placeholder}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => updateForm(field, e.target.value)}
                      required
                    />
                  </div>
                ))}
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={loading || items.length === 0}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>₹{total > 999 ? 0 : 99}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (18%)</span>
                    <span>₹{Math.round(total * 0.18)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{total + (total > 999 ? 0 : 99) + Math.round(total * 0.18)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-500">
                      Get free shipping on orders above ₹999
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}