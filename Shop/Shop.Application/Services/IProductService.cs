using Shop.Application.Dtos;

namespace Shop.Application.Services
{
    public interface IProductService
    {
        public Task CreateProduct(CreateProductDto createProductDto);
    }
}
