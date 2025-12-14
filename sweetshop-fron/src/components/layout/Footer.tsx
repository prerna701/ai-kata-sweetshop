// import { Link } from "react-router-dom"

// export default function Footer() {
//   return (
//     <footer className="border-t border-[rgb(var(--border))] mt-24">
//       <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

//         {/* Brand */}
//         <div>
//           <h3 className="text-xl font-bold mb-2">🍭 Sweet Shop</h3>
//           <p className="text-sm opacity-70">
//             Authentic Indian sweets made with love, purity & tradition.
//           </p>
//         </div>

//         {/* Links */}
//         <div>
//           <h4 className="font-semibold mb-2">Quick Links</h4>
//           <ul className="space-y-1 opacity-80">
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/sweets">All Sweets</Link></li>
//             <li><Link to="/orders">My Orders</Link></li>
//           </ul>
//         </div>

//         {/* Policies */}
//         <div>
//           <h4 className="font-semibold mb-2">Policies</h4>
//           <ul className="space-y-1 opacity-80">
//             <li>Privacy Policy</li>
//             <li>Refund Policy</li>
//             <li>Terms & Conditions</li>
//           </ul>
//         </div>

//         {/* Contact */}
//         <div>
//           <h4 className="font-semibold mb-2">Contact</h4>
//           <p className="text-sm opacity-70">
//             📍 Delhi, India <br />
//             📞 +91 98765 43210 <br />
//             ✉ sweets@gmail.com
//           </p>
//         </div>
//       </div>

//       <div className="text-center py-4 text-sm opacity-60 border-t border-[rgb(var(--border))]">
//         © 2025 Sweet Shop. All rights reserved.
//       </div>
//     </footer>
//   )
// }
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
                <span className="font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MithaiWala</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Authentic Indian sweets since 1995
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/sweets" className="hover:text-foreground">All Sweets</a></li>
              <li><a href="/new" className="hover:text-foreground">New Arrivals</a></li>
              <li><a href="/best" className="hover:text-foreground">Best Sellers</a></li>
              <li><a href="/gifts" className="hover:text-foreground">Gift Boxes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground">About Us</a></li>
              <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="/faq" className="hover:text-foreground">FAQ</a></li>
              <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Subscribe to our newsletter for updates
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 MithaiWala. All rights reserved.
        </div>
      </div>
    </footer>
  )
}