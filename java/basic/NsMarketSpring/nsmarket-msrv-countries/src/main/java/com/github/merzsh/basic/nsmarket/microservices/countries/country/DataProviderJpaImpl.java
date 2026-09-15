package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Component;

import com.github.merzsh.basic.nsmarket.kernel.dao.DataProviderJpa;

@Component
public class DataProviderJpaImpl extends DataProviderJpa {
  @PersistenceContext
  protected EntityManager mriTransactionalEntityManager;

  public DataProviderJpaImpl(EntityManagerFactory priFactory) {
    super(priFactory);
    // TODO Auto-generated constructor stub
  }

  @Override
  public EntityManager getConnection() {
    return mriTransactionalEntityManager;
  }
}
