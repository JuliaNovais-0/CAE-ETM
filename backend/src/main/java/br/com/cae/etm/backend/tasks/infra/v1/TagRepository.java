package br.com.cae.etm.backend.tasks.infra.v1;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cae.etm.backend.tasks.domain.v1.Tag;

public interface TagRepository extends JpaRepository<Tag, String> {
    Optional<Tag> findByName(String name);
}
