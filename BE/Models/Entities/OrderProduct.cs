namespace GoodPills.Models.Entities
{
    public class OrderProduct
    {
        // Τα υπάρχοντα κλειδιά
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        // --- ΝΕΑ ΠΡΟΣΘΗΚΗ ---
        public int Quantity { get; set; } = 1; // Default 1
    }
}

