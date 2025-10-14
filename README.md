# Warehouse Management System

A .NET ASP.NET Core Web API project for managing warehouse categories and inventory.

## Features

- **Category Management**: Full CRUD operations for product categories
- **RESTful API**: Clean, well-documented API endpoints
- **Entity Framework Core**: Database operations with SQLite
- **Repository Pattern**: Clean separation of concerns
- **Swagger Documentation**: Interactive API documentation
- **Soft Delete**: Categories are soft-deleted (marked as inactive)

## Project Structure

```
WarehouseManagement/
├── Controllers/          # API Controllers
├── Data/                # Database context and configurations
├── Interfaces/          # Repository and service interfaces
├── Models/              # Entity models
├── Repositories/        # Data access layer
├── Services/           # Business logic layer
└── Migrations/         # Entity Framework migrations
```

## API Endpoints

### Categories

- `GET /api/categories` - Get all active categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category (soft delete)
- `HEAD /api/categories/{id}` - Check if category exists

## Getting Started

1. **Prerequisites**
   - .NET 9.0 SDK
   - SQLite (included with .NET)

2. **Run the Application**
   ```bash
   dotnet run
   ```

3. **Access Swagger UI**
   - Navigate to `http://localhost:5000/swagger` in your browser

4. **Test API Endpoints**
   ```bash
   # Get all categories
   curl -X GET "http://localhost:5000/api/categories"
   
   # Create new category
   curl -X POST "http://localhost:5000/api/categories" \
        -H "Content-Type: application/json" \
        -d '{"name":"Sports","description":"Sports equipment"}'
   ```

## Database

The application uses SQLite database (`warehouse.db`) with Entity Framework Core migrations. The database is automatically created when you run the application for the first time.

### Sample Data

The application comes with pre-seeded categories:
- Electronics
- Clothing  
- Books

## Architecture

The project follows a clean architecture pattern:

- **Models**: Entity definitions with data annotations
- **Interfaces**: Contracts for repositories and services
- **Repositories**: Data access layer using Entity Framework
- **Services**: Business logic layer
- **Controllers**: API endpoints with proper error handling

## Next Steps

This is the foundation for a warehouse management system. Future enhancements could include:

- Product management
- Inventory tracking
- Supplier management
- Order processing
- User authentication and authorization
- Reporting and analytics
