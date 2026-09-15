package com.github.merzsh.basic.nsmarket.kernel.service;

public interface ServiceBaseRecRest {
  public <T> T copyRecord(Class<T> prcDestRecordClass, Object prcSrcRecord);
}
