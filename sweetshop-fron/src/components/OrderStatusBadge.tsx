import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react'

type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderStatusBadgeProps {
  status: Status
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = {
    pending: {
      label: 'Pending',
      icon: Clock,
      variant: 'outline' as const,
    },
    processing: {
      label: 'Processing',
      icon: Package,
      variant: 'secondary' as const,
    },
    shipped: {
      label: 'Shipped',
      icon: Truck,
      variant: 'secondary' as const,
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle,
      variant: 'default' as const,
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      variant: 'destructive' as const,
    }
  }

  const { label, icon: Icon, variant } = config[status]

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}