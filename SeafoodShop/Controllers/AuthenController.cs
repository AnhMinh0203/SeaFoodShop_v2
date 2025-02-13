using Microsoft.AspNetCore.Mvc;
using SeafoodShop.DataContext.Utils;
using SeafoodShop.Repository.Common;

namespace SeafoodShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenController : BaseController
    {
        IAuthenRepository _authenRepository;
        IConfiguration _configuration;
        public AuthenController(IAuthenRepository authenRepository, IConfiguration configuration)
        {
            _authenRepository = authenRepository;
            _configuration = configuration;
        }

        [HttpPost("Login")]
        public async Task<ActionResult<AuthenResponse>> Login(SignInModel signInModel)
        {
            var response = await _authenRepository.LoginAsync(signInModel);
            /*return HandleResponse(response, response.Status ?? 500);*/
            return Ok(response);

        }
    }
}
