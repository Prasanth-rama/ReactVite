using System;


namespace EmployeeApi.DTOs;

public class LeaveResponseDto
{

    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public int NoOfDays { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Comments { get; set; }

}
