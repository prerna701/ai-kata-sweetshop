// import Header from "./components/layout/Header"
// import HeroSection from "./components/HeroSection"
// import { features } from "./data/features"
// import { howItWorks } from "./data/howItWorks"
// import { testimonial } from "./data/testimonial"
// import { Button } from "./components/ui/button"
// import { Card, CardContent } from "./components/ui/card"

// export default function App() {
//   return (
//     <div className="min-h-screen transition-colors duration-300">
      

//       <Header />

//       <HeroSection />

//       {/* FEATURES */}
//       <section className="py-20">
//         <h2 className="text-center text-4xl font-bold mb-12
//           bg-gradient-to-r
//           from-[rgb(var(--foreground))]
//           to-[rgb(var(--foreground))]/60
//           bg-clip-text text-transparent"
//         >
//           Why Our Sweets Stand Out
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
//           {features.map((f, i) => {
//             const Icon = f.icon
//             return (
//               <Card
//                 key={i}
//                 className="
//                   bg-[rgb(var(--card))]/70
//                   border border-[rgb(var(--border))]
//                   transition"
//               >
//                 <CardContent className="text-center space-y-3">
//                   <Icon size={32} />
//                   <h3 className="font-semibold">{f.title}</h3>
//                   <p className="text-[rgb(var(--foreground))]/70">
//                     {f.description}
//                   </p>
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="py-20">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
//           {howItWorks.map((h, i) => {
//             const Icon = h.icon
//             return (
//               <div
//                 key={i}
//                 className="
//                   bg-[rgb(var(--card))]/60
//                   border border-[rgb(var(--border))]
//                   rounded-xl p-6 text-center"
//               >
//                 <Icon size={24} />
//                 <h3 className="mt-3 font-semibold">{h.title}</h3>
//                 <p className="text-[rgb(var(--foreground))]/70">
//                   {h.description}
//                 </p>
//               </div>
//             )
//           })}
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="py-20">
//         <div className="grid md:grid-cols-2 gap-8 px-6">
//           {testimonial.map((t, i) => (
//             <Card
//               key={i}
//               className="
//                 bg-[rgb(var(--card))]/70
//                 border border-[rgb(var(--border))]"
//             >
//               <CardContent>
//                 <p className="italic text-[rgb(var(--foreground))]/80">
//                   “{t.quote}”
//                 </p>
//                 <p className="mt-2 font-semibold">{t.author}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-24 text-center">
//         <div
//           className="
//             inline-block p-10 rounded-3xl
//             bg-[rgb(var(--card))]/80
//             border border-[rgb(var(--border))]"
//         >
//           <h2 className="text-4xl font-bold mb-4">
//             Ready to taste the best sweets?
//           </h2>
//           <Button size="lg">Order Now</Button>
//         </div>
//       </section>
//     </div>
//   )
// }
import { Toaster } from 'sonner'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AppRoutes from './routes'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <AppRoutes />
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-background border',
          duration: 3000,
        }}
      />
    </div>
  )
}

export default App