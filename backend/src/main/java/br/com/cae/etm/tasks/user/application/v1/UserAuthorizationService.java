package br.com.cae.etm.tasks.user.application.v1;
import br.com.cae.etm.tasks.user.infra.v1.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;


// aqui devemos usar a annotation @Service para que fique claro que essa clasee é uma service para o projeto 
@Service 
public class UserAuthorizationService implements UserDetailsService {
	@Autowired // essa annotation da a possibilidade de fazer uso de DI
	// (Dependence Injection/ injeção de dependência), significa que tudo aquilo que esta classe vai 
	// fazer depende do recurso que está disponível na propriedade reposiory
	UserRepository repository;
	
	@Override
	public UserDetails loadUserByUsername(String username) {
		return repository.findByLogin(username);
	}
}


