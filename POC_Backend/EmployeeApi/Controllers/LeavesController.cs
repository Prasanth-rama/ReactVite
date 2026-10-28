using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Models;
using EmployeeApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeavesController : ControllerBase
    {
        private readonly ILeaveRepository _leaves;
        private readonly AppDbContext _context;

        public LeavesController(ILeaveRepository leaves, AppDbContext context)
        {
            _leaves = leaves;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<LeaveResponseDto>>> GetAll([FromQuery] string? employeeId = null, [FromQuery] string? status = null,[FromQuery]int page=1,[FromQuery]int pageSize=10)
        {
            var (items, totalCount) = await _leaves.GetAllAsync(employeeId, status,page,pageSize);
            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            return items is null ? NotFound() : Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveResponseDto>> GetById(int id)
        {
            var leave = await _leaves.GetByIdAsync(id);
            return leave is null ? NotFound() : Ok(leave);
        }

        [HttpPost]
        public async Task<IActionResult> Create(LeaveRequestDto dto)
        {
            var error = await ValidateAsync(dto, null);
            if (error is not null) return error;
            if (_context.Employees?.Where(e => e.Id == dto.EmployeeId).FirstOrDefault()?.AnnualLeavesTaken + dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1 > 20)
            {
                return Ok(new { Message = "Annual Leaves Completed" });
            }
            var leave = new Leave
            {
                EmployeeId = dto.EmployeeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                NoOfDays = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1,
                Status = "Pending",
                Comments = dto.Comments,
                 CreatedAt=DateTime.UtcNow
            };

            await _leaves.AddAsync(leave);
            var response = await _leaves.GetByIdAsync(leave.Id);
            return CreatedAtAction(nameof(GetById), new { id = leave.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, LeaveRequestDto dto)
        {
            var error = await ValidateAsync(dto, id);
            if (error is not null) return error;
            if (_context.Employees?.Where(e => e.Id == dto.EmployeeId).FirstOrDefault()?.AnnualLeavesTaken + dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1 > 20)
            {
                return Ok(new { Message = "Annual Leaves Completed" });
            }
            var updated = new Leave
            {
                EmployeeId = dto.EmployeeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                NoOfDays = dto.EndDate.DayNumber - dto.StartDate.DayNumber + 1,
                Status = dto.Status,   // not applied by UpdateAsync, required only by the model
                Comments = dto.Comments,

            };

            return await _leaves.UpdateAsync(id, updated) ? NoContent() : NotFound();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, LeaveRequestDto dto)
            => await _leaves.UpdateStatusAsync(id, dto.Status, dto.Comments,dto.Deleted) ? NoContent() : NotFound();

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
            => await _leaves.DeleteAsync(id) ? NoContent() : NotFound();

        private async Task<ActionResult?> ValidateAsync(LeaveRequestDto dto, int? leaveId)
        {
            var errors = new Dictionary<string, string[]>();

            if (dto.EndDate < dto.StartDate)
                errors[nameof(dto.EndDate)] = new[] { "EndDate cannot be before StartDate." };

            if (!_context.Employees.Any(e => e.Id == dto.EmployeeId && e.Deleted!=1))
                errors[nameof(dto.EmployeeId)] = new[] { $"Employee with id {dto.EmployeeId} does not exist." };

            if (errors.Count == 0 && await _leaves.HasOverlapAsync(dto.EmployeeId, dto.StartDate, dto.EndDate, leaveId))
                errors[nameof(dto.StartDate)] = new[] { "This employee already has leave in the selected period." };


            return errors.Count > 0 ? ValidationProblem(new ValidationProblemDetails(errors)) : null;
        }
    }
}
