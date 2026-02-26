package br.com.cae.etm.backend.tasks.infra.v1;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cae.etm.backend.tasks.domain.v1.Task;

public interface TaskRepository extends JpaRepository<Task, String> {
    
}
