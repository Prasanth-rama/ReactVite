using System;

namespace EmployeeApi.DTOs;

public class EmployeeFilterRequestDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? DepartmentName { get; set; }      // 0 = no filter
    public string? ManagerName { get; set; }         // 0 = no filter
    public string? EmploymentType { get; set; }
    public string? OnboardingStatus { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;


}
