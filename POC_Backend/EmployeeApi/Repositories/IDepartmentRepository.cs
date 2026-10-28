using System;
using EmployeeApi.Models;

namespace EmployeeApi.Repositories;

public interface IDepartmentRepository
{
    
    Task<List<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(int id);
    Task AddAsync(Department employee);
    Task UpdateAsync(Department department);
    Task DeleteAsync(Department department);
    Task<bool> DepartmentExistsAsync(string name);

}
