namespace SeafoodShop.DataContext.Utils
{
    public class UserInfor
    {
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? Identifier { get; set; }
        public string Password { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
