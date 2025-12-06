using Microsoft.EntityFrameworkCore;
using Shop.Application.Dtos;
using Shop.Database;
using Shop.Domain;

namespace Shop.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly ShopDbContext _context;

        public ProductService(ShopDbContext context)
        {
            _context = context;
        }

        public async Task CreateProduct(CreateProductDto createProductDto)
        {
            Product product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Value = createProductDto.Value
            };  

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }
    }
}
