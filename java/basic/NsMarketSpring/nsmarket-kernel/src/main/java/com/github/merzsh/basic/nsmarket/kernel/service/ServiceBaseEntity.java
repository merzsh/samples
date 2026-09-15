package com.github.merzsh.basic.nsmarket.kernel.service;

import java.lang.module.FindException;
import java.util.Set;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntity;

public interface ServiceBaseEntity {
  public String getEntityNamespace();

  public void setEntityNamespace(String pvsEntityNamespace);

  public String getEntityId();

  public void setEntityId(String pvsEntityId);

  public String getEntityName();

  public void setEntityName(String pvsEntityName);

  public String getLanguage();

  public void setLanguage(String pvsLanguage);

  public <T extends ServiceBaseRec> Set<T> getRecords(Class<T> priSrvRecordClass);

  public <T extends ServiceBaseRec> T getRecById(Class<T> priSrvRecordClass, Object proRecordId) throws FindException;

  public void validateRecord(ServiceBaseRec priSrvRecord) throws ServiceValidationException;

  public void insertRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord);

  public void updateRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord);

  public void deleteRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord);
}
