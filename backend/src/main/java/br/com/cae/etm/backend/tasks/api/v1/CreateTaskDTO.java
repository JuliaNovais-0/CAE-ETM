package br.com.cae.etm.backend.tasks.api.v1;

import java.time.LocalDateTime;
import java.util.List;

import br.com.cae.etm.backend.tasks.domain.v1.TaskPriority;
import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTaskDTO(
    @NotBlank String title,
    String description,
    @NotNull TaskStatus status,
    @NotNull TaskPriority priority,
    @NotBlank String category,
    LocalDateTime dueDate,
    List<String> tags,
    List<String> assigneeIds
) {}
