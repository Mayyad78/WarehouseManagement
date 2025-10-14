using WarehouseManagement.Models;

namespace WarehouseManagement.Interfaces
{
    public interface ISubCategoryRepository
    {
        Task<IEnumerable<SubCategory>> GetAllAsync();
        Task<IEnumerable<SubCategory>> GetByCategoryIdAsync(int categoryId);
        Task<SubCategory?> GetByIdAsync(int id);
        Task<SubCategory> CreateAsync(SubCategory subCategory);
        Task<SubCategory?> UpdateAsync(SubCategory subCategory);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsByNameInCategoryAsync(string name, int categoryId, int? excludeId = null);
    }
}
