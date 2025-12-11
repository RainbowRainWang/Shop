using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos.Product;
using Shop.Application.Services;
using Shop.UI.Constants;

namespace Shop.UI.Areas.Admin.Controllers
{
    [Route("admin/products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: admin/products
        [HttpGet]
        public async Task<ResponseModel<IEnumerable<GetProductDto>>> GetProductsAsync()
        {
            var products = await _productService.GetProductsAsync();
            return ResponseModel<IEnumerable<GetProductDto>>.Success(products);
        }

        // GET: admin/products/{id}
        [HttpGet("{id}")]
        public async Task<ResponseModel<GetProductDto>> GetProductAsync(int id)
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
        public async Task<ResponseModel> PostProductAsync(CreateProductDto productDto)
        {
            await _productService.CreateProductAsync(productDto);
            return ResponseModel.Success();
        }

        // PUT: admin/products
        [HttpPut]
        public async Task<ResponseModel> PutProductAsync(UpdateProductDto productDto)
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
        public async Task<ResponseModel> DeleteProductAsync(int id)
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
