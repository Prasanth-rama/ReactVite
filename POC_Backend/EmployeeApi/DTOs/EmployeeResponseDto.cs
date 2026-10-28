using System;

namespace EmployeeApi.DTOs;

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? DepartmentName { get; set; } = string.Empty;

    public int DepartmentId{get;set;}
    public string EmploymentType { get; set; } = string.Empty;
    public DateOnly JoiningDate { get; set; }
    public string OnboardingStatus { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public string? ManagerName {get;set;}

    public int AnnualLeavesTaken{get;set;}

    public int? ManagerId{get;set;}
}
