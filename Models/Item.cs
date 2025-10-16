using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseManagement.Models
{
    public enum UnitOfSale
    {
        Piece = 1,
        Kilogram = 2,
        Gram = 3,
        Liter = 4,
        Milliliter = 5,
        Meter = 6,
        Box = 7,
        Pack = 8,
        Carton = 9,
        Dozen = 10,
        Set = 11,
        Pair = 12,
        Bundle = 13,
        Roll = 14,
        Sheet = 15
    }

    public class Item
    {
        public int Id { get; set; }

        // Basic Information
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string SKU { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        // Category Information
        [Required]
        public int CategoryId { get; set; }
        
        [ForeignKey("CategoryId")]
        public Category Category { get; set; } = null!;

        public int? SubCategoryId { get; set; }
        
        [ForeignKey("SubCategoryId")]
        public SubCategory? SubCategory { get; set; }

        // Pricing Information
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CostPrice { get; set; }

        [Required]
        public UnitOfSale UnitOfSale { get; set; } = UnitOfSale.Piece;

        // Inventory Information
        [Required]
        public int QuantityInStock { get; set; } = 0;

        public int MinimumStockLevel { get; set; } = 0;

        public int? MaximumStockLevel { get; set; }

        public int ReorderPoint { get; set; } = 0;

        // Product Details
        [StringLength(200)]
        public string? Barcode { get; set; }

        [StringLength(200)]
        public string? Brand { get; set; }

        [StringLength(200)]
        public string? Supplier { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Weight { get; set; } // in kg

        [StringLength(100)]
        public string? Dimensions { get; set; } // e.g., "10x20x30 cm"

        public DateTime? ExpiryDate { get; set; }

        [StringLength(200)]
        public string? Location { get; set; } // e.g., "A-12-3" (Aisle-Shelf-Bin)

        // Image
        [StringLength(500)]
        public string? ImageUrl { get; set; }

        // Additional Information
        [StringLength(1000)]
        public string? Notes { get; set; }

        // Status
        public bool IsActive { get; set; } = true;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Computed Properties
        [NotMapped]
        public decimal? ProfitMargin => CostPrice.HasValue && CostPrice.Value > 0 
            ? ((Price - CostPrice.Value) / CostPrice.Value) * 100 
            : null;

        [NotMapped]
        public bool IsLowStock => QuantityInStock <= MinimumStockLevel;

        [NotMapped]
        public bool NeedsReorder => QuantityInStock <= ReorderPoint;

        [NotMapped]
        public decimal? TotalValue => QuantityInStock * (CostPrice ?? Price);
    }
}