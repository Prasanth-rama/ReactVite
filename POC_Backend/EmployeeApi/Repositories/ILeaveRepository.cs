using System;
using EmployeeApi.DTOs;
using EmployeeApi.Models;

namespace EmployeeApi.Repositories;

public interface ILeaveRepository
{
    Task<(List<LeaveResponseDto> Items, int TotalCount)>GetAllAsync(string? employeeId, string? status = null,int page=1,int pageSize=10);
    Task<LeaveResponseDto?> GetByIdAsync(int id);
    Task<Leave> AddAsync(Leave leave);
    Task<bool> UpdateAsync(int id, Leave updated);
    Task<bool> UpdateStatusAsync(int id, string status, string? comments,int Deleted);
    Task<bool> DeleteAsync(int id);
    Task<bool> HasOverlapAsync(int employeeId, DateOnly start, DateOnly end, int? excludeLeaveId = null);

}
