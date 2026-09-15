package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

public abstract class DataProviderJpa extends DataProviderImpl implements DataProvider {

  EntityManager mriEntityManagerManual = null;

  public DataProviderJpa(EntityManagerFactory priFactory) {
    Objects.requireNonNull(priFactory, "priFactory");
    mriFactory = priFactory;
  }

  @Override
  public void openNewConnectionManual() {
    if(mriEntityManagerManual != null) mriEntityManagerManual.close();
    mriEntityManagerManual = mriFactory.createEntityManager();

  }

  @Override
  public EntityManager getConnectionManual() {
    return mriEntityManagerManual;
  }

  @Override
  public void closeConnectionManual() {
    if(mriEntityManagerManual != null) mriEntityManagerManual.close();
    mriEntityManagerManual = null;
  }

  @Override
  public void close() throws Exception {
    super.close();
  }

  @Override
  public String toString() {
    return "I'm 'DataProviderJpa' class & 'dataprov' bean :)";
  }

}
