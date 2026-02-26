package br.com.cae.etm.backend.user.api.v1;

import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(@NotBlank String login, @NotBlank String password) {

}
