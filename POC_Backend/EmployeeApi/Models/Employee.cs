using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.Models;

public class Employee
{
     public int Id { get; set; }

    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Role { get; set; } = string.Empty;

    [Required] public string Department { get; set; } = string.Empty;
    [Required] public string EmploymentType { get; set; } = string.Empty;
    [Required] public DateTime JoiningDate { get; set; }
    [Required] public string OnboardingStatus { get; set; } = string.Empty;
    [Required] public string Status { get; set; } = string.Empty;
}
