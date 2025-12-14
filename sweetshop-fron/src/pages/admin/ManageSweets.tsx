import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Plus, Search, Loader } from "lucide-react"
import { sweetService } from "@/services/sweet.service"

const CATEGORIES = ['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other']

type Sweet = {
  _id?: string
  id?: string | number
  name: string
  price: number
  quantity?: number
  stock?: number
  category?: string
}

export default function ManageSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Sweet | null>(null)
  const [lastAction, setLastAction] = useState<string>('')

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "Other",
  })

  useEffect(() => {
    fetchSweets()
    console.log('ManageSweets mounted')
  }, [])

  const fetchSweets = async () => {
    try {
      setLoading(true)
      const res = await sweetService.getAll()
      if (res.data) {
        const sweetsArray = Array.isArray(res.data) ? res.data : res.data.sweets || []
        setSweets(sweetsArray)
      }
    } catch (error) {
      console.error('Failed to fetch sweets:', error)
      alert('Failed to load sweets')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: "", price: "", quantity: "", category: "Other" })
    setEditing(null)
  }

  const filteredSweets = sweets.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (sweet: Sweet) => {
    setEditing(sweet)
    setForm({
      name: sweet.name,
      price: String(sweet.price),
      quantity: String(sweet.quantity || sweet.stock || 0),
      category: sweet.category || 'Other',
    })
    setOpen(true)
  }

  const handleDelete = async (sweetId: string | number | undefined) => {
    if (!sweetId) return
    try {
      await sweetService.delete(String(sweetId))
      setSweets((prev) => prev.filter((s) => (s._id || s.id) !== sweetId))
      alert('Sweet deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete sweet')
    }
  }

  const handleSave = async () => {
    console.log('handleSave called! Form data:', form)
    setLastAction('handleSave called')
    
    if (!form.name || !form.price || !form.quantity) {
      console.log('Form validation failed:', { 
        name: form.name, 
        price: form.price, 
        quantity: form.quantity 
      })
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category || 'Other',
      }

      console.log('Creating sweet with payload:', payload)

      if (editing) {
        const sweetId = editing._id || editing.id
        console.log('Updating sweet:', sweetId)
        await sweetService.update(String(sweetId), payload)
        setSweets((prev) =>
          prev.map((s) =>
            (s._id || s.id) === sweetId
              ? { ...s, ...payload }
              : s
          )
        )
        alert('Sweet updated successfully')
      } else {
        console.log('Creating NEW sweet...')
        setLastAction('creating new sweet (calling API)')
        const newSweet = await sweetService.create(payload)
        console.log('API Response:', newSweet)
        setSweets((prev) => [...prev, newSweet])
        setLastAction('created new sweet')
        alert('Sweet added successfully')
      }

      setOpen(false)
      resetForm()
    } catch (error: any) {
      console.error('ERROR in handleSave:', error)
      alert(`Failed to save sweet: ${error.message || error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRestock = async (sweetId: string | number | undefined, qty: number) => {
    if (!sweetId) return
    try {
      setLoading(true)
      const sweet = sweets.find((s) => (s._id || s.id) === sweetId)
      if (!sweet) return
      
      const currentQty = sweet.quantity || sweet.stock || 0
      const newQty = currentQty + qty
      
      await sweetService.restock(String(sweetId), qty)
      setLastAction(`restocked ${qty} for ${sweetId}`)
      
      setSweets((prev) =>
        prev.map((s) =>
          (s._id || s.id) === sweetId
            ? { ...s, quantity: newQty }
            : s
        )
      )
      
      alert(`Restocked ${qty} items successfully`)
    } catch (error: any) {
      console.error('Restock failed:', error)
      alert(`Failed to restock: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* TEST BUTTON */}
      <button 
        onClick={() => { console.log('TEST BUTTON CLICKED!'); setLastAction('TEST BUTTON CLICKED') }}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: 'red', 
          color: 'white',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        TEST BUTTON - CHECK CONSOLE
      </button>

      <div className="mb-4">
        <span className="text-sm text-gray-600">Debug: </span>
        <span className="text-sm font-medium">{lastAction || 'no action yet'}</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Sweets</h1>
          <p className="text-muted-foreground">
            Add, edit or remove sweets
          </p>
        </div>

        <button
          onClick={() => {
            console.log('Opener button clicked - opening dialog')
            resetForm()
            setOpen(true)
          }}
          className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Sweet
        </button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Sweet" : "Add Sweet"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Sweet name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Cancel clicked')
                    setOpen(false)
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-emerald-600 text-white"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search sweets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading sweets...</p>
            </div>
          ) : filteredSweets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No sweets found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredSweets.map((sweet) => (
                  <TableRow key={sweet._id || sweet.id}>
                    <TableCell className="text-xs">{String(sweet._id || sweet.id).substring(0, 8)}...</TableCell>
                    <TableCell>{sweet.name}</TableCell>
                    <TableCell>₹{sweet.price}</TableCell>
                    <TableCell>
                      {sweet.quantity || sweet.stock || 0}
                      {((sweet.quantity || sweet.stock || 0) < 5) && (
                        <span className="ml-2 text-xs text-red-500">Low</span>
                      )}
                    </TableCell>
                    <TableCell>{sweet.category || 'Other'}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(sweet)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestock(sweet._id || sweet.id, 10)}
                      >
                        +10
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestock(sweet._id || sweet.id, 50)}
                      >
                        +50
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(sweet._id || sweet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

