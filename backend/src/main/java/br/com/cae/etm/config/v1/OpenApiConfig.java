package br.com.cae.etm.config.v1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

//Arquivo responsável por configurar o Swagger para testar os endpoints da aplicação

@Configuration
public class OpenApiConfig {
	@Bean //Annotatation para inversão de controle 
	public OpenAPI customOpenApi() {
		return new OpenAPI()
				.info(new Info().title("API de autenticação - backend").version("1.0"))
				.addSecurityItem(new SecurityRequirement().addList("bearer-key"))
				.components(new Components().addSecuritySchemes("bearer-key",
																	new SecurityScheme()
																	.type(SecurityScheme.Type.HTTP)
																	.scheme("bearer")
																	.bearerFormat("JWT")));
	}
}
