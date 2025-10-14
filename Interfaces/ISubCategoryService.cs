using WarehouseManagement.Models;

namespace WarehouseManagement.Interfaces
{
    public interface ISubCategoryService
    {
        Task<IEnumerable<SubCategory>> GetAllSubCategoriesAsync();
        Task<IEnumerable<SubCategory>> GetSubCategoriesByCategoryIdAsync(int categoryId);
        Task<SubCategory?> GetSubCategoryByIdAsync(int id);
        Task<SubCategory> CreateSubCategoryAsync(SubCategory subCategory);
        Task<SubCategory?> UpdateSubCategoryAsync(SubCategory subCategory);
        Task<bool> DeleteSubCategoryAsync(int id);
        Task<bool> SubCategoryExistsAsync(int id);
        Task<bool> SubCategoryNameExistsInCategoryAsync(string name, int categoryId, int? excludeId = null);
    }
}
