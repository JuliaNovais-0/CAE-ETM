package br.com.cae.etm.backend.tasks.api.v1;

import java.util.Map;

public record DashboardStatsDTO(
    long totalTasks,
    long todoCount,
    long doingCount,
    long doneCount,
    long blockedCount,
    long delayedCount,
    double delayedPercentage,
    Map<String, Long> countByCategory
) {}
