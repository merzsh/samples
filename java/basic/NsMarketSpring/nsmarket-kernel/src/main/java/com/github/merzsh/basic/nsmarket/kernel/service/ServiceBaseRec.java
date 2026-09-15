package com.github.merzsh.basic.nsmarket.kernel.service;

public interface ServiceBaseRec extends ServiceAbstractObject {
  public String getKeyName();

  public void validate() throws ServiceValidationException;
}
