using System;
using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.Models;

public class Leave
{
    public int Id {get;set;}
    public int EmployeeId{get;set;}
      public DateTime CreatedAt{get;set;}
    public  Employee? Employee{get;set;}
     public DateOnly StartDate{get;set;}

     public DateOnly EndDate{get;set;}

     public int NoOfDays{get;set;}

     public required string Status {get;set;}

     public string? Comments{get;set;}

     public int Deleted{get;set;}


}
