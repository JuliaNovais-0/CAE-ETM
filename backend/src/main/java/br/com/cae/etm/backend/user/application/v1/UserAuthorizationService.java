package br.com.cae.etm.backend.user.application.v1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import br.com.cae.etm.backend.user.infra.v1.UserRepository;

@Service 
public class UserAuthorizationService implements UserDetailsService {
	@Autowired
	private UserRepository repository;
	
	@Override
	public UserDetails loadUserByUsername(String username) {
		return repository.findByLogin(username);
	}
}
