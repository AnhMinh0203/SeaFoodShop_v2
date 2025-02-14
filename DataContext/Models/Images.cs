using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.DataContext.Models
{
    public class Image
    {
        public int Id { get; set; }
        public int? IdSeaFood { get; set; }
        public bool? IsMain { get; set; }
        public int? IdBlog { get; set; } 
        public string ImagePath { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
        public DateTime ModifyDate { get; set; }
        public string ModifyBy { get; set; }
    }
}
