using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SeafoodShop.DataContext.Database;
using SeafoodShop.DataContext.Models;
using SeafoodShop.Repository.Common;
using Microsoft.AspNetCore.Hosting;
using SeafoodShop.DataContext.Dto;

namespace SeafoodShop.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public ProductRepository(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;

        }

        #region Get product selections
        public async Task<ProductSelectionsDto> GetProductSelectionsAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            var vouchers = await _context.Vouchers.ToListAsync();

            return new ProductSelectionsDto
            {
                Categories = categories,
                Vouchers = vouchers
            };
        }
        #endregion

        #region Update or add category
        public async Task<string> AddOrUpdateCategoryAsync(List<Category> categories)
        {
            foreach (var category in categories)
            {
                if (category.Id == null)
                {
                    _context.Categories.Add(category);
                }
                else
                {
                    var existingCategory = await _context.Categories.FindAsync(category.Id);
                    if (existingCategory == null)
                    {
                        return "Lỗi: Không tìm thấy loại trên";
                    }
                    existingCategory.Name = category.Name;
                }
            }
            await _context.SaveChangesAsync();
            return "Thao tác thành công!";

        }
        #endregion

        #region Delete category
        public async Task<string> DeleteCategoryAsync (string categoryName)
        {
            using (var context = _context)
            {
                var category = await context.Categories.FirstOrDefaultAsync(c => c.Name == categoryName);
                if (category == null)
                {
                    return "Lỗi: Không tìm thấy loại cần xóa";
                }
                context.Categories.Remove(category);
                await context.SaveChangesAsync();
                return "Xóa danh mục thành công";
            }
        }
        #endregion

        #region Update or add voucher
        public async Task<string> AddOrUpdateVoucherAsync(List<Voucher> vouchers)
        {
            foreach (var voucher in vouchers)
            {
                if (voucher.Id == null)
                {
                    _context.Vouchers.Add(voucher);
                }
                else
                {
                    var existingCategory = await _context.Categories.FindAsync(voucher.Id);
                    if (existingCategory == null)
                    {
                        return "Lỗi: Không tìm thấy voucher trên";
                    }
                    existingCategory.Name = voucher.NameVoucher;
                }
            }
            await _context.SaveChangesAsync();
            return "Thao tác thành công!";

        }
        #endregion

        #region Delete voucher
        public async Task<string> DeleteVoucherAsync(string categoryName)
        {
            using (var context = _context)
            {
                var voucher = await context.Vouchers.FirstOrDefaultAsync(v => v.NameVoucher == categoryName);
                if (voucher == null)
                {
                    return "Lỗi: Không tìm thấy voucher cần xóa";
                }
                context.Vouchers.Remove(voucher);
                await context.SaveChangesAsync();
                return "Xóa voucher thành công";
            }
        }
        #endregion


        #region Add product
        public async Task<string> AddProductAsync(ProductDto productDto)
        {
            try
            {
                DateTime currentTime = DateTime.UtcNow.AddHours(7);

                var product = new Product
                {
                    Name = productDto.Name,
                    Price = productDto.Price,
                    Unit = productDto.Unit,
                    IdType = productDto.IdCategory,
                    IdVoucher = productDto.IdVoucher,
                    Quantity = productDto.Quantity,
                    Instruct = productDto.Instruct,
                    Origin = productDto.Origin,
                    Description = productDto.Description,
                    CreateDate = currentTime,
                    CreateBy = productDto.CreateBy,
                    ModifyDate = currentTime,
                    ModifyBy = productDto.ModifyBy
                };

                // Thêm sản phẩm vào database
                _context.SeaFoods.Add(product);
                await _context.SaveChangesAsync();

                int newProductId = product.Id;
                var images = new List<Image>();

                var webRootPath = _env.WebRootPath;
                if (webRootPath == null)
                {
                    // Tạo thư mục wwwroot nếu không có
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var imageDirectory = Path.Combine(webRootPath, "images");
                if (!Directory.Exists(imageDirectory))
                {
                    Directory.CreateDirectory(imageDirectory);
                }

                if (productDto.PrimaryImg != null)
                {
                    var primaryImagePath = Path.Combine(imageDirectory, productDto.PrimaryImg.FileName);
                    using (var stream = new FileStream(primaryImagePath, FileMode.Create))
                    {
                        await productDto.PrimaryImg.CopyToAsync(stream);
                    }

                    images.Add(new Image
                    {
                        IdSeaFood = newProductId,
                        IsMain = true,
                        ImagePath = "/images/" + productDto.PrimaryImg.FileName, // Lưu đường dẫn URL
                        CreateDate = currentTime,
                        CreateBy = productDto.CreateBy,
                        ModifyDate = currentTime,
                        ModifyBy = productDto.ModifyBy
                    });
                }

                // Lưu ảnh phụ (ChildImg)
                if (productDto.ChildImg?.Any() == true)
                {
                    foreach (var img in productDto.ChildImg)
                    {
                        var childImagePath = Path.Combine(imageDirectory, img.FileName);
                        using (var stream = new FileStream(childImagePath, FileMode.Create))
                        {
                            await img.CopyToAsync(stream);
                        }

                        images.Add(new Image
                        {
                            IdSeaFood = newProductId,
                            IsMain = false,
                            ImagePath = "/images/" + img.FileName,
                            CreateDate = currentTime,
                            CreateBy = productDto.CreateBy,
                            ModifyDate = currentTime,
                            ModifyBy = productDto.ModifyBy
                        });
                    }
                }

                if (images.Any())
                {
                    _context.Images.AddRange(images);
                    await _context.SaveChangesAsync();
                }
                return "Thêm mới sản phẩm thành công";
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi: {ex.Message}");
            }
        }
        #endregion

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            try
            {
                return await _context.SeaFoods.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi: {ex.Message}");
            }
        }
    }
}
