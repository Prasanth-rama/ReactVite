using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class LeavesDeleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Deleted",
                table: "Leaves",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Leaves");
        }
    }
}
