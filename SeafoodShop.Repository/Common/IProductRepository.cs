using SeafoodShop.DataContext.Dto;
using SeafoodShop.DataContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.Repository.Common
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<string> AddProductAsync(ProductDto product);
        Task<ProductSelectionsDto> GetProductSelectionsAsync();
        Task<string> AddOrUpdateCategoryAsync(List<Category> categories);
        Task<string> DeleteCategoryAsync(string categoryName);
        Task<string> AddOrUpdateVoucherAsync(List<Voucher> vouchers);
        Task<string> DeleteVoucherAsync(string categoryName);

    }
}
