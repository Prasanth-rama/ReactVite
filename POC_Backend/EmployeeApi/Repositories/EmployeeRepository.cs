// Repositories/EmployeeRepository.cs
using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Mappings;
using EmployeeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class EmployeeRepository(AppDbContext db) : IEmployeeRepository
{
    private readonly AppDbContext _db = db;

    public async Task<List<Employee>> GetAllWithDetailsAsync()
    {
        return await db.Employees.Where(e => e.Deleted != 1).OrderBy(e => e.JoiningDate).ThenByDescending(e => e.FullName)
            .Include(e => e.Department)
            .Include(e => e.Manager)
            .ToListAsync();
    }

    public async Task<Employee?> GetByIdWithDetailsAsync(int id) =>
        await db.Employees
            .Include(e => e.Department)
            .Include(e => e.Manager)
            .FirstOrDefaultAsync(e => e.Id == id);

    public Task<bool> EmailExistsAsync(string email, int? excludeId = null) =>
        _db.Employees.AnyAsync(e => e.Email == email && (excludeId == null || e.Id != excludeId));

    public async Task AddAsync(Employee employee)
    {
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Employee employee)
    {
        // employee was loaded via GetByIdAsync, so EF is already tracking its changes
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Employee employee)
    {
        employee.Deleted = 1;
        await _db.SaveChangesAsync();
    }

    public Task<bool> EmployeeExistsAsync(int id) =>
       db.Employees.AnyAsync(e => e.Id == id);

    public async Task<EmployeeSummaryDto> GetSummaryAsync()
    {
        var employees = db.Employees.Where(e => e.Deleted != 1);

        var byEmploymentType = (await employees
            .GroupBy(e => e.EmploymentType)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToListAsync())
            .ToDictionary(x => x.Key.ToString(), x => x.Count);
         var now = DateOnly.FromDateTime(DateTime.UtcNow);
        var byStatus = (await employees
            .GroupBy(e => e.Status).AsNoTracking()
            .Select(g => new { g.Key, Count = g.Count() })
            .ToListAsync()) .ToDictionary(x => x.Key.ToString(), x => x.Count);
            byStatus["On Leave"]=db.Leaves.Where(l => l.Status == "Approved" && l.Employee!.Deleted!=1
                                        && l.StartDate <= now
                                        && l.EndDate >= now).Distinct().Count();
                                        

        var byOnboarding = (await employees
            .GroupBy(e => e.OnboardingStatus)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToListAsync())
            .ToDictionary(x => x.Key.ToString(), x => x.Count);

        var byDepartment = await employees
            .GroupBy(e => e.DepartmentId).Select(g => new { Queryable = String.Join("", db.Departments.Where(d => d.Id == g.Key).Select(d => d.Name)) ?? "No Dep", Count = g.Count() })
            .ToDictionaryAsync(g => g.Queryable, g => g.Count);

        var byRole = await employees
            .GroupBy(e => e.Role)
            .ToDictionaryAsync(g => g.Key, g => g.Count());



        var byManager = await employees
            .Where(e => e.ManagerId != null)
            .GroupBy(e => e.Manager!.FullName)
            .ToDictionaryAsync(g => g.Key, g => g.Count());
        var PendingLeaveRequests = await db.Leaves.Where(l => l.Status == "Pending").CountAsync();
        var today = DateOnly.FromDateTime(DateTime.Today);

        // Monday as the start of the week
        int diff = (7 + (int)today.DayOfWeek - (int)DayOfWeek.Monday) % 7;
        var weekStart = today.AddDays(-diff);        // Monday 00:00
        var weekEnd = weekStart.AddDays(7);          // next Monday 00:00 (exclusive)
        var employeesOnLeave = await db.Employees.Where(e=>e.Deleted!=1)
            .Include(e => e.Department)
            .Where(e => db.Leaves.Any(l =>
                l.EmployeeId == e.Id
                && l.Status == "Approved"
                && l.StartDate <= weekEnd
                && l.EndDate >= weekStart))
            .ToListAsync();

        var employeesDtoOnLeave = employeesOnLeave.Select(e => e.ToResponse()).ToList();
        return new EmployeeSummaryDto
        {
            TotalEmployees = await employees.CountAsync(),
            ByDepartment = byDepartment,
            ByEmploymentType = byEmploymentType,
            ByOnboardingStatus = byOnboarding,
            ByStatus = byStatus,
            EmployeeeThisMonth = await employees.Where(e => e.JoiningDate.Month == DateTime.Now.Month &&e.JoiningDate.Year==DateTime.Now.Year && e.Deleted!=1).CountAsync(),
            PendingLeaveRequests = PendingLeaveRequests,
            EmployeesOnLeaveThisWeek = employeesDtoOnLeave
        };
    }
    public async Task<List<ManagerDto>> GetManagersByDepartment(int depId)
    {
        return await db.Employees.Where(e =>  e.DepartmentId == depId)
                             .Select(m => new ManagerDto { ManagerId = m.Id, ManagerName = m.FullName }).ToListAsync();
    }
    public async Task<(List<EmployeeResponseDto> Items, int TotalCount)> GetEmployeesAsync(EmployeeFilterRequestDto f)
    {
        var pageNumber = f.Page < 1 ? 1 : f.Page;
        var pageSize = f.PageSize < 1 ? 10 : Math.Min(f.PageSize, 100);

        var query = db.Employees.Include(e => e.Department).Include(e => e.Manager).Where(e => e.Deleted != 1).AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(f.FullName) && !string.IsNullOrWhiteSpace(f.Email))
            query = query.Where(e => EF.Functions.Like(e.FullName, $"%{f.FullName.Trim()}%") || EF.Functions.Like(e.Email, $"%{f.Email.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.FullName) && string.IsNullOrWhiteSpace(f.Email))
            query = query.Where(e => EF.Functions.Like(e.FullName, $"%{f.FullName.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.DepartmentName))
            query = query.Where(e => EF.Functions.Like(e.Department!.Name, $"%{f.DepartmentName.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.ManagerName))
            query = query.Where(e => EF.Functions.Like(e.Manager!.FullName, $"%{f.ManagerName.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.EmploymentType))
            query = query.Where(e => EF.Functions.Like(e.EmploymentType, $"%{f.EmploymentType.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.OnboardingStatus))
            query = query.Where(e => EF.Functions.Like(e.OnboardingStatus, $"%{f.OnboardingStatus.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(f.Status))
            query = query.Where(e => EF.Functions.Like(e.Status, $"%{f.Status.Trim()}%"));

        var totalCount = await query.CountAsync();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var items = await query.Include(e => e.Department).Include(e => e.Manager)
            .OrderByDescending(e => e.JoiningDate).ThenByDescending(e => e.FullName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new EmployeeResponseDto
            {
                Id = e.Id,
                FullName = e.FullName,
                Email = e.Email,
                Role = e.Role,
                DepartmentId = e.DepartmentId,
                EmploymentType = e.EmploymentType,
                JoiningDate = e.JoiningDate,
                OnboardingStatus = e.OnboardingStatus,
                DepartmentName = e.Department!.Name,
                ManagerId = e.ManagerId,
                ManagerName = e.Manager!.FullName,
                AnnualLeavesTaken = e.AnnualLeavesTaken,
                Status = e.LeaveDates.Any(l => l.Status == "Approved" && l.Employee!.Deleted!=1
                                        && l.StartDate <= today
                                        && l.EndDate >= today)
                 ? "On Leave"
                 : e.Status
            })
            .ToListAsync();

        return (items, totalCount);
    }

}