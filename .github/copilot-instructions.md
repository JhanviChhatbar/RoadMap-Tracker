# Roadmap Tracker - Development Guide

## Project Overview
Full-stack web application for tracking a 16-week building journey with task management, progress visualization, and completion logging.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Backend**: Next.js 15 with App Router
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Utilities**: date-fns for date handling

## Implementation Status

### ✅ Completed Features
- [x] Scaffold Next.js project with TypeScript, Tailwind CSS, ESLint, App Router
- [x] Install all dependencies (better-sqlite3, date-fns, recharts, lucide-react)
- [x] Create complete database schema with migrations
- [x] Build full CRUD API routes for tasks, sections
- [x] Create TaskCard React component
- [x] Implement daily view with task management
- [x] Add task completion logging functionality
- [x] Set up API initialization with 16-week roadmap data
- [x] Create placeholder pages for all features
- [x] TypeScript support with strict type checking
- [x] ESLint configuration and compliance

### 🔄 In Development (Placeholder Pages Ready)
- [ ] Weekly view with section filtering
- [ ] Progress dashboard with charts (recharts ready)
- [ ] Calendar view (16 weeks color-coded)
- [ ] Areas needing attention dashboard
- [ ] Carry-over logic for incomplete tasks
- [ ] Advanced filtering and search

## Database Schema

### Tasks Table
```
id, title, description, dueDate, priority (High/Medium/Low),
status (Not Started/In Progress/Completed), section, weekNumber,
dayOfWeek, completedAt, completionLog, isCarriedOver,
carriedOverFrom, createdAt, updatedAt
```

### Sections Table
```
id, name, weekRange, color, description, createdAt
```

### CarryOverLogs Table
```
id, taskId, fromDate, toDate, reason, dismissedAt, createdAt
```

### DailyLogs Table
```
id, taskId, completedAt, note, duration, createdAt
```

## Project Structure
```
src/
├── app/api/          # API routes (tasks, sections, init, bulk)
├── app/daily/        # Daily view page
├── app/weekly/       # Weekly view placeholder
├── app/progress/     # Progress dashboard placeholder
├── app/calendar/     # Calendar view placeholder
├── app/attention/    # Weak areas placeholder
├── app/settings/     # Settings placeholder
├── components/       # React components (TaskCard)
├── db/              # Database layer (index.ts, queries.ts)
├── lib/             # Utilities (roadmap-data, date-utils)
└── types/           # TypeScript types
```

## Running the Project

### Development
```bash
npm install --legacy-peer-deps
npm run dev
```
Open http://localhost:3000

### Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Key API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?date=YYYY-MM-DD` - Get tasks by date
- `GET /api/tasks?week=1` - Get tasks by week
- `GET /api/tasks?section=id` - Get tasks by section
- `POST /api/tasks` - Create task
- `PUT /api/tasks?id=id` - Update task
- `DELETE /api/tasks?id=id` - Delete task
- `POST /api/tasks/bulk` - Bulk operations

### Sections
- `GET /api/sections` - Get all sections
- `POST /api/sections` - Create section

### Init
- `GET /api/init` - Check initialization
- `POST /api/init` - Initialize database

## Pre-populated 16-Week Roadmap

8 sections across 16 weeks:
1. Brand Building (1-2)
2. Content Creation (3-4)
3. Technical Projects (5-6)
4. Community Engagement (7-8)
5. Monetization (9-10)
6. Scaling (11-12)
7. Advanced Features (13-14)
8. Optimization & Launch (15-16)

Auto-initialized on first app load.

## Development Notes

- Database file: `data/roadmap.db` (created automatically)
- All imports use path aliases (`@/*`)
- Strict TypeScript checking enabled
- ESLint rules configured for Next.js
- Lucide icons for UI components
- Date operations use date-fns library
- Better-sqlite3 for synchronous database access

## Next Steps for Enhancement

1. Implement weekly view with task filtering
2. Add progress charts with recharts
3. Build calendar view component
4. Implement carry-over logic
5. Create weak areas dashboard
6. Add data export functionality
7. Implement notifications
8. Add dark mode support

## Troubleshooting

### Database errors
Delete `data/` directory and restart to reinitialize

### Dependency conflicts
Use `npm install --legacy-peer-deps` due to React 19 compatibility

### Build errors
Run `npm run lint` to check for TypeScript errors

---

For complete documentation, see README.md
