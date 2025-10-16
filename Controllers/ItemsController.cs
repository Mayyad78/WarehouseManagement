using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.DTOs;
using WarehouseManagement.Interfaces;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        /// <summary>
        /// Get all items
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetAllItems()
        {
            try
            {
                var items = await _itemService.GetAllItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get filtered items
        /// </summary>
        [HttpPost("filter")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetFilteredItems([FromBody] ItemFilterDto filter)
        {
            try
            {
                var items = await _itemService.GetFilteredItemsAsync(filter);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get item by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItemById(int id)
        {
            try
            {
                var item = await _itemService.GetItemByIdAsync(id);
                if (item == null)
                    return NotFound($"Item with ID {id} not found");

                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get item by SKU
        /// </summary>
        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<ItemDto>> GetItemBySKU(string sku)
        {
            try
            {
                var item = await _itemService.GetItemBySKUAsync(sku);
                if (item == null)
                    return NotFound($"Item with SKU {sku} not found");

                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get items by category
        /// </summary>
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsByCategory(int categoryId)
        {
            try
            {
                var items = await _itemService.GetItemsByCategoryAsync(categoryId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get items by subcategory
        /// </summary>
        [HttpGet("subcategory/{subCategoryId}")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsBySubCategory(int subCategoryId)
        {
            try
            {
                var items = await _itemService.GetItemsBySubCategoryAsync(subCategoryId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get low stock items
        /// </summary>
        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetLowStockItems()
        {
            try
            {
                var items = await _itemService.GetLowStockItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get items needing reorder
        /// </summary>
        [HttpGet("needs-reorder")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItemsNeedingReorder()
        {
            try
            {
                var items = await _itemService.GetItemsNeedingReorderAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Create new item
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ItemDto>> CreateItem([FromBody] CreateItemDto createItemDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var item = await _itemService.CreateItemAsync(createItemDto);
                return CreatedAtAction(nameof(GetItemById), new { id = item.Id }, item);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Update item
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ItemDto>> UpdateItem(int id, [FromBody] UpdateItemDto updateItemDto)
        {
            try
            {
                if (id != updateItemDto.Id)
                    return BadRequest("ID mismatch");

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var item = await _itemService.UpdateItemAsync(updateItemDto);
                return Ok(item);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Delete item (soft delete)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteItem(int id)
        {
            try
            {
                var result = await _itemService.DeleteItemAsync(id);
                if (!result)
                    return NotFound($"Item with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Check if SKU exists
        /// </summary>
        [HttpGet("check-sku/{sku}")]
        public async Task<ActionResult<bool>> CheckSKUExists(string sku, [FromQuery] int? excludeItemId = null)
        {
            try
            {
                var exists = await _itemService.SKUExistsAsync(sku, excludeItemId);
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}