# SmashClub Frontend - Setup Instructions

## Prerequisites
Before running the application, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for authentication)

## Environment Setup

1. **Create Environment File**
   
   Copy the example environment file and update with your credentials:
   ```bash
   # Create .env.local file with these variables:
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3001`

### Production Build
```bash
npm run build
npm start
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Update the `.env.local` file with your credentials
4. Enable Email authentication in Supabase dashboard (Authentication > Providers)

## Backend API Setup

Make sure the SmashClub backend is running at `http://localhost:3000` (or update `NEXT_PUBLIC_API_URL` accordingly).

The backend should provide these endpoints:
- `GET /courts` - List all courts
- `POST /bookings` - Create a booking
- `GET /bookings/my` - Get user's bookings
- `GET /bookings/availability/:courtId` - Check court availability
- `POST /passes/purchase` - Purchase a pass
- `GET /passes/my` - Get user's active passes

## Features

✅ **Authentication**
- Email/password signup and login via Supabase
- Protected routes with automatic redirection
- Session management

✅ **Courts Management**
- Browse available courts
- View court details (type, hourly rate)
- Check real-time availability

✅ **Booking System**
- Select date and time slots
- Create bookings for available slots
- View booking history with filters (all/upcoming/past)
- Booking status tracking

✅ **Pass System**
- Purchase monthly or yearly passes
- View active passes
- Track pass expiry and days remaining
- Visual indicators for expiring passes

## Design Features

The application features a premium, modern UI with:
- **Dark Mode Design**: Gradient backgrounds from slate to purple
- **Glassmorphism**: Frosted glass effects on cards and containers
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Mobile-First**: Fully responsive on all devices
- **Color System**: Purple/blue gradient theme with semantic colors
- **Typography**: Clean, modern fonts with proper hierarchy

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Main dashboard
│   ├── courts/            # Courts browsing & booking
│   ├── bookings/          # Bookings management
│   └── passes/            # Pass management
├── components/            # Reusable components
│   └── ProtectedRoute.tsx # Auth guard component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client
│   └── supabase/         # Supabase client
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

## Troubleshooting

### Authentication Issues
- Verify Supabase credentials in `.env.local`
- Check that email authentication is enabled in Supabase
- Clear browser cache and cookies

### API Connection Issues
- Ensure backend is running at the correct URL
- Check CORS settings in backend
- Verify API_URL in environment variables

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check for TypeScript errors with `npm run build`

## Next Steps

1. Configure your Supabase project
2. Start the backend API server
3. Update environment variables
4. Run the development server
5. Create a test user account
6. Explore the features!

## Support

For issues or questions, please refer to:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
