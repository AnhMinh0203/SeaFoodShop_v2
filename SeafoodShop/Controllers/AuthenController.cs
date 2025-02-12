using Microsoft.AspNetCore.Mvc;

namespace SeafoodShop.Api.Controllers
{
    public class AuthenController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
