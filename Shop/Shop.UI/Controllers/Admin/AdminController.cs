using Microsoft.AspNetCore.Mvc;

namespace Shop.UI.Controllers.Admin
{
    [Route("admin")]
    public class AdminController : Controller
    {
        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
