package com.github.merzsh.basic.nsmarket.kernel.service;

public interface ServiceAggregate {
  public <T extends ServiceTypeAggr> T getServiceType(Class<T> priSrvTypeClass) throws IllegalArgumentException;
}
