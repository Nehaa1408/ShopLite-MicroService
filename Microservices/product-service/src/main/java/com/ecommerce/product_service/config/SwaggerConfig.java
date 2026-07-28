package com.ecommerce.product_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI productServiceAPI() {

        return new OpenAPI()

                .info(new Info()
                        .title("ShopLite Product Service API")
                        .description("REST APIs for Product Service in ShopLite Microservices")
                        .version("1.0")

                        .contact(new Contact()
                                .name("XYZ")
                                .email("XYZ@example.com"))

                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))

                .externalDocs(new ExternalDocumentation()
                        .description("ShopLite Documentation"));
    }
}