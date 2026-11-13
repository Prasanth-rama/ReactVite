export interface Employee {
  Id?: number;
  FullName: string;
  Email: string;
  Role: string;
  DepartmentName?: string|null;
  DepartmentId?:number|null;
  EmploymentType:string|null;
  ManagerName?: string| null;
  JoiningDate: string;          // dates arrive as strings from the API
  OnboardingStatus: string;
  Status: string;
  ManagerId?:number|null;
  AnnualLeavesTaken?:number|null;
}

export interface Leave {
  Id: number;
  EmployeeName: string;
  EmployeeId:number;
  StartDate: string;
  EndDate: string;
  NoOfDays: number;
  Status: string;
  Comments?: string;
}

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
}

export interface EmployeeFilterRequest{
    FullName?:string|null;
    Email?:string|null;
    DepartmentName?:string|null,
    ManagerName?:string|null,
    EmployementType?:string|null,
    OnboardingStatus?:string|null;
    Status?:string|null;
    Page:number
    PageSize:number
}