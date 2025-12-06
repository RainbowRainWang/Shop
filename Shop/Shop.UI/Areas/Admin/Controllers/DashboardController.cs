using Microsoft.AspNetCore.Mvc;

namespace Shop.UI.Areas.Admin.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
