"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Heart,
  LogOut,
  User,
  Hotel,
  Car,
  Utensils,
  Tag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Users,
  Navigation,
} from "lucide-react"
import Link from "next/link"
import { touristPlaces } from "@/lib/data"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { VisitListItem } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [visitList, setVisitList] = useState<VisitListItem[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [travelersCount, setTravelersCount] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/signin")
    } else {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)
      setVisitList(parsedUser.visitList || [])

      const counts: { [key: string]: number } = {}
      if (parsedUser.visitList) {
        parsedUser.visitList.forEach((item: VisitListItem) => {
          counts[item.placeId] = item.travelers
        })
      }
      setTravelersCount(counts)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const addToVisitList = (placeId: string) => {
    const travelers = travelersCount[placeId] || 1
    const existingItem = visitList.find((item) => item.placeId === placeId)

    if (!existingItem) {
      const updatedVisitList = [...visitList, { placeId, travelers }]
      setVisitList(updatedVisitList)

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === currentUser.id ? { ...u, visitList: updatedVisitList } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      const updatedCurrentUser = { ...currentUser, visitList: updatedVisitList }
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))
      setCurrentUser(updatedCurrentUser)
    }
  }

  const isInVisitList = (placeId: string) => {
    return visitList.some((item) => item.placeId === placeId)
  }

  const toggleCardExpansion = (placeId: string) => {
    setExpandedCard(expandedCard === placeId ? null : placeId)
  }

  const handleTravelersChange = (placeId: string, value: number) => {
    const travelers = Math.max(1, Math.min(10, value))
    setTravelersCount((prev) => ({ ...prev, [placeId]: travelers }))

    const existingItem = visitList.find((item) => item.placeId === placeId)
    if (existingItem) {
      const updatedVisitList = visitList.map((item) => (item.placeId === placeId ? { ...item, travelers } : item))
      setVisitList(updatedVisitList)

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === currentUser.id ? { ...u, visitList: updatedVisitList } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      const updatedCurrentUser = { ...currentUser, visitList: updatedVisitList }
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))
      setCurrentUser(updatedCurrentUser)
    }
  }

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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                <span className="text-emerald-600">Enjoy</span>
                <span className="text-rose-600"> Trip</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/visit-list">
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Visit List ({visitList.length})
                </Button>
              </Link>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Amazing Destinations</h2>
          <p className="text-gray-600">Discover the world's most beautiful places and add them to your visit list</p>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {touristPlaces.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-xl"
            >
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-rose-100">
                <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-full object-cover" />
                {isInVisitList(place.id) && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-rose-600 hover:bg-rose-700 text-white">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Added
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-emerald-600 text-white">
                    <Tag className="h-3 w-3 mr-1" />
                    {place.offers.cashbackPercentage}% Cashback
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
                    <div className="text-lg font-bold text-emerald-600">₹{place.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {place.duration.days}D/{place.duration.nights}N
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
                <div className="text-xs text-gray-500">
                  <MapPin className="h-4 w-3 inline mr-1" />
                  {place.address}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`travelers-${place.id}`} className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-4 w-4 text-emerald-600" />
                      Travelers:
                    </Label>
                    <Input
                      id={`travelers-${place.id}`}
                      type="number"
                      min="1"
                      max="10"
                      value={travelersCount[place.id] || 1}
                      onChange={(e) => handleTravelersChange(place.id, Number.parseInt(e.target.value) || 1)}
                      className="w-20 h-8 text-center border-emerald-200 focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500">person(s)</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGoogleMaps(place.location.lat, place.location.lng, place.name)}
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    View Live Location
                  </Button>
                </div>

                {expandedCard === place.id && (
                  <div className="border-t pt-3 space-y-3 text-sm">
                    {/* Accommodation Details */}
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 font-semibold text-emerald-700 mb-2">
                        <Hotel className="h-4 w-4" />
                        Accommodation
                      </div>
                      <div className="space-y-1 text-gray-700">
                        <p className="font-medium">{place.accommodation.name}</p>
                        <p className="text-xs">{place.accommodation.type}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {place.accommodation.rating} Rating
                          </span>
                          <span className="text-xs font-semibold">
                            ₹{place.accommodation.pricePerNight.toLocaleString()}/night
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transportation Details */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                        <Car className="h-4 w-4" />
                        Transportation
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div className="flex justify-between">
                          <span>Airport Transfer:</span>
                          <span className="font-semibold">
                            ₹{place.transportation.airportTransfer.toLocaleString()}
                          </span>
                        </div>
                        {place.transportation.carRental > 0 && (
                          <div className="flex justify-between">
                            <span>Car Rental:</span>
                            <span className="font-semibold">₹{place.transportation.carRental.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Local Transport:</span>
                          <span className="font-semibold">₹{place.transportation.localTransport.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Arrangement */}
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2 font-semibold text-orange-700 mb-2">
                        <Utensils className="h-4 w-4" />
                        Food Arrangement
                      </div>
                      <div className="space-y-1 text-xs text-gray-700">
                        <div className="flex gap-2 flex-wrap">
                          {place.foodArrangement.breakfast && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Breakfast
                            </Badge>
                          )}
                          {place.foodArrangement.lunch && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Lunch
                            </Badge>
                          )}
                          {place.foodArrangement.dinner && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Dinner
                            </Badge>
                          )}
                        </div>
                        {place.foodArrangement.estimatedCostPerDay > 0 && (
                          <p className="mt-2">
                            Additional food cost:{" "}
                            <span className="font-semibold">
                              ₹{place.foodArrangement.estimatedCostPerDay.toLocaleString()}/day
                            </span>
                          </p>
                        )}
                        {place.foodArrangement.estimatedCostPerDay === 0 && (
                          <p className="text-green-600 font-medium">All meals included!</p>
                        )}
                      </div>
                    </div>

                    {/* Special Offers */}
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                      <div className="flex items-center gap-2 font-semibold text-rose-700 mb-2">
                        <Tag className="h-4 w-4" />
                        Special Offers
                      </div>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div className="flex justify-between items-center">
                          <span>Cashback:</span>
                          <span className="font-bold text-emerald-600 text-sm">
                            ₹{place.offers.cashback.toLocaleString()}
                          </span>
                        </div>
                        {place.offers.specialOffer && (
                          <p className="bg-white p-2 rounded border border-rose-300">{place.offers.specialOffer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCardExpansion(place.id)}
                  className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  {expandedCard === place.id ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      More Details
                    </>
                  )}
                </Button>
                {isInVisitList(place.id) ? (
                  <Link href="/dashboard/visit-list" className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">View in List</Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => addToVisitList(place.id)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Visit List
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
