using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GoodPills.Data;
using GoodPills.Models.DTOs;
using GoodPills.Models.Entities;

namespace GoodPills.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- Register ---
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<CustomerReadDto>> Register([FromBody] CustomerRegisterDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var emailExists = await _context.Customers.AnyAsync(c => c.Email == dto.Email);
            if (emailExists) return Conflict("Email is already registered.");

            var customer = new Customer
            {
                Fullname = dto.Fullname,
                Email = dto.Email,
                Age = dto.Age,
                PhoneNumber = dto.PhoneNumber,
                City = dto.City,
                Address = dto.Address,
                Role = "Customer",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMe), null, ToReadDto(customer));
        }

        // --- Προφίλ τρέχοντος χρήστη ---
        [Authorize(Roles = "Customer,Admin")]
        [HttpGet("me")]
        public async Task<ActionResult<CustomerReadDto>> GetMe()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var id)) return Unauthorized();

            var customer = await _context.Customers.FindAsync(id);
            if (customer is null) return NotFound();

            return Ok(ToReadDto(customer));
        }

        // --- ΜΟΝΟ αλλαγή κωδικού από τον ίδιο τον χρήστη ---
        [Authorize(Roles = "Customer,Admin")]
        [HttpPut("me/password")]
        public async Task<IActionResult> ChangeMyPassword([FromBody] CustomerUpdateDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (dto.NewPassword != dto.ConfirmNewPassword)
                return BadRequest("NewPassword and ConfirmNewPassword do not match.");

            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var id)) return Unauthorized();

            var user = await _context.Customers.FindAsync(id);
            if (user is null) return NotFound();

            // Επιβεβαίωση παλιού κωδικού
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest("Current password is incorrect.");

            // Προαιρετικό: απόφυγε ίδιο κωδικό
            if (BCrypt.Net.BCrypt.Verify(dto.NewPassword, user.PasswordHash))
                return BadRequest("New password must be different from the current password.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword /*, workFactor: 12 */);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // --- Admin: λίστα πελατών ---
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerReadDto>>> GetAll()
        {
            var list = await _context.Customers.AsNoTracking().ToListAsync();
            return Ok(list.Select(ToReadDto).ToList());
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerProfileUpdateDto dto)
        {
            // 1. Βρες το ID του χρήστη από το Token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // ή "sub" ή "id" ανάλογα το setup
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            int customerId = int.Parse(userIdClaim);

            // 2. Φέρε τον χρήστη από τη βάση
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null) return NotFound("User not found.");

            // 3. Ενημέρωσε τα πεδία (Mapping)
            customer.Fullname = dto.Fullname;
            customer.Age = dto.Age;
            customer.PhoneNumber = dto.PhoneNumber;
            customer.City = dto.City;
            customer.Address = dto.Address;

            // 4. Αποθήκευση
            _context.Customers.Update(customer); // Προαιρετικό στο EF Core αν το αντικείμενο είναι tracked, αλλά καλό για σαφήνεια
            await _context.SaveChangesAsync();

            return Ok("Profile updated successfully.");
        }

        private static CustomerReadDto ToReadDto(Customer c) => new()
        {
            CustomerId = c.CustomerId,
            Fullname = c.Fullname,
            Email = c.Email,
            Age = c.Age,
            PhoneNumber = c.PhoneNumber,
            City = c.City,
            Address = c.Address,
            Role = c.Role
        };
    }
}
