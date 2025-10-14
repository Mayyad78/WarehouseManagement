using WarehouseManagement.Interfaces;
using WarehouseManagement.Models;

namespace WarehouseManagement.Services
{
    public class SubCategoryService : ISubCategoryService
    {
        private readonly ISubCategoryRepository _subCategoryRepository;
        private readonly ICategoryRepository _categoryRepository;

        public SubCategoryService(ISubCategoryRepository subCategoryRepository, ICategoryRepository categoryRepository)
        {
            _subCategoryRepository = subCategoryRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<SubCategory>> GetAllSubCategoriesAsync()
        {
            return await _subCategoryRepository.GetAllAsync();
        }

        public async Task<IEnumerable<SubCategory>> GetSubCategoriesByCategoryIdAsync(int categoryId)
        {
            return await _subCategoryRepository.GetByCategoryIdAsync(categoryId);
        }

        public async Task<SubCategory?> GetSubCategoryByIdAsync(int id)
        {
            return await _subCategoryRepository.GetByIdAsync(id);
        }

        public async Task<SubCategory> CreateSubCategoryAsync(SubCategory subCategory)
        {
            // Validate that the parent category exists and is active
            var category = await _categoryRepository.GetByIdAsync(subCategory.CategoryId);
            if (category == null || !category.IsActive)
            {
                throw new ArgumentException("Invalid or inactive category specified.");
            }

            // Check if subcategory name already exists in this category
            if (await _subCategoryRepository.ExistsByNameInCategoryAsync(subCategory.Name, subCategory.CategoryId))
            {
                throw new ArgumentException($"A subcategory with the name '{subCategory.Name}' already exists in this category.");
            }

            return await _subCategoryRepository.CreateAsync(subCategory);
        }

        public async Task<SubCategory?> UpdateSubCategoryAsync(SubCategory subCategory)
        {
            // Validate that the parent category exists and is active
            var category = await _categoryRepository.GetByIdAsync(subCategory.CategoryId);
            if (category == null || !category.IsActive)
            {
                throw new ArgumentException("Invalid or inactive category specified.");
            }

            // Check if subcategory name already exists in this category (excluding current subcategory)
            if (await _subCategoryRepository.ExistsByNameInCategoryAsync(subCategory.Name, subCategory.CategoryId, subCategory.Id))
            {
                throw new ArgumentException($"A subcategory with the name '{subCategory.Name}' already exists in this category.");
            }

            return await _subCategoryRepository.UpdateAsync(subCategory);
        }

        public async Task<bool> DeleteSubCategoryAsync(int id)
        {
            return await _subCategoryRepository.DeleteAsync(id);
        }

        public async Task<bool> SubCategoryExistsAsync(int id)
        {
            return await _subCategoryRepository.ExistsAsync(id);
        }

        public async Task<bool> SubCategoryNameExistsInCategoryAsync(string name, int categoryId, int? excludeId = null)
        {
            return await _subCategoryRepository.ExistsByNameInCategoryAsync(name, categoryId, excludeId);
        }
    }
}
