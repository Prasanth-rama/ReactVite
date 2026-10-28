using EmployeeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Data;

public class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>()
            .HasIndex(e => e.Email)
            .IsUnique();
        // 2. Fluent API: describes how they connect
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Manager)                // needs Manager to exist
            .WithMany(e => e.DirectReports)        // needs DirectReports to exist
            .HasForeignKey(e => e.ManagerId)       // needs ManagerId to exist
            .OnDelete(DeleteBehavior.Restrict);
    }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Leave> Leaves => Set<Leave>();





}