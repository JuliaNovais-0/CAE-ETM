package br.com.cae.etm.backend.tasks.infra.v1;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.cae.etm.backend.tasks.domain.v1.Task;
import br.com.cae.etm.backend.tasks.domain.v1.TaskPriority;
import br.com.cae.etm.backend.tasks.domain.v1.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, String> {

    // Buscar por id apenas se nao estiver deletado (soft delete)
    Optional<Task> findByIdAndDeletedFalse(String id);

    // Listagem com paginacao e filtros dinamicos por status e prioridade (somente nao deletados)
    @Query("SELECT t FROM tasks t WHERE t.deleted = false "
         + "AND (:status IS NULL OR t.status = :status) "
         + "AND (:priority IS NULL OR t.priority = :priority) "
         + "AND (:category IS NULL OR t.category = :category)")
    Page<Task> findAllWithFilters(
        @Param("status") TaskStatus status,
        @Param("priority") TaskPriority priority,
        @Param("category") String category,
        Pageable pageable
    );

    // Contagens para o dashboard (somente nao deletados)
    long countByStatusAndDeletedFalse(TaskStatus status);

    long countByDeletedFalse();

    // Tarefas atrasadas: status diferente de DONE e dueDate antes de agora
    long countByStatusNotAndDueDateBeforeAndDeletedFalse(TaskStatus status, LocalDateTime dueDate);

    // Contagem por categoria
    @Query("SELECT t.category, COUNT(t) FROM tasks t WHERE t.deleted = false GROUP BY t.category")
    List<Object[]> countByCategory();
}
