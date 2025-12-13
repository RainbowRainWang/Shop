using Microsoft.EntityFrameworkCore;
using Shop.Application.Dtos.Product;
using Shop.Application.Services.Interfaces;
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

        public async Task<IEnumerable<GetProductsDto>> GetProductsAsync()
        {
            return await _context.Products
                .AsNoTracking()
                .Select(p => new GetProductsDto
                {
                    Id= p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Value = p.Value.ToString("N2")
                })
                .ToListAsync();
        }

        public async Task<GetProductDto?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new GetProductDto
                {
                    Name = p.Name,
                    Description = p.Description,
                    Value = p.Value
                })
                .FirstOrDefaultAsync();
        }

        public async Task<GetProductsDto> CreateProductAsync(CreateProductDto productDto)
        {
            Product product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Value = productDto.Value
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return new GetProductsDto
            {
                Id= product.Id,
                Name = product.Name,
                Description = product.Description,
                Value = product.Value.ToString("N2")
            };
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
