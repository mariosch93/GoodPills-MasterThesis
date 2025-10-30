using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GoodPills.Data;
using GoodPills.Models.DTOs;

namespace GoodPills.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

        public AuthController(IConfiguration config, ApplicationDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Customers.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = GenerateToken(user.CustomerId, user.Email, user.Role, user.Fullname);
            return Ok(new { token });
        }

        //[HttpPost("logout")]
        //public IActionResult Logout() => Ok(new { message = "Logged out (client must delete the token)" });

        private string GenerateToken(int customerId, string email, string role, string fullname)
        {
            // ---- JWT config: έλεγχος πριν την χρήση
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];

            if (string.IsNullOrWhiteSpace(key) ||
                string.IsNullOrWhiteSpace(issuer) ||
                string.IsNullOrWhiteSpace(audience))
            {
                throw new InvalidOperationException("Missing JWT config (Jwt:Key/Issuer/Audience).");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, customerId.ToString()),
                new Claim(ClaimTypes.Name, fullname),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var creds = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [HttpPost("forgot-password-simple")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPasswordSimple([FromBody] ForgotPasswordSimpleDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (dto.NewPassword != dto.ConfirmNewPassword)
                return BadRequest("New password and confirmation do not match.");

            // Βρίσκουμε τον χρήστη. Δεν αποκαλύπτουμε αν υπάρχει/όχι.
            var user = await _context.Customers.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user != null)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword /*, workFactor: 12 */);
                await _context.SaveChangesAsync();
            }

            // Πάντα 200 για anti-enumeration:
            return Ok(new { message = "If the e-mail exists, the password has been reset." });
        }
    }
}

