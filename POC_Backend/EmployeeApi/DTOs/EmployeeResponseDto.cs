using System;

namespace EmployeeApi.DTOs;

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty;
    public DateTime JoiningDate { get; set; }
    public string OnboardingStatus { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
