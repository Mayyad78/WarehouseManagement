using Microsoft.EntityFrameworkCore;
using WarehouseManagement.Data;
using WarehouseManagement.Interfaces;
using WarehouseManagement.Models;

namespace WarehouseManagement.Repositories
{
    public class SubCategoryRepository : ISubCategoryRepository
    {
        private readonly WarehouseDbContext _context;

        public SubCategoryRepository(WarehouseDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SubCategory>> GetAllAsync()
        {
            return await _context.SubCategories
                .Include(sc => sc.Category)
                .Where(sc => sc.IsActive)
                .OrderBy(sc => sc.Category.Name)
                .ThenBy(sc => sc.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<SubCategory>> GetByCategoryIdAsync(int categoryId)
        {
            return await _context.SubCategories
                .Include(sc => sc.Category)
                .Where(sc => sc.CategoryId == categoryId && sc.IsActive)
                .OrderBy(sc => sc.Name)
                .ToListAsync();
        }

        public async Task<SubCategory?> GetByIdAsync(int id)
        {
            return await _context.SubCategories
                .Include(sc => sc.Category)
                .FirstOrDefaultAsync(sc => sc.Id == id);
        }

        public async Task<SubCategory> CreateAsync(SubCategory subCategory)
        {
            subCategory.CreatedAt = DateTime.UtcNow;
            _context.SubCategories.Add(subCategory);
            await _context.SaveChangesAsync();
            return subCategory;
        }

        public async Task<SubCategory?> UpdateAsync(SubCategory subCategory)
        {
            var existingSubCategory = await _context.SubCategories.FindAsync(subCategory.Id);
            if (existingSubCategory == null)
                return null;

            existingSubCategory.Name = subCategory.Name;
            existingSubCategory.Description = subCategory.Description;
            existingSubCategory.CategoryId = subCategory.CategoryId;
            existingSubCategory.IsActive = subCategory.IsActive;
            existingSubCategory.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingSubCategory;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var subCategory = await _context.SubCategories.FindAsync(id);
            if (subCategory == null)
                return false;

            // Soft delete
            subCategory.IsActive = false;
            subCategory.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SubCategories.AnyAsync(sc => sc.Id == id);
        }

        public async Task<bool> ExistsByNameInCategoryAsync(string name, int categoryId, int? excludeId = null)
        {
            var query = _context.SubCategories
                .Where(sc => sc.Name.ToLower() == name.ToLower() && sc.CategoryId == categoryId);

            if (excludeId.HasValue)
            {
                query = query.Where(sc => sc.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }
    }
}
