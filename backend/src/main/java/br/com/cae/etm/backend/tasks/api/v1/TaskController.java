package br.com.cae.etm.backend.tasks.api.v1;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.cae.etm.backend.tasks.domain.v1.Tag;
import br.com.cae.etm.backend.tasks.domain.v1.Task;
import br.com.cae.etm.backend.tasks.domain.v1.TaskPriority;
import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;
import br.com.cae.etm.backend.tasks.infra.v1.TagRepository;
import br.com.cae.etm.backend.tasks.infra.v1.TaskRepository;
import br.com.cae.etm.backend.user.infra.v1.UserRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity create(@RequestBody @Valid CreateTaskDTO dto) {
        Task task = new Task(dto.title(), dto.description(), dto.status(),
                            dto.priority(), dto.category(), dto.dueDate());

        if (dto.tags() != null) {
            List<Tag> tags = new ArrayList<>();
            for (String name : dto.tags()) {
                Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(name)));
                tags.add(tag);
            }
            task.setTags(tags);
        }
        if (dto.assigneeIds() != null) {
            task.setAssignee(userRepository.findAllById(dto.assigneeIds()));
        }

        this.taskRepository.save(task);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<Task>> listAll(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(taskRepository.findAllWithFilters(status, priority, category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable String id) {
        var task = taskRepository.findByIdAndDeletedFalse(id);
        if (task.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity update(@PathVariable String id, @RequestBody CreateTaskDTO dto) {
        var optional = taskRepository.findByIdAndDeletedFalse(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task task = optional.get();
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setStatus(dto.status());
        task.setPriority(dto.priority());
        task.setCategory(dto.category());
        task.setDueDate(dto.dueDate());

        if (dto.tags() != null) {
            List<Tag> tags = new ArrayList<>();
            for (String name : dto.tags()) {
                Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(name)));
                tags.add(tag);
            }
            task.setTags(tags);
        }
        if (dto.assigneeIds() != null) {
            task.setAssignee(userRepository.findAllById(dto.assigneeIds()));
        }

        this.taskRepository.save(task);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable String id) {
        var optional = taskRepository.findByIdAndDeletedFalse(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Task task = optional.get();
        task.setDeleted(true);
        task.setDeletedAt(LocalDateTime.now());
        this.taskRepository.save(task);
        return ResponseEntity.ok().build();
    }
}
