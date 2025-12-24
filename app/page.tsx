"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Plane, Star } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <Plane className="h-12 w-12 text-emerald-600" />
            <h1 className="text-6xl font-bold">
              <span className="text-emerald-600">Enjoy</span>
              <span className="text-rose-600"> Trip</span>
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
            Discover amazing destinations around the world and plan your perfect vacation
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-emerald-200">
              <MapPin className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Top Destinations</h3>
              <p className="text-gray-600">Explore Switzerland, Paris, Maldives & more</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-rose-200">
              <Star className="h-10 w-10 text-rose-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Rated Places</h3>
              <p className="text-gray-600">See ratings and reviews from travelers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-emerald-200">
              <Plane className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Easy Booking</h3>
              <p className="text-gray-600">Multiple payment options available</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mt-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-rose-600 text-rose-600 hover:bg-rose-50 text-lg px-8 py-6 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
