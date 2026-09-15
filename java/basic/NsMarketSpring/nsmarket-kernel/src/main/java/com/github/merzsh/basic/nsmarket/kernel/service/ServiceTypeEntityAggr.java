package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Set;

public interface ServiceTypeEntityAggr extends ServiceTypeAggr {
  public Set<ServiceBaseEntity> getEntityDataAll();

  public <T extends ServiceBaseEntity> T getEntityData(Class<T> priSrvEntityClass) throws IllegalArgumentException;

  public SrvEntityMetadataAbstract getEntityMetadata(ServiceBaseEntity priSrvEntityData);
}
