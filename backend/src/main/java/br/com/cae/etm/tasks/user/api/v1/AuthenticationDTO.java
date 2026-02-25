package br.com.cae.etm.tasks.user.api.v1;


import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(@NotBlank String login, @NotBlank String password) {

}
