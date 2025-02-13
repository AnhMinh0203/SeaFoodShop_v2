using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.DataContext.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public DateTime Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? FullName { get; set; }
        public bool Gender { get; set; }
        public int IdAddress { get; set; }
        public bool Status { get; set; }
        public string? Avatar { get; set; }
    }
}
