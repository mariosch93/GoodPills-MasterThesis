using System.ComponentModel.DataAnnotations;

namespace GoodPills.Models.DTOs
{
    public class CustomerRegisterDto
    {
        public required string Fullname { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        [Range(18, 120)] public int Age { get; set; }
        public required string PhoneNumber { get; set; }
        public required string City { get; set; }
        public required string Address { get; set; }
    }

    public class CustomerUpdateDto
    {
        [Required] public string CurrentPassword { get; set; }
        [Required, MinLength(8)] public string NewPassword { get; set; }
        [Required] public string ConfirmNewPassword { get; set; }
    }
    public class ForgotPasswordSimpleDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(8)]
        public string NewPassword { get; set; } = null!;

        [Required]
        public string ConfirmNewPassword { get; set; } = null!;
    }
    public class CustomerReadDto
    {
        public int CustomerId { get; set; }
        public required string Fullname { get; set; }
        public required string Email { get; set; }
        public int Age { get; set; }
        public required string PhoneNumber { get; set; }
        public required string City { get; set; }
        public required string Address { get; set; }
        public string? Role { get; set; }
    }

    public class LoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    // Πρόσθεσε αυτό στο CustomerDtos.cs
    public class CustomerProfileUpdateDto
    {
        [Required]
        public string Fullname { get; set; } = string.Empty;

        [Range(0, 120)]
        public int Age { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }
}

