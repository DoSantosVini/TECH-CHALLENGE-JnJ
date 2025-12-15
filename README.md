# TECH-CHALLENGE-JnJ

## 🎯 About the Project

This project is a comprehensive **Organizational Chart Web Application** developed as a technical challenge for **Johnson & Johnson**. It provides an intuitive interface for managing and visualizing organizational hierarchies, allowing users to explore company structure through multiple views and advanced filtering capabilities.

The application demonstrates modern web development practices, including responsive design, real-time data filtering, interactive animations, and hierarchical data visualization.

**Live Demo:** https://tech-challenge-jn-j-f76x.vercel.app/

---

## ✨ Key Features

### 📊 Data Visualization
- **List View**: Comprehensive table displaying all personnel with sortable columns
- **Hierarchical Organizational Chart**: Interactive bubble chart showing 5 levels of organizational hierarchy
  - Color-coded by role level (CEO, VP, Directors, Managers, Staff)
  - Click-to-expand/collapse functionality
  - Animated SVG connection lines
  - Responsive layout with unlimited expansion

### 🔍 Advanced Search & Filtering
- **Multi-criteria filtering**: Department, Manager, Employee Type, Status
- **Independent filter operation**: Each filter works independently with "All" options
- **Real-time statistics**: Dynamic updates showing filtered results
- **Reset functionality**: Clear all filters with one click

### 📈 Live Statistics Dashboard
- Total employees count
- Active vs Inactive status breakdown
- Department count
- Employee vs Partner distribution
- Updates in real-time based on applied filters

### 👤 Detailed Person View
- Modal popup with comprehensive information:
  - ID, Name, Job Title
  - Department, Manager, Type, Status
  - Email, Hire Date, Location
  - Photo (with fallback icon)
  - Direct Reports list
- Accessible via info icon button in tables
- Blur backdrop effect for modern UX

---

## 🛠 Technologies Used

### Frontend
- **Next.js 14+** – React framework with App Router
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first styling
- **Framer Motion** – Smooth animations and transitions

### Backend
- **Next.js API Routes** – RESTful API endpoints
- **Supabase** – PostgreSQL database for data persistence

### Development Tools
- **ESLint** – Code quality and consistency
- **PostCSS** – CSS processing
- **VS Code** – Development environment

### AI Tools Used
- **GitHub Copilot** – Code completion and suggestions
- **Claude (Anthropic)** – Architecture design, debugging, and code refactoring
- **AI Impact**: Accelerated development by ~40%, particularly in:
  - Hierarchical data structure implementation
  - TypeScript type definitions and error resolution
  - Complex SVG line calculations for org chart
  - Responsive design patterns

---

## 📁 Project Structure

```
TECH-CHALLENGE-JnJ/
├── app/
│   ├── api/
│   │   ├── people/
│   │   │   ├── route.ts              # GET all people
│   │   │   └── [id]/route.ts         # GET person by ID
│   │   ├── search/route.ts           # Search API endpoint
│   │   ├── stats/route.ts            # Statistics API endpoint
│   │   └── test-connection/route.ts  # Database health check
│   ├── components/
│   │   ├── BubbleOrganizationChart.tsx  # Interactive org chart
│   │   ├── FilterBar.tsx                # Search filters component
│   │   ├── ListagemTable.tsx            # Main data table
│   │   ├── PeopleSearch.tsx             # Search interface
│   │   ├── SearchResults.tsx            # Filtered results table
│   │   ├── Statistics.tsx               # Stats dashboard
│   │   └── TabsNavigation.tsx           # View switcher
│   ├── lib/
│   │   └── supabase.ts               # Supabase client configuration
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── public/                           # Static assets
├── types/                            # TypeScript type definitions
├── data.json                         # Sample/seed data
├── swagger.json                      # API documentation
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind configuration
├── eslint.config.mjs                 # ESLint configuration
└── package.json                      # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DoSantosVini/TECH-CHALLENGE-JnJ.git
cd TECH-CHALLENGE-JnJ
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

### People Table
```sql
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  jobTitle VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  managerId INTEGER REFERENCES people(id),
  status VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  workEmail VARCHAR(255),
  hireDate DATE,
  photoPath VARCHAR(255)
);
```

### Relationships
- `managerId` creates hierarchical relationship (self-referencing foreign key)
- CEO has `managerId = NULL`
- Each person can have multiple direct reports

---

## 🔌 API Endpoints

### `GET /api/people`
Returns all people in the organization.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "jobTitle": "CEO",
    "department": "Executive",
    "managerId": null,
    "status": "Active",
    "type": "Employee",
    "location": "New York",
    "workEmail": "john.doe@jnj.com",
    "hireDate": "2020-01-15",
    "photoPath": "/photos/1.jpg"
  }
]
```

### `GET /api/people/[id]`
Returns specific person by ID.

### `GET /api/search?query=...&filters=...`
Search with filters applied.

### `GET /api/stats`
Returns organizational statistics.

### `GET /api/test-connection`
Health check endpoint.

---

## 🎨 Design System

### Color Palette (Johnson & Johnson Brand)
- **Primary Red**: `#EB1700` (J&J Brand Color)
- **Secondary White**: `#FFFFFF`
- **Neutral Grays**: `#F9FAFB`, `#F3F4F6`, `#E5E7EB`, `#D1D5DB`, `#6B7280`
- **Text Black**: `#000000`

### Organizational Chart Colors
- **Level 1 (CEO)**: Red `#EB1700`
- **Level 2 (VP)**: Blue `#2563EB`
- **Level 3 (Directors)**: Green `#16A34A`
- **Level 4 (Managers)**: Purple `#9333EA`
- **Level 5 (Staff)**: Gray `#6B7280`

---

## 🌟 Key Implementation Details

### Hierarchical Data Structure
- Recursive tree building algorithm
- Level assignment based on manager relationships
- Type normalization (string to number conversion)
- Efficient O(n) complexity using hash maps

### Animation System
- Framer Motion for smooth transitions
- 350ms delay for SVG line recalculation
- AnimatePresence for enter/exit animations
- Optimized re-renders with useMemo

### Responsive Design
- Sticky navigation bars with z-index layering
- Mobile-first approach with Tailwind breakpoints
- Overflow handling for large hierarchies
- Touch-optimized interactions

### State Management
- React useState for local component state
- useEffect for data fetching and side effects
- useLayoutEffect for DOM measurements
- Prop drilling for cross-component communication

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 🐛 Known Issues & Limitations

- [ ] Direct reports only show people in current filtered results
- [ ] Photo upload functionality not implemented
- [ ] No offline support
- [ ] Large datasets (1000+ people) may impact org chart performance

---

## 🔮 Future Enhancements

- [ ] Add drag-and-drop for org chart rearrangement
- [ ] Export functionality (PDF, CSV, PNG)
- [ ] Search within org chart
- [ ] Employee profile editing
- [ ] Role-based access control
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Mobile app version

---

## 📄 License

This project is part of a technical challenge and is for educational purposes only.

---

## 👤 Author

**Vinicius dos Santos**

- GitHub: [@DoSantosVini](https://github.com/DoSantosVini)
- LinkedIn: https://www.linkedin.com/in/vinicius-fernandes-santos/
- Email: vinicius_fernandes94@outlook.com

---

## 🙏 Acknowledgments

- Johnson & Johnson for the technical challenge opportunity
- Next.js team for excellent documentation
- Tailwind CSS for rapid styling
- Framer Motion for animation library
- GitHub Copilot and Claude AI for development assistance

---

## 📊 Project Stats

- **Development Time**: ~23 hours

---

**Built with heart using Next.js and TypeScript**