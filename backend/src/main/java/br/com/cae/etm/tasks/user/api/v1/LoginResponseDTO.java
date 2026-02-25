package br.com.cae.etm.tasks.user.api.v1;

//Aqui o record LoginResponse está aguardando o token JWT que será gerado quando
//o usuário tentar fazer o login na aplicação e este login for feito com sucesso 
public record LoginResponseDTO(String token) {

}
