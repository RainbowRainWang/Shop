using Microsoft.EntityFrameworkCore;
using Shop.Application.Dtos.Product;
using Shop.Database;
using Shop.Domain.Entities;

namespace Shop.Application.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly ShopDbContext _context;

        public ProductService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GetProductDto>> GetProductsAsync()
        {
            return await _context.Products
                .Select(p => new GetProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Value = p.Value
                })
                .ToListAsync();
        }

        public async Task<GetProductDto?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new GetProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Value = p.Value
                })
                .FirstOrDefaultAsync();
        }

        public async Task<int> CreateProductAsync(CreateProductDto productDto)
        {
            _context.Products.Add(new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Value = productDto.Value
            });
            return await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateProductAsync(UpdateProductDto productDto)
        {
            int result = -1;
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productDto.Id);

            if (product != null)
            {
                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Value = productDto.Value;
                _context.Products.Update(product);
                result = await _context.SaveChangesAsync();
            }

            return result;
        }

        public async Task<int> DeleteProductAsync(int id)
        {
            int result = -1;
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product != null)
            {
                _context.Products.Remove(product);
                result = await _context.SaveChangesAsync();
            }

            return result;
        }
    }
}
