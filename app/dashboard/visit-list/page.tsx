"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Trash2, LogOut, User, ShoppingCart, ArrowLeft, Users, Navigation } from "lucide-react"
import Link from "next/link"
import { touristPlaces } from "@/lib/data"
import type { VisitListItem } from "@/lib/types"

export default function VisitListPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [visitList, setVisitList] = useState<VisitListItem[]>([])

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/signin")
    } else {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)
      setVisitList(parsedUser.visitList || [])
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const removeFromVisitList = (placeId: string) => {
    const updatedVisitList = visitList.filter((item) => item.placeId !== placeId)
    setVisitList(updatedVisitList)

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === currentUser.id ? { ...u, visitList: updatedVisitList } : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    const updatedCurrentUser = { ...currentUser, visitList: updatedVisitList }
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))
    setCurrentUser(updatedCurrentUser)
  }

  const visitListPlaces = visitList
    .map((item) => {
      const place = touristPlaces.find((p) => p.id === item.placeId)
      return place ? { ...place, travelers: item.travelers } : null
    })
    .filter(Boolean) as Array<(typeof touristPlaces)[0] & { travelers: number }>

  const totalCost = visitListPlaces.reduce((sum, place) => sum + place.price * place.travelers, 0)
  const totalTravelers = visitListPlaces.reduce((sum, place) => sum + place.travelers, 0)

  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, "_blank")
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-emerald-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">
                <span className="text-emerald-600">Enjoy</span>
                <span className="text-rose-600"> Trip</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{currentUser.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-rose-600 text-rose-600 hover:bg-rose-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">My Visit List</h2>
          <p className="text-gray-600">Places you want to visit - {visitListPlaces.length} destinations selected</p>
        </div>

        {visitListPlaces.length === 0 ? (
          <Card className="p-12 text-center border-2 border-emerald-200">
            <div className="space-y-4">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">Your visit list is empty</h3>
              <p className="text-gray-500">Start adding destinations from the dashboard to plan your dream trip!</p>
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Browse Destinations</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Places List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visitListPlaces.map((place) => (
                <Card
                  key={place.id}
                  className="overflow-hidden border-2 border-emerald-200 hover:border-emerald-300 transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-rose-100">
                    <img
                      src={place.image || "/placeholder.svg"}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-600 text-white">
                        <Users className="h-3 w-3 mr-1" />
                        {place.travelers} {place.travelers === 1 ? "Person" : "People"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{place.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {place.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{place.rating}</span>
                        <span className="text-sm text-gray-500">/5</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">₹{place.price.toLocaleString()}/person</div>
                        <div className="text-lg font-bold text-emerald-600">
                          ₹{(place.price * place.travelers).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGoogleMaps(place.location.lat, place.location.lng, place.name)}
                      className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      View Live Location
                    </Button>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => removeFromVisitList(place.id)}
                      variant="outline"
                      className="w-full border-rose-600 text-rose-600 hover:bg-rose-50 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Summary Card */}
            <Card className="border-2 border-emerald-200 bg-white">
              <CardHeader>
                <CardTitle className="text-2xl">Trip Summary</CardTitle>
                <CardDescription>Review your selected destinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700">Total Destinations:</span>
                  <Badge className="bg-emerald-600 text-white text-base px-4 py-1">{visitListPlaces.length}</Badge>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-700">Total Travelers:</span>
                  <Badge className="bg-blue-600 text-white text-base px-4 py-1 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {totalTravelers} {totalTravelers === 1 ? "Person" : "People"}
                  </Badge>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">Total Cost:</span>
                    <span className="text-3xl font-bold text-emerald-600">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/payment" className="w-full">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white text-lg py-6">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
