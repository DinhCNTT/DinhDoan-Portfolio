using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Interfaces;

namespace Portfolio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkillsController : ControllerBase
    {
        private readonly IGenericRepository<Skill> _skillRepository;

        public SkillsController(IGenericRepository<Skill> skillRepository)
        {
            _skillRepository = skillRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var skills = await _skillRepository.GetAllAsync();
                return Ok(skills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi kết nối cơ sở dữ liệu", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var skill = await _skillRepository.GetByIdAsync(id);
            if (skill == null)
            {
                return NotFound(new { message = "Không tìm thấy kỹ năng" });
            }
            return Ok(skill);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Skill skill)
        {
            if (skill.Id == Guid.Empty)
            {
                skill.Id = Guid.NewGuid();
            }

            await _skillRepository.AddAsync(skill);
            return CreatedAtAction(nameof(GetById), new { id = skill.Id }, skill);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Skill updatedSkill)
        {
            var existingSkill = await _skillRepository.GetByIdAsync(id);
            if (existingSkill == null)
            {
                return NotFound(new { message = "Không tìm thấy kỹ năng để cập nhật" });
            }

            existingSkill.Name = updatedSkill.Name;
            existingSkill.Category = updatedSkill.Category;
            existingSkill.Level = updatedSkill.Level;

            await _skillRepository.UpdateAsync(existingSkill);
            return Ok(existingSkill);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existingSkill = await _skillRepository.GetByIdAsync(id);
            if (existingSkill == null)
            {
                return NotFound(new { message = "Không tìm thấy kỹ năng để xóa" });
            }

            await _skillRepository.DeleteAsync(id);
            return Ok(new { message = "Xóa kỹ năng thành công" });
        }
    }
}
