export interface TouristPlace {
  id: string
  name: string
  country: string
  description: string
  price: number
  rating: number
  address: string
  image: string
  location: {
    lat: number
    lng: number
  }
  accommodation: {
    name: string
    type: string
    rating: number
    pricePerNight: number
    included: boolean
  }
  transportation: {
    carRental: number
    localTransport: number
    airportTransfer: number
  }
  foodArrangement: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
    estimatedCostPerDay: number
  }
  offers: {
    cashback: number
    cashbackPercentage: number
    specialOffer?: string
  }
  duration: {
    days: number
    nights: number
  }
}

export interface VisitListItem {
  placeId: string
  travelers: number
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  visitList: VisitListItem[]
}
