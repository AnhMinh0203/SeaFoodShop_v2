using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SeafoodShop.DataContext.Models
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public string? Unit { get; set; }
        public int? IdType { get; set; }
        public int? IdVoucher { get; set; }
        public int? Quantity { get; set; }
        public string? Instruct { get; set; }
        public string? Origin { get; set; }
        public IFormFile? PrimaryImg { get; set; }
        public List<IFormFile> ChildImg { get; set; } = new List<IFormFile>();
        public string? Description { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreateBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string? ModifyBy { get; set; }

    }
}
