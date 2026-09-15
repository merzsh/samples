package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Set;

public interface DaoAggregate {
  public Set<DaoBaseEntity> getDataEntities();

  public <T extends DaoBaseEntity> T getDataEntity(Class<T> priDaoEntityClass) throws IllegalArgumentException;

  public DaoMetadataEntity getMetadataEntity(DaoBaseEntity priDataEntity);
}
