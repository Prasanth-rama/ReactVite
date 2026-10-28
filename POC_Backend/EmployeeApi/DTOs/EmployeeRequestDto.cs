using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs;

public class EmployeeRequestDto
{
 [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Role { get; set; } = string.Empty;

    [Required]
    public int DepartmentId { get; set; } 

    [Required]
    [AllowedValues("Full-time", "Part-time", "Intern", "Contractor",
        ErrorMessage = "Invalid employment type.")]
    public string EmploymentType { get; set; } = string.Empty;

    [Required]
    public DateOnly? JoiningDate { get; set; }

    [Required]
    [AllowedValues("Not Started", "In Progress", "Completed",
        ErrorMessage = "Invalid onboarding status.")]
    public string OnboardingStatus { get; set; } = string.Empty;

    [Required]
    [AllowedValues("Active", "Exited", "On Leave","Inactive",
        ErrorMessage = "Invalid status.")]
    public string Status { get; set; } = string.Empty;
    
    public int? ManagerId {get;set;}

    public int AnnualLeavesTaken{get;set;}
}
