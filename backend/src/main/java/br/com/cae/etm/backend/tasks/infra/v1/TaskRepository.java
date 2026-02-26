package br.com.cae.etm.backend.tasks.infra.v1;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cae.etm.backend.tasks.domain.v1.Task;
import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, String> {
    //Tem ter o nome do que faz,em inglês, e começar com find, count, delete ou exists
    public long countByStatus(TaskStatus status);

    //também é possível usar sufixos como Before, After, GreaterThan, LessThan, etc
    //também é possível usar operadores lógicos como And, Or, Not, etc
    public long countByStatusNotAndDueDateBefore(TaskStatus status, LocalDateTime dueDate);
}
