using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GoodPills.Data;
using GoodPills.Models.DTOs;
using GoodPills.Models.Entities;

namespace GoodPills.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersController(ApplicationDbContext context) => _context = context;

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderProducts).ThenInclude(op => op.Product)
                .Include(o => o.Customer)
                .AsNoTracking()
                .ToListAsync();

            return orders.Select(ToDto).ToList();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{orderId:int}")]
        public async Task<IActionResult> Delete(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderProducts)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) return NotFound();

            _context.OrderProducts.RemoveRange(order.OrderProducts);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<OrderReadDto>> Create([FromBody] CreateOrderDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var customerId)) return Forbid();

            var products = await _context.Products
                .Where(p => dto.ProductIds.Contains(p.ProductId))
                .ToListAsync();

            if (products.Count != dto.ProductIds.Distinct().Count())
                return BadRequest("One or more products not found");

            foreach (var p in products)
            {
                if (p.Quantity <= 0)
                    return BadRequest($"Product {p.Title} out of stock");
            }

            float total = 0;
            foreach (var p in products)
            {
                total += p.Price;
                p.Quantity -= 1;
            }

            var order = new Order
            {
                CustomerId = customerId,
                ShippingMethod = dto.ShippingMethod,
                PaymentMethod = dto.PaymentMethod,
                TotalCost = total,
                OrderProducts = dto.ProductIds.Select(id => new OrderProduct { ProductId = id }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            order = await _context.Orders
                .Include(o => o.OrderProducts).ThenInclude(op => op.Product)
                .FirstAsync(o => o.OrderId == order.OrderId);

            return CreatedAtAction(nameof(GetMy), new { }, ToDto(order));
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetMy()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var customerId)) return Forbid();

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderProducts).ThenInclude(op => op.Product)
                .AsNoTracking()
                .ToListAsync();

            return orders.Select(ToDto).ToList();
        }

        private static OrderReadDto ToDto(Order o) => new()
        {
            OrderId = o.OrderId,
            CustomerId = o.CustomerId,
            PaymentMethod = o.PaymentMethod,
            ShippingMethod = o.ShippingMethod,
            TotalCost = o.TotalCost,
            Products = o.OrderProducts.Select(op => new ProductReadDto
            {
                ProductId = op.ProductId,
                Category = op.Product.Category,
                Subcategory = op.Product.Subcategory,
                Title = op.Product.Title,
                Description = op.Product.Description,
                Rating = op.Product.Rating,
                Quantity = op.Product.Quantity,
                Price = op.Product.Price,
                Base64Image = op.Product.ImageBase64 // ⬅️ επιστρέφουμε base64
            }).ToList()
        };
    }
}
