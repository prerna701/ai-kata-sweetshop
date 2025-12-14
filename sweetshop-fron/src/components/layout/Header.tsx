// import { useEffect, useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   User,
//   LogOut,
//   LayoutDashboard,
//   ChevronDown,
//   Sun,
//   Moon,
// } from "lucide-react"

// type Theme = "light" | "dark"

// export default function Header() {
//   const navigate = useNavigate()

//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [theme, setTheme] = useState<Theme>("light")
//   const [user, setUser] = useState<any>(null)
//   const [search, setSearch] = useState("")

//   // Sync auth + user
//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     const savedUser = localStorage.getItem("user")

//     setIsAuthenticated(!!token)
//     setUser(savedUser ? JSON.parse(savedUser) : null)
//   }, [])

//   // Apply theme to <html> globally
//   useEffect(() => {
//     const root = document.documentElement
//     if (theme === "dark") {
//       root.classList.add("dark")
//     } else {
//       root.classList.remove("dark")
//     }
//     try {
//       localStorage.setItem("theme", theme)
//     } catch (e) {
//       /* ignore if storage is unavailable */
//     }
//   }, [theme])

//   // Read persisted theme on mount (safer than reading during render)
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("theme") as Theme | null
//       if (saved === "dark" || saved === "light") setTheme(saved)
//     } catch (e) {
//       /* ignore */
//     }
//   }, [])

//   const logout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("user")
//     setIsAuthenticated(false)
//     setUser(null)
//     navigate("/login")
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (search.trim() !== "") {
//       navigate(`/sweets?search=${encodeURIComponent(search)}`)
//       setSearch("")
//     }
//   }

//   return (
//     <header
//       className="fixed top-0 z-50 w-full backdrop-blur transition-colors duration-300"
//       style={{ backgroundColor: "rgb(var(--background) / 0.8)" }}
//     >
//       <nav className="container mx-auto flex h-16 items-center justify-between px-4">
//         {/* Logo */}
//         <Link to="/" className="text-xl font-bold">
//           🍭 Sweet Shop
//         </Link>

//         {/* Center Links + Search */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link to="/">Home</Link>
//           <Link to="/sweets">View Sweets</Link>
//           <Link to="/about">About Us</Link>

//           <form onSubmit={handleSearch}>
//             <input
//               type="text"
//               placeholder="Search sweets..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </form>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* Theme toggle */}
//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
//           >
//             {theme === "dark" ? <Sun /> : <Moon />}
//           </Button>

//           {isAuthenticated ? (
//             <>
//               <Link to="/dashboard">
//                 <Button>
//                   <LayoutDashboard className="mr-2 h-4 w-4" />
//                   Dashboard
//                 </Button>
//               </Link>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline">
//                     <User className="mr-2 h-4 w-4" />
//                     Account
//                     <ChevronDown className="ml-1 h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>

//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />

//                   <DropdownMenuItem asChild>
//                     <Link to="/profile">Profile</Link>
//                   </DropdownMenuItem>

//                   <DropdownMenuItem asChild>
//                     <Link to="/orders">My Orders</Link>
//                   </DropdownMenuItem>

//                   {user?.role === "admin" && (
//                     <>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuLabel>Admin</DropdownMenuLabel>

//                       <DropdownMenuItem asChild>
//                         <Link to="/admin/sweets">Manage Sweets</Link>
//                       </DropdownMenuItem>

//                       <DropdownMenuItem asChild>
//                         <Link to="/admin/add-sweet">Add Sweet</Link>
//                       </DropdownMenuItem>
//                     </>
//                   )}

//                   <DropdownMenuSeparator />

//                   <DropdownMenuItem onClick={logout} className="text-red-600">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </>
//           ) : (
//             <>
//               <Link to="/login">
//                 <Button variant="outline">Login</Button>
//               </Link>
//               <Link to="/register">
//                 <Button>Sign Up</Button>
//               </Link>
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   )
// }
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, LogOut, Home, Package, Shield, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
            <span className="font-bold">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline">MithaiWala</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/sweets">
              <Package className="h-4 w-4" />
              Sweets
            </Link>
          </Button>
          {user && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/orders">Orders</Link>
              </Button>
              {user.role === 'admin' && (
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Cart */}
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.name}
                  {user.role === 'admin' && (
                    <div className="text-xs text-primary font-normal">Admin</div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/sweets">Manage Sweets</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/sweets">Sweets</Link>
              </DropdownMenuItem>
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
 +                 <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}