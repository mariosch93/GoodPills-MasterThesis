namespace GoodPills.Models.Entities
{
    public class Order
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = default!;

        public required string ShippingMethod { get; set; }
        public required string PaymentMethod { get; set; }
        public float TotalCost { get; set; } = 0;

        public required ICollection<OrderProduct> OrderProducts { get; set; }
    }
}

