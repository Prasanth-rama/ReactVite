using System;
using System.ComponentModel.DataAnnotations;
namespace EmployeeApi.DTOs;

public class DepartmentRequestDto
{
    [Required]
    public string? DepartmentName{get;set;}
}
