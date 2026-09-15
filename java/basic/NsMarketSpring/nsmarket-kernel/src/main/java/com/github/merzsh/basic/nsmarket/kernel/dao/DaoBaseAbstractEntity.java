package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.lang.module.FindException;
import java.util.Set;

public interface DaoBaseAbstractEntity extends DaoAbstractObject {
  public String getEntityId();

  public void setEntityId(String pvsTableId);

  public <T extends DaoAbstractObject> Set<T> getRecords(Class<T> priDaoRecordClass);

  public <T extends DaoAbstractObject> T getRecById(Class<T> priDaoRecordClass, Object proRecordId) throws FindException;

  public void insertRecord(DaoAbstractObject priDaoRecord);

  public void updateRecord(DaoAbstractObject priDaoRecord);

  public void deleteRecord(DaoAbstractObject priDaoRecord);
}
