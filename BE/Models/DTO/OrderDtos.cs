using System.ComponentModel.DataAnnotations;

namespace GoodPills.Models.DTOs
{
    public class CreateOrderDto
    {
        public required List<int> ProductIds { get; set; }
        public required string ShippingMethod { get; set; }
        public required string PaymentMethod { get; set; }
    }

    public class OrderReadDto
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public required string ShippingMethod { get; set; }
        public required string PaymentMethod { get; set; }
        public float TotalCost { get; set; }
        public required List<ProductReadDto> Products { get; set; }
    }
}



