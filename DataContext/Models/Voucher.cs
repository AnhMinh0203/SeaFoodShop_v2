using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.DataContext.Models
{
    public class Voucher
    {
        public int? Id { get; set; }
        public string NameVoucher { get; set; }
        public int Percent { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateOnly CreateDate { get; set; }
        public Guid CreateBy { get; set; }
        public DateOnly? ModifyDate { get; set; }  
        public Guid ModifyBy { get; set; }
       
    }

}
