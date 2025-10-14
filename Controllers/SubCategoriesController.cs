using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Interfaces;
using WarehouseManagement.Models;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoriesController : ControllerBase
    {
        private readonly ISubCategoryService _subCategoryService;

        public SubCategoriesController(ISubCategoryService subCategoryService)
        {
            _subCategoryService = subCategoryService;
        }

        /// <summary>
        /// Get all active subcategories
        /// </summary>
        /// <returns>List of subcategories</returns>
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin,Manager,Staff")]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategories()
        {
            try
            {
                var subCategories = await _subCategoryService.GetAllSubCategoriesAsync();
                return Ok(subCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get subcategories by category ID
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <returns>List of subcategories for the specified category</returns>
        [HttpGet("by-category/{categoryId}")]
        [Authorize(Roles = "SuperAdmin,Admin,Manager,Staff")]
        public async Task<ActionResult<IEnumerable<SubCategory>>> GetSubCategoriesByCategory(int categoryId)
        {
            try
            {
                var subCategories = await _subCategoryService.GetSubCategoriesByCategoryIdAsync(categoryId);
                return Ok(subCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Get a specific subcategory by ID
        /// </summary>
        /// <param name="id">SubCategory ID</param>
        /// <returns>SubCategory details</returns>
        [HttpGet("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin,Manager,Staff")]
        public async Task<ActionResult<SubCategory>> GetSubCategory(int id)
        {
            try
            {
                var subCategory = await _subCategoryService.GetSubCategoryByIdAsync(id);
                
                if (subCategory == null)
                {
                    return NotFound($"SubCategory with ID {id} not found");
                }

                return Ok(subCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Create a new subcategory
        /// </summary>
        /// <param name="subCategoryDto">SubCategory details</param>
        /// <returns>Created subcategory</returns>
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<ActionResult<SubCategory>> CreateSubCategory(SubCategoryDto subCategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subCategory = new SubCategory
                {
                    Name = subCategoryDto.Name,
                    Description = subCategoryDto.Description,
                    CategoryId = subCategoryDto.CategoryId,
                    IsActive = subCategoryDto.IsActive
                };

                var createdSubCategory = await _subCategoryService.CreateSubCategoryAsync(subCategory);
                return CreatedAtAction(nameof(GetSubCategory), new { id = createdSubCategory.Id }, createdSubCategory);
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
        /// Update an existing subcategory
        /// </summary>
        /// <param name="id">SubCategory ID</param>
        /// <param name="subCategoryDto">Updated subcategory details</param>
        /// <returns>Updated subcategory</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<ActionResult<SubCategory>> UpdateSubCategory(int id, SubCategoryDto subCategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subCategory = new SubCategory
                {
                    Id = id,
                    Name = subCategoryDto.Name,
                    Description = subCategoryDto.Description,
                    CategoryId = subCategoryDto.CategoryId,
                    IsActive = subCategoryDto.IsActive
                };

                var updatedSubCategory = await _subCategoryService.UpdateSubCategoryAsync(subCategory);
                
                if (updatedSubCategory == null)
                {
                    return NotFound($"SubCategory with ID {id} not found");
                }

                return Ok(updatedSubCategory);
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
        /// Delete a subcategory (soft delete)
        /// </summary>
        /// <param name="id">SubCategory ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<ActionResult> DeleteSubCategory(int id)
        {
            try
            {
                var result = await _subCategoryService.DeleteSubCategoryAsync(id);
                
                if (!result)
                {
                    return NotFound($"SubCategory with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// Check if a subcategory exists
        /// </summary>
        /// <param name="id">SubCategory ID</param>
        /// <returns>Existence status</returns>
        [HttpHead("{id}")]
        [Authorize(Roles = "SuperAdmin,Admin,Manager,Staff")]
        public async Task<ActionResult> SubCategoryExists(int id)
        {
            try
            {
                var exists = await _subCategoryService.SubCategoryExistsAsync(id);
                
                if (!exists)
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
