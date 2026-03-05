package br.com.cae.etm.backend.user.api.v1;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.cae.etm.backend.user.infra.v1.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Lista todos os usuários (retorna apenas id e login, pois password tem @JsonIgnore).
     */
    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> listAll() {
        var users = userRepository.findAll();
        var dtos = users.stream()
            .map(u -> new UserSummaryDTO(u.getId(), u.getLogin()))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    public record UserSummaryDTO(String id, String login) {}
}
