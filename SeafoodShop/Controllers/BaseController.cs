using Microsoft.AspNetCore.Mvc;
using SeafoodShop.DataContext.Utils;

namespace SeafoodShop.Api.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected ActionResult<T> HandleResponse<T>(T response, int statusCode)
        {
            return statusCode switch
            {
                200 => Ok(response),
                404 => NotFound(response),
                401 => Unauthorized(response),
                _ => StatusCode(500, response)
            };
        }
    }
}
