using System.Text.Json.Serialization;

namespace GoodPills.Models.Entities
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public required string Fullname { get; set; }
        public required string Email { get; set; }
        public required int Age { get; set; }
        public required string PhoneNumber { get; set; }
        public required string City { get; set; }
        public required string Address { get; set; }

        [JsonIgnore]                // ποτέ στο JSON
        public required string PasswordHash { get; set; }

        public required string Role { get; set; } = "Customer";
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}


