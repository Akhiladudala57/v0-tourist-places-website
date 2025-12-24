"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, CreditCard, Smartphone, Truck, ArrowLeft, User, LogOut, CheckCircle2, Users } from "lucide-react"
import Link from "next/link"
import { touristPlaces } from "@/lib/data"
import type { VisitListItem } from "@/lib/types"

type PaymentMethod = "card" | "upi" | "cod"

export default function PaymentPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [visitList, setVisitList] = useState<VisitListItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Card details
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVV, setCardCVV] = useState("")

  // UPI details
  const [upiId, setUpiId] = useState("")

  // COD details
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/auth/signin")
    } else {
      const parsedUser = JSON.parse(user)
      setCurrentUser(parsedUser)
      setVisitList(parsedUser.visitList || [])

      if (parsedUser.visitList?.length === 0) {
        router.push("/dashboard")
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const visitListPlaces = visitList
    .map((item) => {
      const place = touristPlaces.find((p) => p.id === item.placeId)
      return place ? { ...place, travelers: item.travelers } : null
    })
    .filter(Boolean) as Array<(typeof touristPlaces)[0] & { travelers: number }>

  const totalCost = visitListPlaces.reduce((sum, place) => sum + place.price * place.travelers, 0)
  const totalTravelers = visitListPlaces.reduce((sum, place) => sum + place.travelers, 0)

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)

      // Clear visit list after successful payment
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === currentUser.id ? { ...u, visitList: [] } : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      const updatedCurrentUser = { ...currentUser, visitList: [] }
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }, 2000)
  }

  if (!currentUser) {
    return null
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-rose-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-emerald-200 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-24 w-24 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Payment Successful!</h2>
              <p className="text-gray-600">Your booking has been confirmed</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Travelers:</span>
                <span className="font-semibold flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {totalTravelers} {totalTravelers === 1 ? "Person" : "People"}
                </span>
              </div>
              <div className="border-t pt-2">
                <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                <p className="text-2xl font-bold text-emerald-600">₹{totalCost.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-emerald-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/visit-list">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Visit List
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Booking</h2>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-2xl">Payment Method</CardTitle>
                <CardDescription>Select how you would like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className="space-y-3">
                      <div
                        className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold">Credit / Debit Card</span>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === "upi"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                        onClick={() => setPaymentMethod("upi")}
                      >
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Smartphone className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold">UPI Payment</span>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Truck className="h-5 w-5 text-emerald-600" />
                          <span className="font-semibold">Cash on Delivery</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Card Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          maxLength={19}
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            required
                            maxLength={5}
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCVV">CVV</Label>
                          <Input
                            id="cardCVV"
                            type="password"
                            placeholder="123"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            required
                            maxLength={3}
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">UPI Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                        <p className="text-sm text-gray-600">
                          You will receive a payment request on your UPI app. Please approve to complete the
                          transaction.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Delivery Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+91 98765 43210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                        <Input
                          id="deliveryAddress"
                          placeholder="Enter your complete address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                        <p className="text-sm text-gray-600">
                          Please keep the exact amount ready. Our representative will contact you for delivery
                          confirmation.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay ₹${totalCost.toLocaleString()}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-emerald-200 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{visitListPlaces.length} destinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {visitListPlaces.map((place) => (
                    <div key={place.id} className="flex justify-between items-start text-sm border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium">{place.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {place.country}
                        </p>
                        <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {place.travelers} {place.travelers === 1 ? "person" : "people"} × ₹
                          {place.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-emerald-600">
                        ₹{(place.price * place.travelers).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Travelers</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      {totalTravelers} {totalTravelers === 1 ? "Person" : "People"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
