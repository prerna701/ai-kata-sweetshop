import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Star, Truck, Shield, Heart } from 'lucide-react'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Intro Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bw-border mb-6 bg-secondary">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Since 1995</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Pure. Traditional.
            <span className="block text-primary">Mithai.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Authentic Indian sweets, crafted with generations of expertise and only the finest ingredients.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/sweets">
                Shop Sweets <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center mx-auto bg-secondary">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Free Delivery</h3>
              <p className="text-muted-foreground">On orders above ₹999</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center mx-auto bg-secondary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Quality Promise</h3>
              <p className="text-muted-foreground">100% authentic ingredients</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border rounded-full flex items-center justify-center mx-auto bg-secondary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Family Recipes</h3>
              <p className="text-muted-foreground">Generations of expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sweets */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Most Loved</h2>
              <p className="text-muted-foreground">Our best-selling sweets</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/sweets">View All</Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: "Rasgulla", price: 250, stock: 10 },
              { id: 2, name: "Kaju Katli", price: 900, stock: 5 },
              { id: 3, name: "Gulab Jamun", price: 300, stock: 20 },
              { id: 4, name: "Soan Papdi", price: 400, stock: 15 },
            ].map((sweet) => (
              <Card key={sweet.id} className="bw-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center mb-4">
                    <span className="text-4xl text-muted-foreground">
                      {sweet.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{sweet.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {sweet.name === 'Rasgulla' && 'Soft cottage cheese balls'}
                      {sweet.name === 'Kaju Katli' && 'Cashew fudge diamonds'}
                      {sweet.name === 'Gulab Jamun' && 'Milk-solid dumplings'}
                      {sweet.name === 'Soan Papdi' && 'Flaky sugar dessert'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl">₹{sweet.price}</span>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/sweets">Add</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}