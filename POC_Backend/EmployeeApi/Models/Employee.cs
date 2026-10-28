using System;
using System.ComponentModel.DataAnnotations;
using EmployeeApi.Data.Migrations;

namespace EmployeeApi.Models;

public class Employee
{
     public int Id { get; set; }

    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Role { get; set; } = string.Empty;
    [Required] public string EmploymentType { get; set; } = string.Empty;
    [Required] public DateOnly JoiningDate { get; set; }
    [Required] public string OnboardingStatus { get; set; } = string.Empty;
    [Required] public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt{get;set;}
    public DateTime UpdatedAt {get;set;}
    public int Deleted{get;set;}    
    public int DepartmentId {get;set;}
    public Department? Department { get; set; }
    public int? ManagerId { get; set; }
    public Employee? Manager { get; set; }
    public ICollection<Employee> DirectReports { get; set; } = new List<Employee>();
    public int AnnualLeavesTaken{get;set;}

    public ICollection<Leave> LeaveDates{get;set;}=new List<Leave>();

}
