# Warehouse Management System - Category Interface

## Overview
This is a modern web interface for managing categories in the Warehouse Management System. The interface provides a clean, responsive design with full CRUD (Create, Read, Update, Delete) functionality for category management.

## Features

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, modern interface with smooth animations
- **Intuitive Navigation**: Easy-to-use interface with clear visual feedback

### 📋 Category Management
- **View Categories**: Display all categories in an organized grid layout
- **Add Categories**: Create new categories with name, description, and active status
- **Edit Categories**: Update existing category information
- **Delete Categories**: Remove categories with confirmation dialog
- **Search & Filter**: Find categories by name/description and filter by status

### 🔧 Technical Features
- **Real-time Updates**: Immediate UI updates after operations
- **Form Validation**: Client-side validation with error messages
- **Toast Notifications**: Success/error feedback for all operations
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Graceful error handling with user-friendly messages

## Getting Started

### Prerequisites
- .NET 9.0 SDK
- SQLite (included with the project)

### Running the Application

1. **Navigate to the project directory**:
   ```bash
   cd WarehouseManagement
   ```

2. **Run the application**:
   ```bash
   dotnet run
   ```

3. **Access the interface**:
   - Open your browser and navigate to: `http://localhost:5052`
   - The interface will automatically load and display existing categories

### API Endpoints
The interface communicates with the following API endpoints:
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

## Interface Guide

### Main Dashboard
- **Header**: Contains the application logo and "Add Category" button
- **Search Bar**: Filter categories by name or description
- **Status Filter**: Show all, active only, or inactive categories
- **Category Grid**: Displays all categories in card format

### Category Cards
Each category card shows:
- Category name and status (Active/Inactive)
- Description (if provided)
- Creation and last update dates
- Edit and Delete action buttons

### Adding a Category
1. Click the "Add Category" button in the header
2. Fill in the category name (required)
3. Add an optional description
4. Set the active status (checked by default)
5. Click "Save Category"

### Editing a Category
1. Click the "Edit" button on any category card
2. Modify the category information
3. Click "Update Category"

### Deleting a Category
1. Click the "Delete" button on any category card
2. Confirm the deletion in the modal dialog
3. The category will be permanently removed

## File Structure

```
wwwroot/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # CSS styles and responsive design
└── js/
    └── app.js          # JavaScript functionality and API calls
```

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### CORS Configuration
The application includes CORS configuration to allow frontend-backend communication:
- Configured in `Program.cs`
- Allows all origins, methods, and headers for development

### Static File Serving
- Static files are served from the `wwwroot` directory
- Fallback routing configured to serve `index.html` for SPA behavior

### Error Handling
- Client-side validation for form inputs
- API error handling with user-friendly messages
- Network error handling with retry suggestions

## Next Steps
This interface serves as the foundation for the warehouse management system. Future enhancements could include:
- Product management interface
- Inventory tracking
- User authentication and authorization
- Advanced reporting and analytics
- Bulk operations
- Import/export functionality

## Support
For issues or questions regarding the interface, please check the browser console for error messages and ensure the backend API is running properly.
