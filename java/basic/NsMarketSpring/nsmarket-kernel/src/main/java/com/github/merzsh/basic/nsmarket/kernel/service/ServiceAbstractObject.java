package com.github.merzsh.basic.nsmarket.kernel.service;

public interface ServiceAbstractObject {
  public String getKeyId();

  // Source DAO entity names (for service record, in case it consists of several DAO entities records)
  public String getNamespace();
}
