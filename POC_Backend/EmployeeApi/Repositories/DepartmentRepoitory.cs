using System;
using EmployeeApi.Data;
using EmployeeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class DepartmentRepoitory(AppDbContext db) : IDepartmentRepository
{
    public Task AddAsync(Department department)
    {

        db.Departments.AddAsync(department);
        return db.SaveChangesAsync();
    }
    public Task<bool> DepartmentExistsAsync(string name) =>
        db.Departments.AnyAsync(d=>d.Name==name);

    public async Task DeleteAsync(Department department)
    {
        db.Departments.Remove(department);
        await db.SaveChangesAsync();
    }

    public  Task<List<Department>> GetAllAsync()
    {
         return  db.Departments.ToListAsync();
    }

    public Task<Department?> GetByIdAsync(int id)
    {
        return db.Departments.FirstOrDefaultAsync(d=>d.Id==id);
    }

    public async Task UpdateAsync(Department department)
    {
         await  db.SaveChangesAsync();
    }

   
}
