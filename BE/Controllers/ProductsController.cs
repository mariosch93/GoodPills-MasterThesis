using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using GoodPills.Data;
using GoodPills.Models.DTOs;
using GoodPills.Models.Entities;

namespace GoodPills.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ProductsController(ApplicationDbContext context) => _context = context;

        //// Προαιρετικά όριο μεγέθους (bytes) για την εικόνα
        //private const int MaxImageBytes = 5_000_000; // ~5MB

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll()
        {
            var items = await _context.Products.AsNoTracking().ToListAsync();
            return Ok(items.Select(ToReadDto).ToList());
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductReadDto>> GetById(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p is null) return NotFound();
            return Ok(ToReadDto(p));
        }

        [HttpGet("available/{id:int}")]
        public async Task<ActionResult<bool>> IsAvailable(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p is null) return NotFound();
            return Ok(p.Quantity > 0);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductReadDto>> Create([FromBody] ProductCreateDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //// (Προαιρετικός) έλεγχος μεγέθους base64
            //if (!string.IsNullOrWhiteSpace(dto.Base64Image) && !IsBase64SizeOk(dto.Base64Image, MaxImageBytes))
            //    return BadRequest("Image too large (max 5MB).");

            var p = new Product
            {
                Category = dto.Category,
                Subcategory = dto.Subcategory,
                Title = dto.Title,
                Description = dto.Description,
                Rating = dto.Rating,
                Quantity = dto.Quantity,
                Price = dto.Price,
                ImageBase64 = dto.Base64Image // αποθηκεύουμε όπως ήρθε
            };

            _context.Products.Add(p);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = p.ProductId }, ToReadDto(p));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var p = await _context.Products.FindAsync(id);
            if (p is null) return NotFound();

            //if (!string.IsNullOrWhiteSpace(dto.Base64Image) && !IsBase64SizeOk(dto.Base64Image, MaxImageBytes))
            //    return BadRequest("Image too large (max 5MB).");

            p.Category = dto.Category;
            p.Subcategory = dto.Subcategory;
            p.Title = dto.Title;
            p.Description = dto.Description;
            p.Rating = dto.Rating;
            p.Quantity = dto.Quantity;
            p.Price = dto.Price;

            // Αν δόθηκε νέα εικόνα, αντικαθιστούμε το αποθηκευμένο base64.
            if (dto.Base64Image != null)
                p.ImageBase64 = dto.Base64Image;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _context.Products.FindAsync(id);
            if (p is null) return NotFound();

            _context.Products.Remove(p);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static ProductReadDto ToReadDto(Product p) => new()
        {
            ProductId = p.ProductId,
            Category = p.Category,
            Subcategory = p.Subcategory,
            Title = p.Title,
            Description = p.Description,
            Rating = p.Rating,
            Quantity = p.Quantity,
            Price = p.Price,
            Base64Image = p.ImageBase64
        };

        // --- Helpers ---

        // Υπολογίζει περίπου το μέγεθος σε bytes του base64. Δέχεται data URL ή σκέτο base64.
        //private static bool IsBase64SizeOk(string input, int maxBytes)
        //{
        //    try
        //    {
        //        string b64 = input;
        //        var m = Regex.Match(input, @"^data:(?<mime>image\/[a-zA-Z0-9\+\-\.]+);base64,(?<data>.+)$");
        //        if (m.Success) b64 = m.Groups["data"].Value;

        //        // Απόπειρα decode (θα πετάξει αν δεν είναι έγκυρο)
        //        var bytes = Convert.FromBase64String(b64);
        //        return bytes.Length <= maxBytes;
        //    }
        //    catch
        //    {
        //        // Αν δεν είναι έγκυρο base64, θεωρούμε ότι δεν είναι ΟΚ
        //        return false;
        //    }
        //}
    }
}

