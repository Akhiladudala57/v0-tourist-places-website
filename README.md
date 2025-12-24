# Enjoy Trip - Tourist Places Booking Website

A modern, full-featured tourist destination booking website built with Next.js, featuring a beautiful green and cherry red color scheme.

## Features

### Authentication
- **Sign Up**: Create a new account with name, email, and password
- **Sign In**: Login with existing credentials
- User session management with localStorage

### Dashboard
- Browse 12 stunning tourist destinations worldwide:
  - Matterhorn, Switzerland
  - Eiffel Tower, Paris
  - Maldives Beach Resort
  - Santorini, Greece
  - Bali, Indonesia
  - Dubai, UAE
  - Machu Picchu, Peru
  - Tokyo, Japan
  - Iceland
  - New York City, USA
  - Venice, Italy
  - Phuket, Thailand

### Destination Details
Each destination displays:
- High-quality images
- Price in Indian Rupees (₹)
- Rating out of 5 stars
- Complete address and location
- Detailed description
- Country information

### Visit List Management
- Add destinations to your personal visit list
- View all selected destinations
- Remove destinations from list
- See total cost calculation
- Trip summary with destination count

### Payment Options
Three convenient payment methods:
1. **Credit/Debit Card**: Enter card details for instant payment
2. **UPI Payment**: Pay using your UPI ID
3. **Cash on Delivery (COD)**: Pay when travel documents are delivered

### User Experience
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth navigation between pages
- Real-time visit list updates
- Success confirmation after payment
- Auto-redirect after successful booking

## Color Scheme
- **Primary (Green)**: #10b981 (Emerald-600) - Used for main branding, buttons, and positive actions
- **Secondary (Cherry Red)**: #dc2626 (Rose-600) - Used for accent elements and CTAs
- **Background**: Gradient from emerald-50 to rose-50 for a warm, inviting feel

## Tech Stack
- Next.js 15+ with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- localStorage for data persistence

## Getting Started

1. Visit the homepage
2. Click "Get Started" to create an account
3. Browse available destinations
4. Add destinations to your visit list
5. Proceed to payment
6. Choose your preferred payment method
7. Complete booking and receive confirmation

## File Structure
- `/app/page.tsx` - Landing page
- `/app/auth/signin` - Sign in page
- `/app/auth/signup` - Sign up page
- `/app/dashboard/page.tsx` - Main destinations listing
- `/app/dashboard/visit-list/page.tsx` - User's visit list
- `/app/dashboard/payment/page.tsx` - Payment processing
- `/lib/data.ts` - Tourist places data
- `/lib/types.ts` - TypeScript type definitions

Enjoy planning your next adventure with Enjoy Trip!
