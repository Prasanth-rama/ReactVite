using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.Models;

public class Department
{
    [Required]
    public int Id {get;set;}
    [Required]
    public string? Name{get;set;}
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();

}
