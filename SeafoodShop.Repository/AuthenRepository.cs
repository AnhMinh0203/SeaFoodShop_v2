using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SeafoodShop.DataContext.Database;
using SeafoodShop.DataContext.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using SeafoodShop.DataContext.Models;
using SeafoodShop.Repository.Common;

namespace SeafoodShop.Repository
{
    public class AuthenRepository : IAuthenRepository
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthenRepository(IConfiguration configuration, AppDbContext appDbContext)
        {
            _configuration = configuration;
            _context = appDbContext;
        }

        #region Login 
        public async Task<AuthenResponse> LoginAsync(SignInModel signInModel)
        {
            if (signInModel == null ||
                string.IsNullOrWhiteSpace(signInModel.Identifier) ||
                string.IsNullOrWhiteSpace(signInModel.Password))
            {
                return new AuthenResponse
                {
                    Message = "Vui lòng nhập đủ thông tin",
                    Status = 400
                };
            }
            try
            {
                UserInfor? userInfor = new UserInfor();

                if (Regex.IsMatch(signInModel.Identifier, @"^\d+$"))
                {
                    userInfor = await _context.Users
                        .Where(u => u.PhoneNumber == signInModel.Identifier)
                        .Select(u => new UserInfor
                        {
                            UserId = u.Id,
                            FullName = u.FullName ,
                            Identifier = u.PhoneNumber ,
                            Password = u.Password ,
                            CreatedDate = DateTime.UtcNow,
                        })
                        .FirstOrDefaultAsync();
                }
                else
                {
                    userInfor = await _context.Users
                        .Where(u => u.Email == signInModel.Identifier)
                        .Select(u => new UserInfor
                        {
                            UserId = u.Id,
                            FullName = u.FullName ,
                            Identifier =  u.Email ,
                            Password = u.Password ,
                            CreatedDate = DateTime.UtcNow,
                        })
                        .FirstOrDefaultAsync();

                }

                if (userInfor == null)
                {
                    return new AuthenResponse
                    {
                        Message = "Người dùng không tồn tại.",
                        Status = 404
                    };
                }

                // Check pass
                if (!BCrypt.Net.BCrypt.Verify(signInModel.Password, userInfor.Password))
                {
                    return new AuthenResponse
                    {
                        Message = "Mật khẩu chưa đúng",
                        Token = null,
                        Status = 401
                    };
                }

                var tokenRespon = new TokenRespon(_configuration);
                var token = tokenRespon.GenerateJwtToken(userInfor, userInfor.UserId);
                return new AuthenResponse
                {
                    Message = "Login Successfully",
                    Token = token,
                    Status = 200
                };
            }
            catch (Exception ex)
            {
                return new AuthenResponse
                {
                    Message = $"SQL Error: {ex.Message}",
                    Token = null,
                    Status = 500
                };
            }
        }
        #endregion

        #region Register
        #endregion
    }
}
