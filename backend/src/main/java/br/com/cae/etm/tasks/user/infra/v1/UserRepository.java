package br.com.cae.etm.tasks.user.infra.v1;
import br.com.cae.etm.tasks.user.domain.v1.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
//faz a tradução entre os dados que estão nos bancos de dados 

// Repository é um padrão que usamos para ser um "mediador" entre o armazenamento de dados e a
// estrutura de de operação de dados, ou seja, um intermediario entre controllers
// e o banco de dados
public interface UserRepository extends JpaRepository<User,String> {
	// uma interface é nada mais do que um contrato: qualquer regra que aqui for definida deve 
	// ser cumprida por quem assinar este contrato/ estabelecer um relacionamento com a inteface 
	UserDetails findByLogin(String login);
}
