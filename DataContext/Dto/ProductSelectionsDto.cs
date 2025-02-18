using SeafoodShop.DataContext.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.DataContext.Dto
{
    public class ProductSelectionsDto
    {
        public List<Voucher> Vouchers { get; set; }
        public List <Category> Categories { get; set; }
    }
}
