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
    public EmployeeController(IEmployeeRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<List<EmployeeResponseDto>>> GetAll()
    {
        var employees = await _repo.GetAllAsync();
        return employees.Select(e => e.ToResponse()).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeResponseDto>> Get(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp is null ? NotFound() : emp.ToResponse();
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeResponseDto>> Create(EmployeeRequestDto dto)
    {
        if (await _repo.EmailExistsAsync(dto.Email))
            return Conflict("An employee with this email already exists.");

        var emp = dto.ToEntity();
        await _repo.AddAsync(emp);   // Id is generated here

        return CreatedAtAction(nameof(Get), new { id = emp.Id }, emp.ToResponse());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, EmployeeRequestDto dto)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp is null) return NotFound();

        if (await _repo.EmailExistsAsync(dto.Email, excludeId: id))
            return Conflict("An employee with this email already exists.");

        emp.UpdateFrom(dto);
        await _repo.UpdateAsync(emp);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp is null) return NotFound();

        await _repo.DeleteAsync(emp);
        return NoContent();
    }
       
    }
}
