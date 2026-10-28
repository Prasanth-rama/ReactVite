using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EmployeeApi.DTOs;
using EmployeeApi.Repositories;
using EmployeeApi.Mappings;
namespace EmployeeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        private readonly IDepartmentRepository _depRepo;
        public EmployeeController(IEmployeeRepository repo, IDepartmentRepository depRepo)
        {
            _repo = repo; _depRepo = depRepo;
        }

        [HttpGet]
        public async Task<ActionResult<List<EmployeeResponseDto>>> GetAll()
        {
            var employees = await _repo.GetAllWithDetailsAsync();
            return employees.Select(e => e.ToResponse()).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeResponseDto>> Get(int id)
        {
            var emp = await _repo.GetByIdWithDetailsAsync(id);
            return emp is null ? NotFound() : emp.ToResponse();
        }
        [HttpPost]
        public async Task<ActionResult<EmployeeResponseDto>> Create(EmployeeRequestDto dto)
        {
            if (await _repo.EmailExistsAsync(dto.Email))
                return Conflict("An employee with this email already exists.");
            var dep=await _depRepo.GetByIdAsync(dto.DepartmentId);
            if (dep is null)
                return BadRequest($"Department {dto.DepartmentId} not found");

            if (dto.ManagerId.HasValue && !await _repo.EmployeeExistsAsync(dto.ManagerId.Value))
                return BadRequest($"Manager {dto.ManagerId} not found");
            var emp = dto.ToEntity();
            await _repo.AddAsync(emp);   // Id is generated here

            return CreatedAtAction(nameof(Get), new { id = emp.Id }, emp.ToResponse());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeResponseDto>> Update(int id, EmployeeRequestDto dto)
        {
            var employee = await _repo.GetByIdWithDetailsAsync(id);
             if (employee is null)
                return BadRequest($"Employee {id} not found");
            if (dto.ManagerId == id)
            return BadRequest("An employee cannot be their own manager");
  

            if (await _repo.EmailExistsAsync(dto.Email, excludeId: id))
                return Conflict("An employee with this email already exists.");

            employee.UpdateFrom(dto);
            await _repo.UpdateAsync(employee);
            var updated = await _repo.GetByIdWithDetailsAsync(id);
             return updated!.ToResponse();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _repo.GetByIdWithDetailsAsync(id);
            if (emp is null) return NotFound();

            await _repo.DeleteAsync(emp);
            return NoContent();
        }
        [HttpGet("summary")]
        public async Task<ActionResult<EmployeeSummaryDto>> GetSummary()
        {
            var summary = await _repo.GetSummaryAsync();
            return summary is null ? NotFound() : summary;
        }
         [HttpGet("managers/{depId}")]
        public async Task<ActionResult<List<ManagerDto>>> GetManagers(int depId)
        {
            var managers = await _repo.GetManagersByDepartment(depId);
            return managers is null ? NotFound() : managers;
        }
         [HttpGet("filteredEmployees")]
        public async Task<ActionResult<List<EmployeeResponseDto>>> GetEmployees([FromQuery]EmployeeFilterRequestDto f)
        {
             var (items, totalCount)  = await _repo.GetEmployeesAsync(f);
            Response.Headers.Append("X-Total-Count", totalCount.ToString());

            return items is null ? NotFound() : Ok(items);
        }

    }
}
