package com.github.merzsh.basic.nsmarket.microservices.countries;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

  @Override
  protected Class<?>[] getRootConfigClasses() {
    // Общий контекст не нужен, всё настроим в Web-контексте
    return null;
  }

  @Override
  protected Class<?>[] getServletConfigClasses() {
    // Указываем Jetty считать наш класс конфигурации AppConfig для стран!
    return new Class<?>[] { AppConfig.class };
  }

  @Override
  protected String[] getServletMappings() {
    // Привязываем Spring MVC к корню сайта
    return new String[] { "/" };
  }
}
