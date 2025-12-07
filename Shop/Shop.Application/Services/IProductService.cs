using Shop.Application.Dtos;

namespace Shop.Application.Services
{
    public interface IProductService
    {
        Task CreateProduct(CreateProductDto productDto);
        Task<IEnumerable<GetProductDto>> GetProducts();
    }
}
