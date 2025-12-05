using Shop.Application.Dtos;

namespace Shop.Application.Services
{
    public interface IProductService
    {
        public int CreateProduct(CreateProductDto createProductDto);
    }
}
