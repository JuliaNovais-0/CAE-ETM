package br.com.cae.etm.config.v1;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)

public class OpenApiConfig {

  @Bean
  OpenAPI etmOpenAPI() {
    return new OpenAPI()
      .info(new Info()
        .title("ETM - Enterprise Task Manager API")
        .version("v1")
        .description("API para gestão de tarefas, categorias, tags e indicadores.")
        .contact(new Contact().name("Equipe Ctrl+Alt+Elite").email("")))
      .externalDocs(new ExternalDocumentation()
        .description("README & DER")
        .url(""));
  }

  @Bean
  GroupedOpenApi tasksGroup() {
    return GroupedOpenApi.builder()
      .group("tasks")
      .pathsToMatch("/api/v1/tasks/**")
      .build();
  }

  @Bean
  GroupedOpenApi catalogGroup() {
    return GroupedOpenApi.builder()
      .group("catalog")
      .pathsToMatch("/api/v1/categories/**", "/api/v1/tags/**")
      .build();
  }

  @Bean
  GroupedOpenApi dashboardGroup() {
    return GroupedOpenApi.builder()
      .group("dashboard")
      .pathsToMatch("/api/v1/dashboard/**")
      .build();
  }
}
