using Microsoft.EntityFrameworkCore;
using WarehouseManagement.Data;
using WarehouseManagement.Interfaces;
using WarehouseManagement.Models;
using WarehouseManagement.DTOs;

namespace WarehouseManagement.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly WarehouseDbContext _context;

        public ItemRepository(WarehouseDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Where(i => i.IsActive)
                .OrderBy(i => i.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetFilteredAsync(ItemFilterDto filter)
        {
            var query = _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .AsQueryable();

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(i => i.CategoryId == filter.CategoryId.Value);
            }

            if (filter.SubCategoryId.HasValue)
            {
                query = query.Where(i => i.SubCategoryId == filter.SubCategoryId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var searchTerm = filter.SearchTerm.ToLower();
                query = query.Where(i => 
                    i.Name.ToLower().Contains(searchTerm) ||
                    i.SKU.ToLower().Contains(searchTerm) ||
                    (i.Description != null && i.Description.ToLower().Contains(searchTerm)) ||
                    (i.Barcode != null && i.Barcode.ToLower().Contains(searchTerm))
                );
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(i => i.IsActive == filter.IsActive.Value);
            }

            if (filter.IsLowStock.HasValue && filter.IsLowStock.Value)
            {
                query = query.Where(i => i.QuantityInStock <= i.MinimumStockLevel);
            }

            if (filter.NeedsReorder.HasValue && filter.NeedsReorder.Value)
            {
                query = query.Where(i => i.QuantityInStock <= i.ReorderPoint);
            }

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(i => i.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(i => i.Price <= filter.MaxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.Brand))
            {
                query = query.Where(i => i.Brand != null && i.Brand.ToLower().Contains(filter.Brand.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(filter.Supplier))
            {
                query = query.Where(i => i.Supplier != null && i.Supplier.ToLower().Contains(filter.Supplier.ToLower()));
            }

            return await query.OrderBy(i => i.Name).ToListAsync();
        }

        public async Task<Item?> GetByIdAsync(int id)
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Item?> GetBySKUAsync(string sku)
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .FirstOrDefaultAsync(i => i.SKU == sku);
        }

        public async Task<IEnumerable<Item>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Where(i => i.CategoryId == categoryId && i.IsActive)
                .OrderBy(i => i.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetBySubCategoryAsync(int subCategoryId)
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Where(i => i.SubCategoryId == subCategoryId && i.IsActive)
                .OrderBy(i => i.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetLowStockItemsAsync()
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Where(i => i.IsActive && i.QuantityInStock <= i.MinimumStockLevel)
                .OrderBy(i => i.QuantityInStock)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetItemsNeedingReorderAsync()
        {
            return await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Where(i => i.IsActive && i.QuantityInStock <= i.ReorderPoint)
                .OrderBy(i => i.QuantityInStock)
                .ToListAsync();
        }

        public async Task<Item> CreateAsync(Item item)
        {
            item.CreatedAt = DateTime.UtcNow;
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            
            // Reload with relationships
            return (await GetByIdAsync(item.Id))!;
        }

        public async Task<Item> UpdateAsync(Item item)
        {
            item.UpdatedAt = DateTime.UtcNow;
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
            
            // Reload with relationships
            return (await GetByIdAsync(item.Id))!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
                return false;

            // Soft delete
            item.IsActive = false;
            item.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Items.AnyAsync(i => i.Id == id);
        }

        public async Task<bool> SKUExistsAsync(string sku, int? excludeItemId = null)
        {
            var query = _context.Items.Where(i => i.SKU == sku);
            
            if (excludeItemId.HasValue)
            {
                query = query.Where(i => i.Id != excludeItemId.Value);
            }
            
            return await query.AnyAsync();
        }
    }
}