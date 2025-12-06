using Microsoft.AspNetCore.Mvc;
using Shop.Application.Dtos;
using Shop.Application.Services;
using System.Threading.Tasks;

namespace Shop.UI.Areas.Admin.Controllers
{
    public class ProductController : AdminBaseController
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateProductDto createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return View(createProductDto);
            }

            await _productService.CreateProduct(createProductDto);
            return RedirectToAction("Index");
        }
    }
}
