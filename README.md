# Roadmap Tracker 🚀

A comprehensive full-stack web application for tracking your 16-week building journey with advanced task management, progress visualization, and completion logging.

## Features

### ✅ Core Features Implemented

- **Daily Task Management**: View and manage today's tasks with an intuitive interface
- **Task Completion Logging**: Mark tasks as complete with detailed notes (up to 500 chars)
- **Priority & Status Tracking**: Tasks with High/Medium/Low priority and Not Started/In Progress/Completed status
- **Auto-save**: Automatic persistence to SQLite database
- **Bulk Actions**: Mark all tasks as complete or incomplete for a specific day

### 🎯 Features in Development

- **Weekly View**: Organized view of all tasks for a specific week
- **Progress Dashboard**: Charts and analytics showing completion rates by section
- **Calendar View**: 16-week calendar with color-coded progress (Green/Yellow/Red)
- **Areas Needing Attention**: Identify weak areas and overdue tasks
- **Carry-over Logic**: Automatic task carry-over for incomplete items
- **Settings**: User preferences and configuration

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Backend**: Next.js 15 with App Router
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── init/              # Database initialization
│   │   ├── tasks/             # Task CRUD operations
│   │   ├── sections/          # Section management
│   │   └── bulk/              # Bulk operations
│   ├── daily/                 # Daily view page
│   ├── weekly/                # Weekly view page
│   ├── progress/              # Progress dashboard
│   ├── calendar/              # Calendar view
│   ├── attention/             # Weak areas dashboard
│   ├── settings/              # Settings page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home/dashboard
│   └── globals.css            # Global styles
├── components/                # React components
│   └── TaskCard.tsx          # Task card component
├── db/                        # Database layer
│   ├── index.ts              # Database initialization
│   └── queries.ts            # Database operations
├── lib/                       # Utilities
│   ├── roadmap-data.ts       # 16-week roadmap data
│   └── date-utils.ts         # Date utilities
├── types/                     # TypeScript types
│   └── index.ts              # Type definitions
└── data/                      # Database files (gitignored)
    └── roadmap.db            # SQLite database
```

## Database Schema

### Tasks
```sql
- id (PRIMARY KEY)
- title, description
- dueDate, priority, status
- section, weekNumber, dayOfWeek
- completedAt, completionLog
- isCarriedOver, carriedOverFrom
- createdAt, updatedAt
```

### Sections
```sql
- id (PRIMARY KEY)
- name (UNIQUE)
- weekRange, color, description
- createdAt
```

### CarryOverLogs
```sql
- id (PRIMARY KEY)
- taskId, fromDate, toDate
- reason, dismissedAt
- createdAt
```

### DailyLogs (optional)
```sql
- id (PRIMARY KEY)
- taskId, completedAt
- note, duration
- createdAt
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?date=YYYY-MM-DD` - Get tasks for a specific date
- `GET /api/tasks?week=1` - Get tasks for a specific week
- `GET /api/tasks?section=section-id` - Get tasks for a section
- `GET /api/tasks?id=task-id` - Get a specific task
- `POST /api/tasks` - Create a task
- `PUT /api/tasks?id=task-id` - Update a task
- `DELETE /api/tasks?id=task-id` - Delete a task
- `POST /api/tasks/bulk` - Bulk operations (mark all complete/incomplete)

### Sections
- `GET /api/sections` - Get all sections
- `GET /api/sections?id=section-id` - Get a specific section
- `POST /api/sections` - Create a section

### Initialization
- `GET /api/init` - Check initialization status
- `POST /api/init` - Initialize database with roadmap data

## 16-Week Roadmap

The application comes pre-populated with an 8-section, 16-week roadmap:

1. **Brand Building** (Weeks 1-2)
   - GitHub Profile, Documentation, LinkedIn

2. **Content Creation** (Weeks 3-4)
   - YouTube Channel, Course Outline

3. **Technical Projects** (Weeks 5-6)
   - SaaS MVP, Authentication, Database Optimization

4. **Community Engagement** (Weeks 7-8)
   - Open Source, Webinars, Mentoring

5. **Monetization** (Weeks 9-10)
   - Course Launch, Sponsorships, SaaS Launch

6. **Scaling** (Weeks 11-12)
   - Infrastructure, Customer Support, Analytics

7. **Advanced Features** (Weeks 13-14)
   - AI Integration, Mobile App, Real-time Features

8. **Optimization & Launch** (Weeks 15-16)
   - Performance, Security, Final Launch

## Data Persistence

All data is automatically saved to an SQLite database located at `data/roadmap.db`. The database is automatically created and initialized on first run.

## Key Components

### TaskCard
Displays individual tasks with:
- Completion checkbox
- Priority badge
- Status indicator
- Completion log editing
- Delete button

### Daily View
Shows today's tasks with:
- Large, focused interface
- Quick "Mark All Done" button
- Task cards with completion details
- Carried-over tasks indicator

### API Routes
RESTful endpoints for all database operations with proper error handling.

## Configuration

### Tailwind CSS
Custom colors are defined in `tailwind.config.ts`:
- Brand colors (Blue/Indigo)
- Success (Green), Warning (Orange), Danger (Red)

### Next.js
- React Strict Mode enabled
- TypeScript support
- ESLint configured

## Performance Optimizations

- Database indexes on frequently queried fields
- Optimized imports using path aliases (@/*)
- Tailwind CSS purging for production
- Next.js static optimization

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

To add new features:

1. Create components in `/src/components`
2. Add types to `/src/types/index.ts`
3. Create API routes in `/src/app/api`
4. Add database queries in `/src/db/queries.ts`
5. Build and test with `npm run build`

## Future Enhancements

- [ ] Pomodoro timer integration
- [ ] Habit streak tracking
- [ ] Planned vs Actual comparison
- [ ] Team collaboration features
- [ ] Voice notes for completion logs
- [ ] Recurring tasks
- [ ] Goal tracking
- [ ] PDF/CSV export
- [ ] Email digests
- [ ] Mobile app (React Native)

## Troubleshooting

### Database issues
If you encounter database errors, delete the `data/` directory and restart the server to reinitialize.

### Build errors
Run `npm install --legacy-peer-deps` if you encounter peer dependency issues.

## License

MIT

## Support

For issues or questions, create an issue in the repository.

---

**Built with ❤️ using Next.js and React**
