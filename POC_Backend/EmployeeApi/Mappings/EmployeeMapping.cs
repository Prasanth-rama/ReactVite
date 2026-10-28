// Mappings/EmployeeMappings.cs
using EmployeeApi.DTOs;
using EmployeeApi.Models;

namespace EmployeeApi.Mappings;

public  static class EmployeeMappings
{
    // Entity -> Response DTO
    public static  EmployeeResponseDto ToResponse(this Employee e) => new()
    {
        Id = e.Id,
        FullName = e.FullName,
        Email = e.Email,
        Role = e.Role,
        DepartmentId = e.DepartmentId,
        EmploymentType = e.EmploymentType,
        JoiningDate = e.JoiningDate,
        OnboardingStatus = e.OnboardingStatus,
        Status = e.Status,
        DepartmentName=e.Department?.Name,
        ManagerId=e.ManagerId,
        ManagerName=e.Manager?.FullName,
        AnnualLeavesTaken=e.AnnualLeavesTaken
        
        
    };

    // Request DTO -> new Entity (for create)
    public static Employee ToEntity(this EmployeeRequestDto d)
    {
        return new()
        {
            FullName = d.FullName,
            Email = d.Email,
            Role = d.Role,
            DepartmentId = d.DepartmentId,
            EmploymentType = d.EmploymentType,
            JoiningDate = d.JoiningDate!.Value,
            OnboardingStatus = d.OnboardingStatus,
            Status = d.Status,
            CreatedAt = DateTime.UtcNow,
            ManagerId = d.ManagerId > 0?d.ManagerId:null
        };
    }

    // Request DTO -> existing Entity (for update)
    public static void UpdateFrom(this Employee e, EmployeeRequestDto d)
    {
        e.FullName = d.FullName;
        e.Email = d.Email;
        e.Role = d.Role;
        e.DepartmentId = d.DepartmentId;
        e.EmploymentType = d.EmploymentType;
        e.JoiningDate = d.JoiningDate!.Value;
        e.OnboardingStatus = d.OnboardingStatus;
        e.Status = d.Status;
        e.UpdatedAt=DateTime.UtcNow;
        e.ManagerId=d.ManagerId;
        e.AnnualLeavesTaken=d.AnnualLeavesTaken;
    }
}