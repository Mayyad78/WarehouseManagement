using WarehouseManagement.DTOs;

namespace WarehouseManagement.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
        Task<IEnumerable<ItemDto>> GetFilteredItemsAsync(ItemFilterDto filter);
        Task<ItemDto?> GetItemByIdAsync(int id);
        Task<ItemDto?> GetItemBySKUAsync(string sku);
        Task<IEnumerable<ItemDto>> GetItemsByCategoryAsync(int categoryId);
        Task<IEnumerable<ItemDto>> GetItemsBySubCategoryAsync(int subCategoryId);
        Task<IEnumerable<ItemDto>> GetLowStockItemsAsync();
        Task<IEnumerable<ItemDto>> GetItemsNeedingReorderAsync();
        Task<ItemDto> CreateItemAsync(CreateItemDto createItemDto);
        Task<ItemDto> UpdateItemAsync(UpdateItemDto updateItemDto);
        Task<bool> DeleteItemAsync(int id);
        Task<bool> SKUExistsAsync(string sku, int? excludeItemId = null);
    }
}