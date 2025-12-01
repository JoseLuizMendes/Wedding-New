package com.wedding.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI weddingOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Wedding API")
                .description("API para gerenciamento de RSVP e presentes do casamento")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Wedding Team")
                    .email("contato@wedding.com")))
            .servers(List.of(
                new Server().url("/").description("Default Server")
            ));
    }
}
