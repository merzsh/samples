package com.github.merzsh.basic.nsmarket.kernel.dao;

import jakarta.persistence.EntityManager;

public interface DataProvider {

  public EntityManager getConnection();

  public void openNewConnectionManual();

  public EntityManager getConnectionManual();

  public void closeConnectionManual();
}
