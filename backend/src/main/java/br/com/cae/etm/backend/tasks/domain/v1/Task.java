package br.com.cae.etm.backend.tasks.domain.v1;

import java.time.*;
import java.util.List;

import br.com.cae.etm.backend.user.domain.v1.User;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "tasks")
@Entity(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")

public class Task {
    @Id

    @GeneratedValue(strategy = GenerationType.UUID)
   
    private String id;
    private String title;
    private LocalDateTime dueDate;
 
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    
    @ManyToMany 
    @JoinTable(
        name = "tasks_users", // Nome da tabela intermediária que será criada
        joinColumns = @JoinColumn(name = "task_id"), // A coluna que aponta para a Tarefa
        inverseJoinColumns = @JoinColumn(name = "user_id") // A coluna que aponta para o Usuário
    )
    private List<User> assignee;

    public Task(String title, TaskStatus status, LocalDateTime dueDate, User assignee) {
        this.title = title;
        this.status = status;
        this.dueDate = dueDate;
        this.assignee = List.of(assignee);
    }

}