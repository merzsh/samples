package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Objects;
import java.util.Set;
import java.util.HashSet;

/**
 * Business entity level access
 */
public class ServiceAggregateImpl implements ServiceAggregate {
  private static final String STR_UNKNOWN_CLASS_REQUESTED =
      "Unknown class requested: '%s'";

  protected Set<ServiceTypeAggr> mriServiceTypes =
      new HashSet<ServiceTypeAggr>();

  public ServiceAggregateImpl(Set<ServiceTypeAggr> priServiceTypes) {
    Objects.requireNonNull(priServiceTypes, "priServiceTypes");

    mriServiceTypes.addAll(priServiceTypes);
  }

  @Override
  public <T extends ServiceTypeAggr> T getServiceType(Class<T> priSrvTypeClass) throws IllegalArgumentException {
    Objects.requireNonNull(priSrvTypeClass, "priSrvTypeClass");

    for(ServiceTypeAggr key : mriServiceTypes) {
      try {
        return priSrvTypeClass.cast(key);
      } catch(ClassCastException ex) {
      }
    }

    throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, priSrvTypeClass.getName()));
  }
}
