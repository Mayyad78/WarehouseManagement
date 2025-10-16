using WarehouseManagement.DTOs;
using WarehouseManagement.Interfaces;
using WarehouseManagement.Models;

namespace WarehouseManagement.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ISubCategoryRepository _subCategoryRepository;

        public ItemService(
            IItemRepository itemRepository,
            ICategoryRepository categoryRepository,
            ISubCategoryRepository subCategoryRepository)
        {
            _itemRepository = itemRepository;
            _categoryRepository = categoryRepository;
            _subCategoryRepository = subCategoryRepository;
        }

        public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
        {
            var items = await _itemRepository.GetAllAsync();
            return items.Select(MapToDto);
        }

        public async Task<IEnumerable<ItemDto>> GetFilteredItemsAsync(ItemFilterDto filter)
        {
            var items = await _itemRepository.GetFilteredAsync(filter);
            return items.Select(MapToDto);
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            return item != null ? MapToDto(item) : null;
        }

        public async Task<ItemDto?> GetItemBySKUAsync(string sku)
        {
            var item = await _itemRepository.GetBySKUAsync(sku);
            return item != null ? MapToDto(item) : null;
        }

        public async Task<IEnumerable<ItemDto>> GetItemsByCategoryAsync(int categoryId)
        {
            var items = await _itemRepository.GetByCategoryAsync(categoryId);
            return items.Select(MapToDto);
        }

        public async Task<IEnumerable<ItemDto>> GetItemsBySubCategoryAsync(int subCategoryId)
        {
            var items = await _itemRepository.GetBySubCategoryAsync(subCategoryId);
            return items.Select(MapToDto);
        }

        public async Task<IEnumerable<ItemDto>> GetLowStockItemsAsync()
        {
            var items = await _itemRepository.GetLowStockItemsAsync();
            return items.Select(MapToDto);
        }

        public async Task<IEnumerable<ItemDto>> GetItemsNeedingReorderAsync()
        {
            var items = await _itemRepository.GetItemsNeedingReorderAsync();
            return items.Select(MapToDto);
        }

        public async Task<ItemDto> CreateItemAsync(CreateItemDto createItemDto)
        {
            // Validate category exists
            var category = await _categoryRepository.GetByIdAsync(createItemDto.CategoryId);
            if (category == null)
                throw new ArgumentException("Category not found");

            // Validate subcategory if provided
            if (createItemDto.SubCategoryId.HasValue)
            {
                var subCategory = await _subCategoryRepository.GetByIdAsync(createItemDto.SubCategoryId.Value);
                if (subCategory == null)
                    throw new ArgumentException("SubCategory not found");
                
                if (subCategory.CategoryId != createItemDto.CategoryId)
                    throw new ArgumentException("SubCategory does not belong to the specified Category");
            }

            // Check if SKU already exists
            if (await _itemRepository.SKUExistsAsync(createItemDto.SKU))
                throw new ArgumentException("An item with this SKU already exists");

            var item = new Item
            {
                Name = createItemDto.Name,
                SKU = createItemDto.SKU,
                Description = createItemDto.Description,
                CategoryId = createItemDto.CategoryId,
                SubCategoryId = createItemDto.SubCategoryId,
                Price = createItemDto.Price,
                CostPrice = createItemDto.CostPrice,
                UnitOfSale = createItemDto.UnitOfSale,
                QuantityInStock = createItemDto.QuantityInStock,
                MinimumStockLevel = createItemDto.MinimumStockLevel,
                MaximumStockLevel = createItemDto.MaximumStockLevel,
                ReorderPoint = createItemDto.ReorderPoint,
                Barcode = createItemDto.Barcode,
                Brand = createItemDto.Brand,
                Supplier = createItemDto.Supplier,
                Weight = createItemDto.Weight,
                Dimensions = createItemDto.Dimensions,
                ExpiryDate = createItemDto.ExpiryDate,
                Location = createItemDto.Location,
                ImageUrl = createItemDto.ImageUrl,
                Notes = createItemDto.Notes,
                IsActive = createItemDto.IsActive
            };

            var createdItem = await _itemRepository.CreateAsync(item);
            return MapToDto(createdItem);
        }

        public async Task<ItemDto> UpdateItemAsync(UpdateItemDto updateItemDto)
        {
            var existingItem = await _itemRepository.GetByIdAsync(updateItemDto.Id);
            if (existingItem == null)
                throw new ArgumentException("Item not found");

            // Validate category exists
            var category = await _categoryRepository.GetByIdAsync(updateItemDto.CategoryId);
            if (category == null)
                throw new ArgumentException("Category not found");

            // Validate subcategory if provided
            if (updateItemDto.SubCategoryId.HasValue)
            {
                var subCategory = await _subCategoryRepository.GetByIdAsync(updateItemDto.SubCategoryId.Value);
                if (subCategory == null)
                    throw new ArgumentException("SubCategory not found");
                
                if (subCategory.CategoryId != updateItemDto.CategoryId)
                    throw new ArgumentException("SubCategory does not belong to the specified Category");
            }

            // Check if SKU already exists for another item
            if (await _itemRepository.SKUExistsAsync(updateItemDto.SKU, updateItemDto.Id))
                throw new ArgumentException("An item with this SKU already exists");

            existingItem.Name = updateItemDto.Name;
            existingItem.SKU = updateItemDto.SKU;
            existingItem.Description = updateItemDto.Description;
            existingItem.CategoryId = updateItemDto.CategoryId;
            existingItem.SubCategoryId = updateItemDto.SubCategoryId;
            existingItem.Price = updateItemDto.Price;
            existingItem.CostPrice = updateItemDto.CostPrice;
            existingItem.UnitOfSale = updateItemDto.UnitOfSale;
            existingItem.QuantityInStock = updateItemDto.QuantityInStock;
            existingItem.MinimumStockLevel = updateItemDto.MinimumStockLevel;
            existingItem.MaximumStockLevel = updateItemDto.MaximumStockLevel;
            existingItem.ReorderPoint = updateItemDto.ReorderPoint;
            existingItem.Barcode = updateItemDto.Barcode;
            existingItem.Brand = updateItemDto.Brand;
            existingItem.Supplier = updateItemDto.Supplier;
            existingItem.Weight = updateItemDto.Weight;
            existingItem.Dimensions = updateItemDto.Dimensions;
            existingItem.ExpiryDate = updateItemDto.ExpiryDate;
            existingItem.Location = updateItemDto.Location;
            existingItem.ImageUrl = updateItemDto.ImageUrl;
            existingItem.Notes = updateItemDto.Notes;
            existingItem.IsActive = updateItemDto.IsActive;

            var updatedItem = await _itemRepository.UpdateAsync(existingItem);
            return MapToDto(updatedItem);
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            return await _itemRepository.DeleteAsync(id);
        }

        public async Task<bool> SKUExistsAsync(string sku, int? excludeItemId = null)
        {
            return await _itemRepository.SKUExistsAsync(sku, excludeItemId);
        }

        private static ItemDto MapToDto(Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                SKU = item.SKU,
                Description = item.Description,
                CategoryId = item.CategoryId,
                CategoryName = item.Category?.Name ?? string.Empty,
                SubCategoryId = item.SubCategoryId,
                SubCategoryName = item.SubCategory?.Name,
                Price = item.Price,
                CostPrice = item.CostPrice,
                UnitOfSale = item.UnitOfSale.ToString(),
                QuantityInStock = item.QuantityInStock,
                MinimumStockLevel = item.MinimumStockLevel,
                MaximumStockLevel = item.MaximumStockLevel,
                ReorderPoint = item.ReorderPoint,
                Barcode = item.Barcode,
                Brand = item.Brand,
                Supplier = item.Supplier,
                Weight = item.Weight,
                Dimensions = item.Dimensions,
                ExpiryDate = item.ExpiryDate,
                Location = item.Location,
                ImageUrl = item.ImageUrl,
                Notes = item.Notes,
                IsActive = item.IsActive,
                CreatedAt = item.CreatedAt,
                UpdatedAt = item.UpdatedAt,
                ProfitMargin = item.ProfitMargin,
                IsLowStock = item.IsLowStock,
                NeedsReorder = item.NeedsReorder,
                TotalValue = item.TotalValue
            };
        }
    }
}