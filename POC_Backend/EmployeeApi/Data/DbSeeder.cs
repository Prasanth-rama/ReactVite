// Data/DbSeeder.cs
using EmployeeApi.Models;

namespace EmployeeApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Employees.Any()) return;   // only seed an empty table

        var employees = new List<Employee>();
       
        db.Employees.AddRange(employees);
        db.SaveChanges();
    }
}