# Georgian Dance Ensemble Website

A beautiful, cinematic website for a Georgian traditional dance ensemble with registration functionality and secure admin panel.

## Features

- **Cinematic Design**: Modern, glossy interface with gradient backgrounds and glass morphism effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Registration Form**: Collects child and parent information with validation
- **Secure Admin Panel**: Password-protected access to view all registrations
- **Database Storage**: Registrations are saved to a JSON file for easy access
- **Smooth Animations**: Hover effects and transitions for enhanced user experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd georgian-dance-ensemble
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Website Structure

### Main Page (`/`)
- Hero section with ensemble name and description
- About section highlighting cultural heritage, training, and performance opportunities
- Registration form with smooth scroll functionality

### Registration Form
Collects the following information:
- **Child**: Name, Surname, Age (6-16)
- **Parent**: Name, Surname, Phone Number

### Admin Panel (`/admin-panel`)
- **URL**: `http://localhost:3000/admin-panel`
- **Default Password**: `georgian2024`
- **Features**:
  - View all registrations with timestamps
  - Copy registration details to clipboard
  - Sort by registration date (newest first)
  - Secure logout functionality

## Security Features

- **Hidden Admin Route**: The admin panel is not linked from the main site
- **Password Protection**: Admin access requires a password
- **Data Validation**: All form inputs are validated before submission
- **Secure Storage**: Registrations are stored locally in JSON format

## Customization

### Changing Admin Password
Set the `ADMIN_PASSWORD` environment variable or modify the default password in `app/api/admin/route.ts`:

```typescript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-new-password';
```

### Styling
The website uses Tailwind CSS with custom animations and glass morphism effects. Main styling files:
- `app/globals.css` - Global styles and animations
- `app/page.tsx` - Main page layout
- `app/components/RegistrationForm.tsx` - Form styling
- `app/admin-panel/page.tsx` - Admin panel styling

### Data Storage
Registrations are stored in `data/registrations.json`. The file is automatically created when the first registration is submitted.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The website can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Create a `.env.local` file for production:

```env
ADMIN_PASSWORD=your-secure-password
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 19** - UI library
- **Node.js** - Runtime environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Note**: Remember to change the default admin password before deploying to production!
"# Samshoblo" 
