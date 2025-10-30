using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GoodPills.Migrations
{
    /// <inheritdoc />
    public partial class UseBase64ForProductImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Products",
                newName: "ImageBase64");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageBase64",
                table: "Products",
                newName: "ImageUrl");
        }
    }
}
