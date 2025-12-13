using Shop.Application.Dtos.Product;

namespace Shop.Application.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<GetProductsDto>> GetProductsAsync();
        Task<GetProductDto?> GetProductByIdAsync(int id);
        Task<GetProductsDto> CreateProductAsync(CreateProductDto productDto);
        Task<int> UpdateProductAsync(UpdateProductDto productDto);
        Task<int> DeleteProductAsync(int id);
    }
}
