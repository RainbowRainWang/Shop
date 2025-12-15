using Microsoft.AspNetCore.Mvc;
using Shop.Application.Services.Interfaces;

namespace Shop.UI.Controllers
{
    [Route("product")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [Route("{name}")]
        public async Task<IActionResult> Index([FromRoute] string name)
        {
            var product = await _productService.GetProductStocksByNameAsync(name.Replace("-", " "));

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }
    }
}
