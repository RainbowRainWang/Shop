using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos.Product;
using Shop.Application.Services;
using Shop.UI.Constants;
using Shop.UI.Controllers.Admin;
using Shop.UI.Models;

namespace Shop.UI.Areas.Admin.Controllers
{
    [Route("admin/products")]
    public class ProductController : BaseController
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseModel>> GetProductsAsync()
        {
            return Success(data: await _productService.GetProductsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseModel>> GetProductAsync(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
                return Fail(Messages.DataNotFound);

            return Success(data: product);
        }

        [HttpPost]
        public async Task<ActionResult<ResponseModel>> CreateProductAsync(CreateProductDto productDto)
        {
            var result = await _productService.CreateProductAsync(productDto);

            if (result <= 0)
                return Fail();

            return Success();
        }

        [HttpPost]
        public async Task<ActionResult<ResponseModel>> UpdateProduct(UpdateProductDto productDto)
        {
           var result = await _productService.UpdateProductAsync(productDto);

            if (result <= 0)
                return Fail(Messages.DataNotFound);

            return Success();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseModel>> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductAsync(id);

            if (result <= 0)
                return Fail(Messages.DataNotFound);

            return Success();
        }
    }
}
