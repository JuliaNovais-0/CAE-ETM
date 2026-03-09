package br.com.cae.etm.backend.user.api.v1;

// Record que retorna o login e a senha criptografada após o cadastro
// para demonstração no console do navegador
public record RegisterResponseDTO(String login, String encryptedPassword) {

}
