using Microsoft.AspNetCore.Mvc;
using SeafoodShop.DataContext.Dto;
using SeafoodShop.DataContext.Models;
using SeafoodShop.DataContext.Utils;
using SeafoodShop.Repository.Common;

namespace SeafoodShop.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IProductRepository _productRepository;
        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet("Get-products")]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("Get-product-selections")]
        public async Task<ActionResult<ProductSelectionsDto>> GetProductSelections()
        {
            var productSelections = await _productRepository.GetProductSelectionsAsync();
            return Ok(new BaseResponse<ProductSelectionsDto>(true, productSelections));
        }

        [HttpPost("Add")]
        public async Task<ActionResult<string>> AddProduct ([FromForm] ProductDto productDto)
        {
            var result = await _productRepository.AddProductAsync(productDto);
            if (result.Contains("Error"))
            {
                return BadRequest(new BaseResponse<string>(false,result));
            }
            return Ok(new BaseResponse<string>(true, result));
        }
    }
}
