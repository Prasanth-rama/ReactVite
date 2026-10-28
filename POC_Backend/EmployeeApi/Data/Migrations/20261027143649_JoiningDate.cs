using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class JoiningDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Leaves",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.Sql("ALTER TABLE [Employees] ALTER COLUMN [JoiningDate] DATE");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Leaves");
        }
    }
}
