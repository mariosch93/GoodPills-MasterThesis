using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using GoodPills.Models.Entities;

namespace GoodPills.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAdminAsync(IServiceProvider services, IConfiguration config)
        {
            using var scope = services.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await ctx.Database.MigrateAsync();

            var email = config["Admin:Email"];
            var pwd = config["Admin:Password"];
            var fullname = config["Admin:Fullname"] ?? "Administrator";
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(pwd)) return;

            var exists = await ctx.Customers.AnyAsync(x => x.Email == email);
            if (exists) return;

            var admin = new Customer
            {
                Fullname = fullname,
                Email = email,
                Age = 32,
                PhoneNumber = "2104142000",
                City = "Piraeus",
                Address = "Karaoli & Dimitriou 80",
                Role = "Admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(pwd)
            };

            ctx.Customers.Add(admin);
            await ctx.SaveChangesAsync();
        }
    }
}

