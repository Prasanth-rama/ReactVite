using System;
using EmployeeApi.DTOs;
using EmployeeApi.Models;

namespace EmployeeApi.Mappings;

public static class DepartmentMappings
{
    public  static DepartmentResponseDto ToResponse(this Department d) => new()
    {
       Id=d.Id,
       DepartmentName=d.Name
        
    };

    // Request DTO -> new Entity (for create)
    public static Department ToEntity(this DepartmentRequestDto d) => new()
    {
       Name=d.DepartmentName
    };

    // Request DTO -> existing Entity (for update)
    public static void UpdateFrom(this Department d, DepartmentRequestDto dr)
    {
        d.Name=dr.DepartmentName;
    }
       
        

}
