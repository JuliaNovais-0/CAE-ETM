package br.com.cae.etm.controllers.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import br.com.cae.etm.tasks.user.application.v1.UserTokenService;

import br.com.cae.etm.tasks.user.api.v1.AuthenticationDTO;
import br.com.cae.etm.tasks.user.api.v1.LoginResponseDTO;
import br.com.cae.etm.tasks.user.api.v1.RegisterDTO;
import br.com.cae.etm.tasks.user.domain.v1.User;
import br.com.cae.etm.tasks.user.infra.v1.UserRepository;
import jakarta.validation.Valid;

//objetivo é controlar o fluxo de dados para o processo de autenticação/autorização
//do usuário para acessar uma área restrita da aplicação 
// controller sempre "cadastra" no repositório

@RestController
@RequestMapping ("/api/auth")
public class AuthenticationController {
	
	//agora, precisamos definir as DIs, que serão utilizadas no controller
	//para este propósito, precisamos fazer uso a annotation @Autowire
	
	@Autowired 
	//esta annotation dá a possibilidade de fazer uso de DI - dependency injection
	// (injeção de dependencia): significa que tudo aquilo que esta classe vai fazer "depende"
	//dos recursos que estarão disponíveis nas propriedades definidas abaixo
	private AuthenticationManager authenticationManager;
	
	@Autowired 
	private UserRepository repository;
	
	@Autowired
	private UserTokenService tokenService;
	
	@PostMapping("/register")
	public ResponseEntity register(@RequestBody @Valid RegisterDTO dadosCadastro) {
		// verificar se os dados de cadastro realmente existem
		//para inserir dados na aplicação é com o repository
		if(this.repository.findByLogin(dadosCadastro.login()) != null) {
			// se o retorno for true
			return ResponseEntity.badRequest().build(); // aqui está descrito que caso
			//exista um user cadastrado com o mesmo username não será possível casdastrar
		}
		String encryptedPassword = new BCryptPasswordEncoder().encode(dadosCadastro.password());
		//assim a senha do user foi criptografada
		
		//agora vamos enviar um objeto que será composto pela senha criptografada
		//e o username para o cadastro
		User novoUser =  new User(dadosCadastro.login(), encryptedPassword);
		
		// acessar a DI repository que salva o novo registro no banco de dados
		
		this.repository.save(novoUser);
		
		return ResponseEntity.ok().build();
	}
	
	// definir o método que irá enviar - requisição HTTP POST - os dados do uauário para a
	// autenticação
	//PostMapping: nossa requisição deve chegar nesse endereço:
	// http://localhost:8080/api/auth/login
	
	@PostMapping("/login")
	public ResponseEntity login(@RequestBody AuthenticationDTO dados) {
		// definir uma var para receber como valor o seguinte recursos
		var dadosUsuario = new UsernamePasswordAuthenticationToken(dados.login(), dados.password());
		var auth = this.authenticationManager.authenticate(dadosUsuario);
		// aqui, a DI authentication manager pega os dados de usuario e procede com a
		//autenticação de suas credenciais de acesso
		var token = tokenService.generateToken((User) auth.getPrincipal());
		//aqui estamos gerando o token e "fazendo" as associações necessárias para a 
		//autorização do usuário para a parte restrita da aplicação
		
		return ResponseEntity.ok(new LoginResponseDTO(token));
	}
	
}
