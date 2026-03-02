package br.com.cae.etm.backend.tasks.application.v1;

import org.springframework.stereotype.Service;

import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;
import br.com.cae.etm.backend.tasks.infra.v1.TaskRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class DashboardService {
    private final TaskRepository repository;
    
    public long getDelayedTasksCount() {
        return repository.countByStatusNotAndDueDateBefore(TaskStatus.DONE, java.time.LocalDateTime.now());
    }
}
