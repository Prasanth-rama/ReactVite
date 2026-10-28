using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.DTOs;

public class LeaveRequestDto
{
    public int EmployeeId { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    [StringLength(500)]
    public string? Comments { get; set; }
    [RegularExpression("^(Pending|Approved|Rejected|Cancelled)$",
        ErrorMessage = "Status must be Pending, Approved, Rejected or Cancelled.")]
    public string Status { get; set; } = string.Empty;

    public int Deleted{get;set;}

}
