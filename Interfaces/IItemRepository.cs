using WarehouseManagement.Models;
using WarehouseManagement.DTOs;

namespace WarehouseManagement.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllAsync();
        Task<IEnumerable<Item>> GetFilteredAsync(ItemFilterDto filter);
        Task<Item?> GetByIdAsync(int id);
        Task<Item?> GetBySKUAsync(string sku);
        Task<IEnumerable<Item>> GetByCategoryAsync(int categoryId);
        Task<IEnumerable<Item>> GetBySubCategoryAsync(int subCategoryId);
        Task<IEnumerable<Item>> GetLowStockItemsAsync();
        Task<IEnumerable<Item>> GetItemsNeedingReorderAsync();
        Task<Item> CreateAsync(Item item);
        Task<Item> UpdateAsync(Item item);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> SKUExistsAsync(string sku, int? excludeItemId = null);
    }
}