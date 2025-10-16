using System.ComponentModel.DataAnnotations;
using WarehouseManagement.Models;

namespace WarehouseManagement.DTOs
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int? SubCategoryId { get; set; }
        public string? SubCategoryName { get; set; }
        public decimal Price { get; set; }
        public decimal? CostPrice { get; set; }
        public string UnitOfSale { get; set; } = string.Empty;
        public int QuantityInStock { get; set; }
        public int MinimumStockLevel { get; set; }
        public int? MaximumStockLevel { get; set; }
        public int ReorderPoint { get; set; }
        public string? Barcode { get; set; }
        public string? Brand { get; set; }
        public string? Supplier { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Location { get; set; }
        public string? ImageUrl { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public decimal? ProfitMargin { get; set; }
        public bool IsLowStock { get; set; }
        public bool NeedsReorder { get; set; }
        public decimal? TotalValue { get; set; }
    }

    public class CreateItemDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string SKU { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public int? SubCategoryId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? CostPrice { get; set; }

        [Required]
        public UnitOfSale UnitOfSale { get; set; }

        [Range(0, int.MaxValue)]
        public int QuantityInStock { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int MinimumStockLevel { get; set; } = 0;

        [Range(0, int.MaxValue)]
        public int? MaximumStockLevel { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderPoint { get; set; } = 0;

        [StringLength(200)]
        public string? Barcode { get; set; }

        [StringLength(200)]
        public string? Brand { get; set; }

        [StringLength(200)]
        public string? Supplier { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Weight { get; set; }

        [StringLength(100)]
        public string? Dimensions { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdateItemDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string SKU { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public int? SubCategoryId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? CostPrice { get; set; }

        [Required]
        public UnitOfSale UnitOfSale { get; set; }

        [Range(0, int.MaxValue)]
        public int QuantityInStock { get; set; }

        [Range(0, int.MaxValue)]
        public int MinimumStockLevel { get; set; }

        [Range(0, int.MaxValue)]
        public int? MaximumStockLevel { get; set; }

        [Range(0, int.MaxValue)]
        public int ReorderPoint { get; set; }

        [StringLength(200)]
        public string? Barcode { get; set; }

        [StringLength(200)]
        public string? Brand { get; set; }

        [StringLength(200)]
        public string? Supplier { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? Weight { get; set; }

        [StringLength(100)]
        public string? Dimensions { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(200)]
        public string? Location { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }

        public bool IsActive { get; set; }
    }

    public class ItemFilterDto
    {
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public string? SearchTerm { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsLowStock { get; set; }
        public bool? NeedsReorder { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Brand { get; set; }
        public string? Supplier { get; set; }
    }
}