package com.github.merzsh.basic.nsmarket.microservices.countries;

import com.github.merzsh.basic.nsmarket.kernel.config.BaseJpaConfig;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc // Включает поддержку REST-контроллеров
@ComponentScan(basePackages = "com.github.merzsh.basic.nsmarket.microservices.countries")
public class AppConfig extends BaseJpaConfig {

  @Override
  protected String getPackagesToScan() {
    // Указываем пакет из kernel, где лежит JpaTabCountries
    return "com.github.merzsh.basic.nsmarket.kernel.common.country";
  }
}
