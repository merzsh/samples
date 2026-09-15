package com.github.merzsh.basic.nsmarket.kernel.dao;

public interface DaoAbstractObject {
  public String getKeyId();

  public void validate() throws DaoValidationException;
}
