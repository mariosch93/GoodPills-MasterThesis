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

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<OrderReadDto>> Create([FromBody] CreateOrderDto dto)
        {
            // Έλεγχος ασφαλείας
            if (dto == null || dto.ProductIds == null || !dto.ProductIds.Any())
                return BadRequest("Order must contain at least one product.");

            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(idStr, out var customerId)) return Forbid();

            // 1. Ομαδοποιούμε τα IDs (π.χ. [1, 1, 1] -> {Id:1, Count:3})
            var productQuantities = dto.ProductIds
                .GroupBy(id => id)
                .ToDictionary(g => g.Key, g => g.Count());

            var uniqueIds = productQuantities.Keys.ToList();

            // 2. Φέρνουμε τα προϊόντα από τη βάση
            var products = await _context.Products
                .Where(p => uniqueIds.Contains(p.ProductId))
                .ToListAsync();

            if (products.Count != uniqueIds.Count)
                return BadRequest("One or more products not found");

            float total = 0;
            var orderProducts = new List<OrderProduct>();

            // 3. Ελέγχουμε στοκ και ετοιμάζουμε την παραγγελία
            foreach (var p in products)
            {
                int requestedQty = productQuantities[p.ProductId];

                if (p.Quantity < requestedQty)
                    return BadRequest($"Product '{p.Title}' out of stock.");

                // Μείωση Στοκ & Υπολογισμός Τιμής
                p.Quantity -= requestedQty;
                total += p.Price * requestedQty;

                // Δημιουργία ΜΙΑΣ εγγραφής με την σωστή Ποσότητα
                orderProducts.Add(new OrderProduct
                {
                    ProductId = p.ProductId,
                    Quantity = requestedQty // Αποθηκεύουμε το 5 εδώ
                });
            }

            var order = new Order
            {
                CustomerId = customerId,
                ShippingMethod = dto.ShippingMethod,
                PaymentMethod = dto.PaymentMethod,
                TotalCost = total,
                OrderProducts = orderProducts
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Επαναφόρτωση για σωστή επιστροφή
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

        // --- ΤΟ ΚΟΛΠΟ ΓΙΑ ΤΟ FRONTEND ---
        private static OrderReadDto ToDto(Order o)
        {
            // Εδώ "ξεδιπλώνουμε" την ποσότητα πίσω σε λίστα.
            // Αν η βάση λέει "Depon Qty: 3", εμείς φτιάχνουμε λίστα [Depon, Depon, Depon]
            // Έτσι το Frontend θα μετρήσει "3x Depon" χωρίς να αλλάξουμε τίποτα εκεί!

            var expandedProducts = o.OrderProducts
                .SelectMany(op => Enumerable.Repeat(new ProductReadDto
                {
                    ProductId = op.Product.ProductId,
                    Title = op.Product.Title,
                    Description = op.Product.Description,
                    Price = op.Product.Price,
                    Category = op.Product.Category,
                    Subcategory = op.Product.Subcategory,
                    Base64Image = op.Product.ImageBase64, // Σιγουρέψου ότι το πεδίο λέγεται έτσι στο Product entity
                    Rating = op.Product.Rating
                }, op.Quantity)) // Επανάληψη όσες φορές λέει το Quantity
                .ToList();

            return new OrderReadDto
            {
                OrderId = o.OrderId,
                CustomerId = o.CustomerId,
                PaymentMethod = o.PaymentMethod,
                ShippingMethod = o.ShippingMethod,
                TotalCost = o.TotalCost,
                Products = expandedProducts
            };
        }
    }
}