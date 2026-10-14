// Mappings/EmployeeMappings.cs
using EmployeeApi.DTOs;
using EmployeeApi.Models;

namespace EmployeeApi.Mappings;

public static class EmployeeMappings
{
    // Entity -> Response DTO
    public static EmployeeResponseDto ToResponse(this Employee e) => new()
    {
        Id = e.Id,
        FullName = e.FullName,
        Email = e.Email,
        Role = e.Role,
        Department = e.Department,
        EmploymentType = e.EmploymentType,
        JoiningDate = e.JoiningDate,
        OnboardingStatus = e.OnboardingStatus,
        Status = e.Status
    };

    // Request DTO -> new Entity (for create)
    public static Employee ToEntity(this EmployeeRequestDto d) => new()
    {
        FullName = d.FullName,
        Email = d.Email,
        Role = d.Role,
        Department = d.Department,
        EmploymentType = d.EmploymentType,
        JoiningDate = d.JoiningDate!.Value,
        OnboardingStatus = d.OnboardingStatus,
        Status = d.Status
    };

    // Request DTO -> existing Entity (for update)
    public static void UpdateFrom(this Employee e, EmployeeRequestDto d)
    {
        e.FullName = d.FullName;
        e.Email = d.Email;
        e.Role = d.Role;
        e.Department = d.Department;
        e.EmploymentType = d.EmploymentType;
        e.JoiningDate = d.JoiningDate!.Value;
        e.OnboardingStatus = d.OnboardingStatus;
        e.Status = d.Status;
    }
}