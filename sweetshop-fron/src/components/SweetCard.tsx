import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/context/CartContext'
import { Plus, Minus } from 'lucide-react'

interface SweetCardProps {
  sweet: {
    _id: string
    name: string
    price: number
    quantity?: number
    stock?: number
    description?: string
  }
}

export default function SweetCard({ sweet }: SweetCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(item => item.id === (sweet._id || ''))
  const quantity = cartItem?.quantity || 0

  const available = sweet.quantity ?? sweet.stock ?? 0

  return (
    <Card className="bw-card overflow-hidden">
      <CardContent className="p-6">
        {/* Image placeholder */}
        <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center mb-4">
          <span className="text-4xl text-muted-foreground">
            {sweet.name.charAt(0)}
          </span>
        </div>
        
        {/* Info */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">{sweet.name}</h3>
          {sweet.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {sweet.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">₹{sweet.price}</span>
            <span className={`text-xs px-2 py-1 rounded ${available > 5 ? 'bg-secondary' : 'bg-destructive/10 text-destructive'}`}>
              {available > 0 ? `${available} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Quantity Controls */}
        {quantity > 0 ? (
          <div className="flex items-center justify-between border rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(sweet._id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-medium">{quantity} in cart</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(sweet._id, quantity + 1)}
              disabled={available <= quantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            variant={available === 0 ? "outline" : "default"}
            disabled={available === 0}
            onClick={() => addItem({
              id: sweet._id,
              name: sweet.name,
              price: sweet.price,
              stock: available
            })}
          >
            {available === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}