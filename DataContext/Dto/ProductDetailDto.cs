using SeafoodShop.DataContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.DataContext.Dto
{
    public class ProductDetailDto: Product
    {
        public string? PrimaryImg { get; set; }
        public List<string>? ChildrenImg { get; set; }
    }
}
