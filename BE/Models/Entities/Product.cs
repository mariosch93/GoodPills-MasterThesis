namespace GoodPills.Models.Entities
{
    public class Product
    {
        public int ProductId { get; set; }
        public required string Category { get; set; }
        public required string Subcategory { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public int Rating { get; set; }
        public required int Quantity { get; set; }
        public required float Price { get; set; }

        // ⬇️ Αποθηκεύουμε το base64 (μπορεί να είναι data URL ή “σκέτο” base64)
        public string? ImageBase64 { get; set; }

        public ICollection<OrderProduct> OrderProducts { get; set; } = new List<OrderProduct>();
    }
}



