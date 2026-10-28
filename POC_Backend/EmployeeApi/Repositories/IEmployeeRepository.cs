using System;
using EmployeeApi.DTOs;
using EmployeeApi.Models;
using static EmployeeApi.DTOs.EmployeeFilterRequestDto;

namespace EmployeeApi.Repositories;

public interface IEmployeeRepository
{
    Task<List<Employee>> GetAllWithDetailsAsync();
    Task<Employee?> GetByIdWithDetailsAsync(int id);
    Task<bool> EmailExistsAsync(string email, int? excludeId = null);
    Task AddAsync(Employee employee);
    Task UpdateAsync(Employee employee);
    Task DeleteAsync(Employee employee);
    Task<bool> EmployeeExistsAsync(int id);
     Task<EmployeeSummaryDto> GetSummaryAsync();
    Task<List<ManagerDto>> GetManagersByDepartment(int depId);

     Task<(List<EmployeeResponseDto> Items, int TotalCount)> GetEmployeesAsync(EmployeeFilterRequestDto f);
   
}
