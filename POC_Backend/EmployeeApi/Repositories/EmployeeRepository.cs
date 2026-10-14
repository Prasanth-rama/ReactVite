// Repositories/EmployeeRepository.cs
using EmployeeApi.Data;
using EmployeeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class EmployeeRepository(AppDbContext db) : IEmployeeRepository
{
    private readonly AppDbContext _db = db;

    public Task<List<Employee>> GetAllAsync() =>
        _db.Employees.AsNoTracking().OrderByDescending(e => e.JoiningDate)
        .ThenBy(e => e.FullName).ToListAsync();

    public Task<Employee?> GetByIdAsync(int id) =>
        _db.Employees.FirstOrDefaultAsync(e => e.Id == id);

    public Task<bool> EmailExistsAsync(string email, int? excludeId = null) =>
        _db.Employees.AnyAsync(e => e.Email == email && (excludeId == null || e.Id != excludeId));

    public async Task AddAsync(Employee employee)
    {
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Employee employee)
    {
        // employee was loaded via GetByIdAsync, so EF is already tracking its changes
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Employee employee)
    {
        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();
    }
}