using System;
using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;
public class LeaveRepository : ILeaveRepository
{
    private readonly AppDbContext _context;

    public LeaveRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(List<LeaveResponseDto> Items, int TotalCount)> GetAllAsync(string? employeeId = null, string? status = null,int page=1,int pageSize=10)
    {
        var pageNumber = page < 1 ? 1 : page;
        var pageSizes = pageSize < 1 ? 10 : Math.Min(pageSize, 100);
        var query = _context.Leaves.Where(l=>l.Deleted!=1).AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(employeeId)&& !string.IsNullOrWhiteSpace(status))
            query = query.Where(l => EF.Functions.Like(l.EmployeeId.ToString(), $"%{employeeId.Trim()}%") || EF.Functions.Like(l.Status, $"%{status.Trim()}%"));
        var totalCount = await query.CountAsync();
        var items= await query
            .OrderByDescending(l => l.StartDate)
            .Skip((pageNumber - 1) * pageSizes)
            .Take(pageSizes)
            .Select(l => new LeaveResponseDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee!.FullName,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                NoOfDays = l.NoOfDays,
                Status = l.Status,
                Comments = l.Comments
            })
            .ToListAsync();
            return (items, totalCount);
    }

    public async Task<LeaveResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Leaves
            .AsNoTracking()
            .Where(l => l.Id == id)
            .Select(l => new LeaveResponseDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee!.FullName,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                NoOfDays = l.NoOfDays,
                Status = l.Status,
                Comments = l.Comments
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Leave> AddAsync(Leave leave)
    {
      
        _context.Leaves.Add(leave);
        await _context.SaveChangesAsync();
        return leave;
    }

    public async Task<bool> UpdateAsync(int id, Leave updated)
    {
        var existing = await _context.Leaves.FindAsync(id);
        if (existing is null) return false;

        existing.EmployeeId = updated.EmployeeId;
        existing.StartDate = updated.StartDate;
        existing.EndDate = updated.EndDate;
        existing.NoOfDays = updated.NoOfDays;
        existing.Comments = updated.Comments;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateStatusAsync(int id, string status, string? comments, int Deleted)
    {
        var existing = await _context.Leaves.Include(l=>l.Employee).FirstOrDefaultAsync(l => l.Id == id);
        if (existing is null) return false;
        if (!string.IsNullOrWhiteSpace(status)) existing.Status = status;
        if(status=="Approved")
        {
            existing.Employee?.AnnualLeavesTaken  += existing.NoOfDays;
        }
        if (!string.IsNullOrWhiteSpace(comments)) existing.Comments = comments;
        if (Deleted!=0)
            existing.Deleted=Deleted;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Leaves.FindAsync(id);
        if (existing is null) return false;

        _context.Leaves.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> HasOverlapAsync(int employeeId, DateOnly start, DateOnly end, int? excludeLeaveId = null)
    {
        return await _context.Leaves.Where(l=>l.Deleted!=1).AnyAsync(l =>
            l.EmployeeId == employeeId
            && l.Status != "Rejected" && l.Status != "Cancelled"
            && (excludeLeaveId == null || l.Id != excludeLeaveId)
            && l.StartDate <= end && l.EndDate >= start);
    }

}