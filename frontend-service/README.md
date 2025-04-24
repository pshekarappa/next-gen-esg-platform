# ESG Platform - Frontend Service

## Overview

This repository contains the frontend service for the ESG (Environmental, Social, and Governance) platform. The frontend is built with React and provides a user interface for querying ESG-related information and viewing company policies.

## Tech Stack

- React 19.1.0
- Material UI 7.0.2 (for UI components)
- React Router 7.5.1 (for navigation)
- Axios (for API requests)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### Step 1: Clone the Repository

```bash
git clone [repository-url]
cd next-gen-esg-platform/frontend-service
```

### Step 2: Install Dependencies

Run the following command to install all the required dependencies:

```bash
npm install
```

### Step 3: Configure Environment (Optional)

The application is currently configured to connect to backend services on localhost. For development purposes, this should work fine. If you need to change the backend URL, open `src/services/apiService.js` and modify the `QUERY_SERVICE_URL` constant.

### Step 4: Start the Development Server

Run the following command to start the development server:

```bash
npm start
```

This will start the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will automatically reload when you make changes to the code.

## Application Structure

- `/src` - Contains all the source code
  - `/components` - React components used throughout the application
  - `/services` - API service functions for backend communication
  - `/theme` - Material UI theme configuration
  - `App.js` - Main application component

## Development Guide

### Working with Components

The application uses React components located in the `/src/components` directory. Each component is responsible for a specific part of the UI.

To create a new component:

1. Create a new file in the appropriate subfolder under `/src/components`
2. Import necessary dependencies
3. Define your component (function or class-based)
4. Export your component
5. Import and use it in other components as needed

Example:

```jsx
// src/components/YourComponent.js
import React from "react";

function YourComponent() {
  return (
    <div>
      <h1>Your Component</h1>
    </div>
  );
}

export default YourComponent;
```

### Working with the API

The application communicates with backend services using Axios. The API service functions are located in `/src/services/apiService.js`.

To call an API:

1. Import the required function from apiService.js
2. Call the function in your component
3. Handle the response using async/await or promises

Example:

```jsx
import { searchESGQuery } from "../services/apiService";

// In a component
async function handleSearch() {
  try {
    const result = await searchESGQuery("carbon emissions");
    console.log(result);
    // Process the result
  } catch (error) {
    console.error("Error occurred:", error);
    // Handle the error
  }
}
```

### Adding Routes

The application uses React Router for navigation. To add a new route:

1. Import your component
2. Add a new Route element in the router configuration

## Testing

Run tests with:

```bash
npm test
```

This launches the test runner in interactive watch mode.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting

### Common Issues

1. **Node Version Issues**: Ensure you're using a compatible Node.js version. This project works best with Node.js v18+.

2. **Missing Dependencies**: If you encounter errors about missing dependencies, try running `npm install` again.

3. **Backend Connection Issues**: By default, the application expects the Query Service to be running on `http://localhost:8002`. Make sure this service is running or update the URL in `src/services/apiService.js`.

4. **Port Already in Use**: If port 3000 is already in use, React will prompt you to use a different port. Press 'Y' to accept.

If you encounter any other issues, please reach out to the development team.

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material UI Documentation](https://mui.com/getting-started/usage/)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
