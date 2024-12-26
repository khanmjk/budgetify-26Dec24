# Budget Management System

A comprehensive budget management system built with React, TypeScript, and Vite. The system allows organizations to manage their budgets across departments, teams, and track various expenses including conference travel and business travel.

## Features

### Organization Management
- Create and manage multiple organizations
- Define organization-specific budget categories
- Set and track organization-wide budgets
- Monitor budget utilization across departments

### Department Management
- Create departments with dedicated budgets
- Assign department heads
- Track department-level budget allocation and spending
- Monitor team performance within departments

### Team Management
- Create and manage teams under departments
- Assign team managers
- Allocate and track team budgets
- Monitor team spending across categories

### Budget Features
- Multi-level budget allocation (Organization → Department → Team)
- Budget category management
- Expense tracking and monitoring
- Budget utilization visualization
- Comprehensive reporting

### Travel Management
- Conference travel planning and budgeting
- Business travel expense tracking
- Multi-traveler support
- Travel category management

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- Recharts (Charts)
- Lucide React (Icons)

## Project Structure

```
src/
├── components/
│   ├── budget/         # Budget-related components
│   ├── common/         # Shared components
│   ├── dashboard/      # Dashboard components
│   ├── department/     # Department management
│   ├── forms/          # Form components
│   ├── lists/          # List components
│   ├── navigation/     # Navigation components
│   └── organization/   # Organization management
├── pages/              # Page components
├── services/          # API services
├── store/             # Zustand store
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Key Concepts

1. Organization Structure
   - Organizations contain departments
   - Departments contain teams
   - Teams have managers and budgets

2. Budget Hierarchy
   - Organization sets total budget
   - Budget is allocated to departments
   - Departments allocate to teams
   - Teams manage their budgets across categories

3. State Management
   - Zustand store manages application state
   - Separate stores for different concerns
   - Type-safe state management

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Add comprehensive comments
- Follow consistent naming conventions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.