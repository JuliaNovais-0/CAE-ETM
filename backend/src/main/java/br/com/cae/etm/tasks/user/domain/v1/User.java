package br.com.cae.etm.tasks.user.domain.v1;
import lombok.EqualsAndHashCode;
// ATÉ ESTE MOMENTO, ESTA É UMA CLASSE COMUM JAVA 
// MAAAAAS... PRECISAMOS TRANSFORMAR ESTA CLASSE NUMA ESTRUTURA LÓGICA ESPECIAL
// ESTA ESTRATURA LÓGICA ESPECIAL É UMA ENTITY - ENTIDADE REPRESENTATIVA: ela irá
// representar a tabela do banco de dados para a aplicação.

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;

// para transformarmos uma classe java em uma entity precisamos de alguns recursos importantes //  

@Table (name = "users")
//tabela no DB com nome users
@Entity(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id") // hash code precisa ser igual ao indicado no id do usuário
public class User implements UserDetails{
	@Id
	@GeneratedValue(strategy = GenerationType.UUID) //Os Ids dos registros da tabela serão incrementados e 
	// e registrados de forma automática
	
	private String id;
	private String login;
	private String password;
	
	public User(String login, String password) {
		this.login = login;
		this.password = password;
	}
	
	@Override
	// a ? é um optional element, estamos dizendo que o método pode retornar uma
	//coleção de objetos quaisquer 
	public Collection<? extends GrantedAuthority> getAuthorities(){
		return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}
	
	public String getUsername() {
		return login;
	}
	
	public String getPassword() {
		return password;
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	public boolean isEnabled() {
		return true;
	}

}
