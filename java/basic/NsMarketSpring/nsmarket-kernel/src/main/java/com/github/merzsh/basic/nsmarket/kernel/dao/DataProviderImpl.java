package com.github.merzsh.basic.nsmarket.kernel.dao;

import jakarta.persistence.EntityManagerFactory;

public abstract class DataProviderImpl implements AutoCloseable {
  protected EntityManagerFactory mriFactory;

  @Override
  public void close() throws Exception {
  }
}
