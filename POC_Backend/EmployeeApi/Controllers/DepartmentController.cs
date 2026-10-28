using EmployeeApi.DTOs;
using EmployeeApi.Mappings;
using EmployeeApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repo;
        public DepartmentController(IDepartmentRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<ActionResult<List<DepartmentResponseDto>>> GetAll()
        {
            var departments = await _repo.GetAllAsync();
            return departments.Select(d => d.ToResponse()).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentResponseDto>> Get(int id)
        {
            var dep = await _repo.GetByIdAsync(id);
            return dep is null ? NotFound() : dep.ToResponse();
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentResponseDto>> Create(DepartmentRequestDto dto)
        {
            if (await _repo.DepartmentExistsAsync(dto.DepartmentName??"No department"))
                return Conflict("A Department with this name already exists.");

            var dep = dto.ToEntity();
            await _repo.AddAsync(dep);   // Id is generated here

            return CreatedAtAction(nameof(Get), new { id = dep.Id }, dep.ToResponse());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, DepartmentRequestDto dto)
        {
            var dep = await _repo.GetByIdAsync(id);
            if (dep is null) return NotFound();

            if (await _repo.DepartmentExistsAsync(dto.DepartmentName??"No department"))
                return Conflict("An employee with this email already exists.");

            dep.UpdateFrom(dto);
            await _repo.UpdateAsync(dep);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var dep = await _repo.GetByIdAsync(id);
            if (dep is null) return NotFound();

            await _repo.DeleteAsync(dep);
            return NoContent();
        }
    }
}
