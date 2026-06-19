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
    public class ProjectsController : ControllerBase
    {
        private readonly IGenericRepository<Project> _projectRepository;

        public ProjectsController(IGenericRepository<Project> projectRepository)
        {
            _projectRepository = projectRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _projectRepository.GetAllAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project == null)
            {
                return NotFound(new { message = "Không tìm thấy dự án" });
            }
            return Ok(project);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Project project)
        {
            if (project.Id == Guid.Empty)
            {
                project.Id = Guid.NewGuid();
            }

            await _projectRepository.AddAsync(project);
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Project updatedProject)
        {
            var existingProject = await _projectRepository.GetByIdAsync(id);
            if (existingProject == null)
            {
                return NotFound(new { message = "Không tìm thấy dự án để cập nhật" });
            }

            existingProject.Title = updatedProject.Title;
            existingProject.Description = updatedProject.Description;
            existingProject.Tags = updatedProject.Tags;
            existingProject.ImageUrl = updatedProject.ImageUrl;
            existingProject.GithubUrl = updatedProject.GithubUrl;
            existingProject.LiveUrl = updatedProject.LiveUrl;
            existingProject.ProblemDescription = updatedProject.ProblemDescription;
            existingProject.SolutionDescription = updatedProject.SolutionDescription;
            existingProject.ResultDescription = updatedProject.ResultDescription;

            await _projectRepository.UpdateAsync(existingProject);
            return Ok(existingProject);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existingProject = await _projectRepository.GetByIdAsync(id);
            if (existingProject == null)
            {
                return NotFound(new { message = "Không tìm thấy dự án để xóa" });
            }

            await _projectRepository.DeleteAsync(id);
            return Ok(new { message = "Xóa dự án thành công" });
        }
    }
}
