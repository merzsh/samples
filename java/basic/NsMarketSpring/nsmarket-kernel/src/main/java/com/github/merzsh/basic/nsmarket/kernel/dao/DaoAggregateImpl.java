package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;
import java.util.Set;
import java.util.HashSet;

import java.util.Map;
import java.util.HashMap;

/**
 * Data source entity level access
 */
public class DaoAggregateImpl implements DaoAggregate {

  private static final String STR_UNKNOWN_CLASS_REQUESTED =
      "Unknown class requested: '%s'";

  protected Map<DaoBaseEntity, DaoMetadataEntity> mriDaoEntities =
      new HashMap<DaoBaseEntity, DaoMetadataEntity>();

  public DaoAggregateImpl(Map<DaoBaseEntity, DaoMetadataEntity> priDaoEntities) {
    Objects.requireNonNull(priDaoEntities, "priDaoEntities");

    for(DaoBaseEntity key : priDaoEntities.keySet()) {
      DaoMetadataEntity val = priDaoEntities.get(key);
      mriDaoEntities.put(key, val);
    }
  }

  public Set<DaoBaseEntity> getDataEntities() {
    return new HashSet<DaoBaseEntity>(mriDaoEntities.keySet());
  }

  @Override
  public <T extends DaoBaseEntity> T getDataEntity(Class<T> priDaoEntityClass) throws IllegalArgumentException {
    Set<DaoBaseEntity> daoDataEntities = mriDaoEntities.keySet();

    for(DaoBaseEntity daoDataEntity : daoDataEntities) {
      try {
        return priDaoEntityClass.cast(daoDataEntity);
      } catch(ClassCastException ignored) {
      }
    }

    throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, priDaoEntityClass.getName()));
  }

  @Override
  public DaoMetadataEntity getMetadataEntity(DaoBaseEntity priDataEntity) {
    return mriDaoEntities.get(priDataEntity);
  }
}
