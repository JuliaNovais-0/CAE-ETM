package br.com.cae.etm.backend.tasks.application.v1;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cae.etm.backend.tasks.api.v1.DashboardStatsDTO;
import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;
import br.com.cae.etm.backend.tasks.infra.v1.TaskRepository;

@Service
public class DashboardService {

    @Autowired
    private TaskRepository repository;

    public DashboardStatsDTO getStats() {
        long total = repository.countByDeletedFalse();
        long todoCount = repository.countByStatusAndDeletedFalse(TaskStatus.TODO);
        long doingCount = repository.countByStatusAndDeletedFalse(TaskStatus.DOING);
        long doneCount = repository.countByStatusAndDeletedFalse(TaskStatus.DONE);
        long blockedCount = repository.countByStatusAndDeletedFalse(TaskStatus.BLOCKED);
        long delayedCount = repository.countByStatusNotAndDueDateBeforeAndDeletedFalse(
            TaskStatus.DONE, LocalDateTime.now()
        );

        double delayedPercentage = total > 0 ? (delayedCount * 100.0) / total : 0;

        Map<String, Long> countByCategory = new LinkedHashMap<>();
        List<Object[]> categoryResults = repository.countByCategory();
        for (Object[] row : categoryResults) {
            countByCategory.put((String) row[0], (Long) row[1]);
        }

        return new DashboardStatsDTO(
            total,
            todoCount,
            doingCount,
            doneCount,
            blockedCount,
            delayedCount,
            Math.round(delayedPercentage * 100.0) / 100.0,
            countByCategory
        );
    }
}
