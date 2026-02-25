package br.com.cae.etm.tasks.user.application.v1;
import br.com.cae.etm.tasks.user.domain.v1.User;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

// esse Service tem como proposito a definição de regras
// para gerar o token JWT para o processo de autenticação e autorização
// do usuário a qualquer área restrita da aplicação

@Service 
public class UserTokenService {
	// abaixo a annotation @Value() é um dos recursos mais importantes 
	// para a segurança dqa aplicação. Ela permite que o Spring "busque" um valor fora
	// do código java para atribuir à alguma variável que pertence a esta classe. Neste caso,
	// a annotation acessa a chave secreta do token - descrita no arquivo application.properties
	// para fazer uso deste valor aqui, no código responsävel por gerar o token.
	
	@Value("${api.security.token.secret}")
	private String secret; // aqui o atributo foi definido pela annotation @Value()
	
	//agora o passo é definir o método que gera o token para a aplicação
	public String generateToken(User user) {
		try {
			//dentro do try vamos tentar gerar o token 
			Algorithm algorithm = Algorithm.HMAC256(secret); //Criptografia
			return JWT.create()
					.withIssuer("api-backend")
					.withSubject(user.getLogin())
					.withExpiresAt(genExpirationDate())
					.sign(algorithm);
		}catch(JWTCreationException exception) {
			throw new RuntimeException("Erro ao gerar token", exception);
		}
	}
	private Instant genExpirationDate() {
		return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
	}
	
	public String validateToken(String token) {
		try {
			//dentro do try vamos tentar gerar o token 
			Algorithm algorithm = Algorithm.HMAC256(secret); //Criptografia
			return JWT.require(algorithm)
					.withIssuer("api-backend")
					.build()
					.verify(token)
					.getSubject();
		}catch(JWTVerificationException exception) {
			return "";
		}
	}
}