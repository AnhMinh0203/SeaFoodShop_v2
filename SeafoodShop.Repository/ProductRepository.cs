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

namespace SeafoodShop.Repository
{
    public class ProductRepository: IProductRepository
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public ProductRepository(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;

        }

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
                    IdType = productDto.IdType,
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
                throw new Exception($"Error: {ex.Message}");
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
                throw new Exception($"Error: {ex.Message}");
            }
        }
    }
}
