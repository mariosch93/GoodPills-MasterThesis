using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GoodPills.Migrations
{
    /// <inheritdoc />
    public partial class AlignPasswordHashAndEmailIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Μετονομασία στήλης Password -> PasswordHash (κρατάει υπάρχοντα δεδομένα)
            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Customers",
                newName: "PasswordHash");

            // Unique index στο Email (αν δεν υπάρχει ήδη)
            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customers_Email",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Customers",
                newName: "Password");
        }
    }
}
