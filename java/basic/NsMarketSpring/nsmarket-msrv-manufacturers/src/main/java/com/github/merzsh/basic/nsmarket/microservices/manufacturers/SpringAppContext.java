package com.github.merzsh.basic.nsmarket.microservices.manufacturers;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringAppContext implements ApplicationContextAware {

  private static ApplicationContext ctx = null;

  public static ApplicationContext getApplicationContext() {
    return ctx;
  }

  @SuppressWarnings("static-access")
  public void setApplicationContext(ApplicationContext ctx) {
    this.ctx = ctx;
  }
}
