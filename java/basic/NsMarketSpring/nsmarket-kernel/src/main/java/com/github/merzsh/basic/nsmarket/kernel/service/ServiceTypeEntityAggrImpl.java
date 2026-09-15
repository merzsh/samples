package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class ServiceTypeEntityAggrImpl extends ServiceTypeAggrImpl implements ServiceTypeEntityAggr {
  private static final String STR_UNKNOWN_CLASS_REQUESTED = "Unknown class requested: '%s'";

  protected Map<ServiceBaseEntity, SrvEntityMetadataAbstract> mriServiceEntities =
      new HashMap<ServiceBaseEntity, SrvEntityMetadataAbstract>();

  public ServiceTypeEntityAggrImpl(Map<ServiceBaseEntity, SrvEntityMetadataAbstract> priServiceEntities) {
    Objects.requireNonNull(priServiceEntities, "priServiceEntities");

    for(ServiceBaseEntity key : priServiceEntities.keySet()) {
      SrvEntityMetadataAbstract val = priServiceEntities.get(key);
      mriServiceEntities.put(key, val);
    }
  }

  @Override
  public Set<ServiceBaseEntity> getEntityDataAll() {
    return mriServiceEntities.keySet();
  }

  @Override
  public <T extends ServiceBaseEntity> T getEntityData(Class<T> priSrvEntityClass) throws IllegalArgumentException {
    Set<ServiceBaseEntity> srvDataEntities = mriServiceEntities.keySet();

    for(ServiceBaseEntity srvDataEntity : srvDataEntities) {
      try {
        return priSrvEntityClass.cast(srvDataEntity);
      } catch(ClassCastException ignored) {
      }
    }

    throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, priSrvEntityClass.getName()));
  }

  @Override
  public SrvEntityMetadataAbstract getEntityMetadata(ServiceBaseEntity priSrvEntityData) {
    return mriServiceEntities.get(priSrvEntityData);
  }

}
