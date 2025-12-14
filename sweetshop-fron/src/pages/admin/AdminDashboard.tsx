import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Edit, Trash2, Plus, Search, Loader } from 'lucide-react'
import { sweetService } from '@/services/sweet.service'

type Sweet = {
  _id?: string
  id?: string | number
  name: string
  price: number
  quantity?: number
  stock?: number
  category?: string
}

const CATEGORIES = ['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other']

export default function AdminDashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: 'Other' })

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('[AdminDashboard] Fetching sweets...')
      const res = await sweetService.getAll()
      console.log('[AdminDashboard] API Response:', res)
      
      // Response structure: { success, message, data: [...], pagination: {...} }
      if (res && res.data && Array.isArray(res.data)) {
        console.log('[AdminDashboard] Setting sweets:', res.data)
        setSweets(res.data)
      } else {
        console.warn('[AdminDashboard] Invalid response format:', res)
        setSweets([])
        setError('Invalid response format from server')
      }
    } catch (error: any) {
      console.error('[AdminDashboard] Error fetching sweets:', error)
      setSweets([])
      setError(error.message || 'Failed to load sweets from server')
    } finally {
      setLoading(false)
    }
  }

  const filtered = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet)
    setForm({
      name: sweet.name,
      price: String(sweet.price),
      quantity: String(sweet.quantity || sweet.stock || 0),
      category: sweet.category || 'Other'
    })
    setDialogOpen(true)
  }

  const handleDelete = async (sweetId: string | number | undefined) => {
    if (!sweetId) return
    try {
      await sweetService.delete(String(sweetId))
      setSweets(prev => prev.filter(s => (s._id || s.id) !== sweetId))
      alert('Sweet deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete sweet')
    }
  }

  const handleSubmit = async () => {
    console.log('handleSubmit called with form:', form)
    if (!form.name || !form.price || !form.quantity) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category || 'Other'
      }

      if (editingSweet) {
        const sweetId = editingSweet._id || editingSweet.id
        console.log('Updating sweet:', sweetId, payload)
        await sweetService.update(String(sweetId), payload)
        setSweets(prev =>
          prev.map(s =>
            (s._id || s.id) === sweetId ? { ...s, ...payload } : s
          )
        )
        alert('Sweet updated successfully')
      } else {
        console.log('Creating NEW sweet:', payload)
        const newSweet = await sweetService.create(payload)
        console.log('API Response:', newSweet)
        setSweets(prev => [...prev, newSweet])
        alert('Sweet added successfully')
      }

      setDialogOpen(false)
      setEditingSweet(null)
      setForm({ name: '', price: '', quantity: '', category: 'Other' })
    } catch (error: any) {
      console.error('ERROR in handleSubmit:', error)
      alert(`Failed to save sweet: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRestock = async (sweetId: string | number | undefined, amount: number) => {
    if (!sweetId) return
    try {
      setLoading(true)
      await sweetService.restock(String(sweetId), amount)
      const sweet = sweets.find(s => (s._id || s.id) === sweetId)
      if (sweet) {
        const currentQty = sweet.quantity || sweet.stock || 0
        setSweets(prev =>
          prev.map(s =>
            (s._id || s.id) === sweetId
              ? { ...s, quantity: currentQty + amount }
              : s
          )
        )
      }
      alert(`Restocked ${amount} items successfully`)
    } catch (error: any) {
      console.error('Restock failed:', error)
      alert(`Failed to restock: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Sweets</h1>
          <p className="text-muted-foreground">Add, edit, or remove sweets from the catalog</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => {
              setEditingSweet(null)
              setForm({ name: '', price: '', quantity: '', category: 'Other' })
            }}>
              <Plus className="h-4 w-4" />
              Add Sweet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Sweet name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                  {editingSweet ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sweets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(sweet => (
                <TableRow key={sweet.id}>
                  <TableCell className="font-medium">#{sweet.id}</TableCell>
                  <TableCell>{sweet.name}</TableCell>
                  <TableCell>₹{sweet.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{sweet.stock}</span>
                      {sweet.stock < 5 && (
                        <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">
                          Low
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sweet)}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestock(sweet.id, 10)}
                        >
                          +10
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestock(sweet.id, 50)}
                        >
                          +50
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sweet.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}