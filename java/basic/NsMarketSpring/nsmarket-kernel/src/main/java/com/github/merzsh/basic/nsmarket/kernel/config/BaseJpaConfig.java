package com.github.merzsh.basic.nsmarket.kernel.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@EnableTransactionManagement
@PropertySource("classpath:nsmarket.kernel.properties")
public abstract class BaseJpaConfig {
  // чтение свойств внешнего из конфигурационного файла (через аннотацию @PropertySource)
  // (в продакшне такие вещи читают из переменных окружения, используя выражение типа ${USER_NAME})
  @Value("${db.driver}")
  private String dbDriver;

  @Value("${db.url}")
  private String dbUrl;

  @Value("${db.user}")
  private String dbUser;

  @Value("${db.password}")
  private String dbPassword;

  // Каждый микросервис сам скажет, какой пакет сканировать на наличие @Entity
  protected abstract String getPackagesToScan();

  @Bean
  public DataSource dataSource() {
    HikariConfig config = new HikariConfig();
    config.setDriverClassName(dbDriver);
    config.setJdbcUrl(dbUrl);
    config.setUsername(dbUser);
    config.setPassword(dbPassword);

    // Оптимальные настройки пула для микросервиса
    config.setMaximumPoolSize(5);
    config.setMinimumIdle(2);
    return new HikariDataSource(config);
  }

  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
    LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
    factory.setDataSource(dataSource);
    factory.setPackagesToScan(getPackagesToScan());
    factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
    factory.setPersistenceProviderClass(HibernatePersistenceProvider.class);

    Properties jpaProperties = new Properties();
    jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
    // validate проверит соответствие классов и таблиц, не ломая данные
    jpaProperties.put("hibernate.hbm2ddl.auto", "update");
    jpaProperties.put("hibernate.show_sql", "true");
    jpaProperties.put("hibernate.format_sql", "true");
    factory.setJpaProperties(jpaProperties);

    return factory;
  }

  @Bean
  public PlatformTransactionManager transactionManager(EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
  }
}
