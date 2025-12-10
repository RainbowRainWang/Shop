using Shop.Application.Dtos.Product;

namespace Shop.Application.Services
{
    public interface IProductService
    {
        Task<IEnumerable<GetProductDto>> GetProductsAsync();
        Task<GetProductDto?> GetProductByIdAsync(int id);
        Task<int> CreateProductAsync(CreateProductDto productDto);
        Task<int> UpdateProductAsync(UpdateProductDto productDto);
        Task<int> DeleteProductAsync(int id);
    }
}
