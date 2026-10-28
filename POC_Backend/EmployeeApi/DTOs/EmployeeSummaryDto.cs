using System;

namespace EmployeeApi.DTOs;

public class EmployeeSummaryDto
{
    public int TotalEmployees { get; set; }
    public Dictionary<string, int> ByDepartment { get; set; } = new();
    public Dictionary<string, int> ByEmploymentType { get; set; } = new();
    public Dictionary<string, int> ByOnboardingStatus { get; set; } = new();
    public Dictionary<string, int> ByStatus { get; set; } = new();
    public int EmployeeeThisMonth{get;set;}

    public int PendingLeaveRequests {get;set;}

    public List<EmployeeResponseDto>? EmployeesOnLeaveThisWeek{get;set;}
}
