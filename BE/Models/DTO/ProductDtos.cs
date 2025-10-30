using System.ComponentModel.DataAnnotations;

namespace GoodPills.Models.DTOs
{
    public class ProductCreateDto
    {
        [Required] public string Category { get; set; }
        [Required] public string Subcategory { get; set; }
        [Required] public string Title { get; set; }
        [Required] public string Description { get; set; }
        public int Rating { get; set; } = 0;
        public int Quantity { get; set; }
        public float Price { get; set; }
        public string? Base64Image { get; set; }
    }

    public class ProductUpdateDto : ProductCreateDto { }

    public class ProductReadDto
    {
        public int ProductId { get; set; }
        public required string Category { get; set; }
        public required string Subcategory { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public int Rating { get; set; }
        public int Quantity { get; set; }
        public float Price { get; set; }

        // ⬇️ Επιστρέφουμε στο Frontend το αποθηκευμένο base64
        public string? Base64Image { get; set; }
    }
}
