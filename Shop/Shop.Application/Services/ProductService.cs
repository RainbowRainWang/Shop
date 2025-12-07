using Microsoft.EntityFrameworkCore;
using Shop.Application.Dtos;
using Shop.Database;
using Shop.Domain.Entities;

namespace Shop.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly ShopDbContext _context;

        public ProductService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateProduct(CreateProductDto productDto)
        {
            Product entity = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Value = productDto.Value
            };

            _context.Products.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<GetProductDto>> GetProducts()
        {
            return await _context.Products
                .Select(p => new GetProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Value = p.Value.ToString("N2") // 1100.50 => 1,100.50
                })
                .ToListAsync();
        }
    }
}
