package br.com.cae.etm.backend.user.application.v1;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import br.com.cae.etm.backend.user.infra.v1.UserRepository;
import lombok.RequiredArgsConstructor;

//injeção por construtor: é uma forma de fazer uso de DI sem a necessidade de usar a annotation @Autowired
@RequiredArgsConstructor
// aqui devemos usar a annotation @Service para que fique claro que essa clasee é uma service para o projeto 
@Service 
public class UserAuthorizationService implements UserDetailsService {
	//@Autowired -> essa annotation da a possibilidade de fazer uso de DI
	// (Dependence Injection/ injeção de dependência), significa que tudo aquilo que esta classe vai 
	// fazer depende do recurso que está disponível na propriedade repository
	private final UserRepository repository;
	
	@Override
	public UserDetails loadUserByUsername(String username) {
		return repository.findByLogin(username);
	}
}
