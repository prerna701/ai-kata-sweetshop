import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import SweetCard from '@/components/SweetCard'
import { sweetService } from '@/services/sweet.service'

export default function Sweets() {
  const [sweets, setSweets] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 8
  const [total, setTotal] = useState(0)

  const filtered = sweets
  const totalPages = Math.ceil(total / itemsPerPage) || 1
  const paginated = sweets

  useEffect(() => {
    const load = async () => {
      try {
        if (search.trim()) {
          const results = await sweetService.search(search.trim())
          setSweets(results || [])
          setTotal((results && results.length) || 0)
        } else {
          const res = await sweetService.getAll(page, itemsPerPage)
          // res expected: { data: [...], pagination: { total } }
          if (res?.data) {
            setSweets(res.data)
            setTotal(res.pagination?.total || 0)
          } else {
            setSweets(res || [])
            setTotal((res && res.length) || 0)
          }
        }
      } catch (err) {
        console.error('Failed to load sweets', err)
      }
    }
    load()
  }, [page, search])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Sweets Collection</h1>
        <p className="text-muted-foreground">Discover traditional Indian mithai</p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search sweets by name or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Sweets Grid */}
      {paginated.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-muted-foreground">No sweets found</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search term</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paginated.map(sweet => (
              <SweetCard key={sweet._id || sweet.id} sweet={sweet} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <div key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </div>
                  ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Results info */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            Showing {paginated.length} of {filtered.length} sweets
            {search && ` matching "${search}"`}
          </div>
        </>
      )}
    </div>
  )
}
