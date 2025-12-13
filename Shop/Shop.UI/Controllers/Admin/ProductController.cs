using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos.Product;
using Shop.Application.Services.Interfaces;
using Shop.UI.Constants;
using Shop.UI.Filters;

namespace Shop.UI.Areas.Admin.Controllers
{
    [Route("admin/products")]
    [TypeFilter<ApiExceptionFilter>]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: admin/products
        [HttpGet]
        public async Task<ResponseModel<IEnumerable<GetProductsDto>>> GetProductsAsync()
        {
            var products = await _productService.GetProductsAsync();
            return ResponseModel<IEnumerable<GetProductsDto>>.Success(products);
        }

        // GET: admin/products/{id}
        [HttpGet("{id}")]
        public async Task<ResponseModel<GetProductDto>> GetProductAsync([FromRoute] int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return ResponseModel<GetProductDto>.Error(Messages.DataNotFound, StatusCodes.Status404NotFound);
            }

            return ResponseModel<GetProductDto>.Success(product);
        }

        // POST: admin/products
        [HttpPost]
        public async Task<ResponseModel<GetProductsDto>> PostProductAsync([FromBody] CreateProductDto productDto)
        {
            var product = await _productService.CreateProductAsync(productDto);
            return ResponseModel<GetProductsDto>.Success(product);
        }

        // PUT: admin/products
        [HttpPut]
        public async Task<ResponseModel> PutProductAsync([FromBody] UpdateProductDto productDto)
        {
            var result = await _productService.UpdateProductAsync(productDto);

            if (result <= 0)
            {
                return ResponseModel.Error(Messages.DataNotFound, StatusCodes.Status404NotFound);
            }

            return ResponseModel.Success();
        }

        // DELETE: admin/products/{id}
        [HttpDelete("{id}")]
        public async Task<ResponseModel> DeleteProductAsync([FromRoute] int id)
        {
            var result = await _productService.DeleteProductAsync(id);

            if (result <= 0)
            {
                return ResponseModel.Error(Messages.DataNotFound, StatusCodes.Status404NotFound);
            }

            return ResponseModel.Success();
        }
    }
}
