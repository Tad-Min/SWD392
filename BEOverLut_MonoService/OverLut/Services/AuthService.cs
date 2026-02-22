

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessObject.OverlutEntiy;
using DTOs.Appsettings;
using DTOs.Overlut;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository iUserRepository;
        private readonly IRefreshTokenRepository iRefreshTokenRepository;
        private readonly JWTAuth authSettings;
        private readonly UserSettings userSettings;

        public AuthService(IUserRepository iUserRepository,
            IRefreshTokenRepository iRefreshTokenRepository,
            IOptions<JWTAuth> authSettings,
            IOptions<UserSettings> userSettings)
        {
            this.iUserRepository = iUserRepository;
            this.iRefreshTokenRepository = iRefreshTokenRepository;
            this.authSettings = authSettings.Value;
            this.userSettings = userSettings.Value;
        }

        #region Logout & Register
        public async Task<bool> LogoutAsync(int userId, string token)
        {
            var RToken = await iRefreshTokenRepository.GetRefreshTokenByUserIdAndToken(userId, token);
            return await iRefreshTokenRepository.RevokeToken(RToken!);
        }
        public async Task<User?> RegisterAsync(string email, string password)
        {
            return await iUserRepository.CreateUser(new User
            {
                FullName = userSettings.UserNameDefault,
                Email = email,
                Password = password,
                RoleId = userSettings.RoleIdDefault,
            });
        }
        #endregion
        #region ResetPassword & ComfirmEmail
        public async Task<User> ResetPasswordAsync(string email)
        {
            throw new NotImplementedException();

        }
        public async Task<bool> ComfirmEmailAsync(string email, string token)
        {
            throw new NotImplementedException();

        }
        #endregion
        #region GenerateAccessToken, GenerateRefreshToken, ValidateRefreshTokenAsync
        public async Task<string?> GenerateAccessTokenAsync(UserDTO user, string refreshToken)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName??""),
                new Claim(ClaimTypes.Role, user.RoleId.ToString()),
            };
            var key = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(authSettings.Key ?? "a-string-secret-at-least-256-bits-long"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: authSettings.Issuer,
                audience: authSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(authSettings.ExpireATMinutes),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string generateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        public async Task<string> GenerateRefreshTokenAsync(UserDTO user, string? UserAngent, string? ipAddress)
        {
            var refreshToken = generateRefreshToken();

            var refreshentity = await iRefreshTokenRepository.CreateRefreshToken(new RefreshToken
            {
                UserId = user.UserId,
                Token = refreshToken,
                Ipaddress = ipAddress,
                UserAgent = UserAngent,
                ExpiredAt = DateTime.UtcNow.AddDays(authSettings.ExpireRTDays)
            });
            if (refreshentity != null)
            {
                return refreshToken;
            }
            throw new Exception("Cannot create refresh token");
        }
        public async Task<User?> ValidateRefreshTokenAsync(int userId, string refreshtoken)
        {
            var refreshToken = await iRefreshTokenRepository.GetRefreshTokenByUserIdAndToken(userId, refreshtoken);
            if (refreshToken != null && refreshToken.ExpiredAt > DateTime.UtcNow && !refreshToken.Revoked)
            {
                return await iUserRepository.GetUserById(userId);
            }
            return null;
        }
        #endregion
    }
}
