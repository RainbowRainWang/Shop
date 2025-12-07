using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos;
using Shop.Application.Services;

namespace Shop.UI.Areas.Admin.Controllers
{
    public class ProductController : AdminBaseController
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        public async Task<IActionResult> Index()
        {
            var products = await _productService.GetProducts();
            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateProductDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return View(productDto);
            }

            await _productService.CreateProduct(productDto);
            return RedirectToAction("Index");
        }
    }
}
