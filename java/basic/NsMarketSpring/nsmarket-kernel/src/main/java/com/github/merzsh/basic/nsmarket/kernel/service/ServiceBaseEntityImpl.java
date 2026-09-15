package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.HashSet;
import java.util.List;
import java.lang.module.FindException;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAggregate;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseAbstractEntity;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntity;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoValidationException;

public abstract class ServiceBaseEntityImpl implements ServiceBaseEntity {
  protected static final String STR_EMPTY = "";

  protected static final String STR_DEFAULT_LANGUAGE = "EN";
  protected final static String STR_TABLE_ID_EMPTY =
      "Entity (table) identifier might not be empty (see argument '%s')!";
  protected static final String STR_UNKNOWN_CLASS_REQUESTED = "Unknown class requested: '%s'";
  protected static final String STR_UNKNOWN_DB_OPERATION = "Unknown DB operation: '%s'!";

  protected static enum CRUD {INSERT, UPDATE, DELETE}

  protected ServiceBaseRec mriEntityId;
  protected DaoAggregate mriDaoLayer;
  protected String mvsLanguage = STR_DEFAULT_LANGUAGE;

  protected Class<?> mrcDaoEntityClass;

  protected abstract ServiceBaseRec copyDaoToSrvRecord(DaoAbstractObject prcDaoEntityRec, String pvsDaoEntityId);

  protected abstract DaoAbstractObject copySrvToDaoRecord(ServiceBaseRec prcSrvEntityRec);

  protected abstract Object convertSrvToDaoId(Object proSrvPrimaryKey);

  protected <T> T findDaoEntity(Class<T> priDaoClass) {
    Set<DaoBaseAbstractEntity> allEntities = new HashSet<DaoBaseAbstractEntity>();
    for(DaoBaseEntity daoEntityData : mriDaoLayer.getDataEntities()) {
      allEntities.add(daoEntityData);
      allEntities.add(mriDaoLayer.getMetadataEntity(daoEntityData));
    }

    T foundEntity = null;
    for(DaoBaseAbstractEntity ent : allEntities) {
      try {
        foundEntity = priDaoClass.cast(ent);
      } catch(ClassCastException ignored) {
      }
    }
    return foundEntity;
  }

  protected Object getDaoEntity(Class<?> priDaoEntity) {
    return findDaoEntity(priDaoEntity);
  }

  protected void saveRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord, CRUD preCrudOp) {
    Objects.requireNonNull(priDaoEntity);
    Objects.requireNonNull(priSrvRecord);
    Objects.requireNonNull(preCrudOp);

    DaoAbstractObject daorec = copySrvToDaoRecord(priSrvRecord);

    switch(preCrudOp) {
      case INSERT:
        priDaoEntity.insertRecord(daorec);
        break;
      case UPDATE:
        priDaoEntity.updateRecord(daorec);
        break;
      case DELETE:
        priDaoEntity.deleteRecord(daorec);
        break;
      default:
        String err = String.format(STR_UNKNOWN_DB_OPERATION, preCrudOp.name());
        System.out.println(err);
        throw new IllegalStateException(err);
    }
  }

  public ServiceBaseEntityImpl(DaoAggregate priDaoLayer, String pvsEntityNamespace, String pvsEntityId, String pvsEntityName) {
    mriDaoLayer = Objects.requireNonNull(priDaoLayer);

    if(Objects.requireNonNull(pvsEntityId).isEmpty())
      throw new IllegalArgumentException(String.format(STR_TABLE_ID_EMPTY, "pvsEntityId"));

    mriEntityId = new ServiceBaseRecImpl(Objects.requireNonNull(pvsEntityNamespace, "pvsEntityNamespace"),
        pvsEntityId, Objects.requireNonNull(pvsEntityName, "pvsEntityName"));
  }

  @Override
  public String getEntityNamespace() {
    return mriEntityId.getNamespace();
  }

  @Override
  public void setEntityNamespace(String pvsEntityNamespace) {
    mriEntityId = new ServiceBaseRecImpl(pvsEntityNamespace, getEntityId(), getEntityName());
  }

  @Override
  public String getEntityId() {
    return mriEntityId.getKeyId();
  }

  @Override
  public void setEntityId(String pvsEntityId) {
    mriEntityId = new ServiceBaseRecImpl(mriEntityId.getNamespace(), pvsEntityId, getEntityName());
  }

  @Override
  public String getEntityName() {
    return mriEntityId.getKeyName();
  }

  @Override
  public void setEntityName(String pvsEntityName) {
    mriEntityId = new ServiceBaseRecImpl(mriEntityId.getNamespace(), getEntityId(), pvsEntityName);
  }

  @Override
  public String getLanguage() {
    return mvsLanguage;
  }

  @Override
  public void setLanguage(String pvsLanguage) {
    mvsLanguage = (pvsLanguage == null) ? STR_EMPTY : pvsLanguage;
  }

  @Override
  public int hashCode() {
    return mriEntityId.hashCode();
  }

  @Override
  public String toString() {
    String result = "Service entity header: {EntityNamespace='%s', EntityId='%s', EntityName='%s'}";
    return String.format(result, getEntityNamespace(), getEntityId(), getEntityName());
  }

  @Override
  public <T extends ServiceBaseRec> Set<T> getRecords(Class<T> priSrvRecordClass) {
    Objects.requireNonNull(priSrvRecordClass);

    Object foundObject = findDaoEntity(mrcDaoEntityClass);
    if(foundObject == null)
      throw new InternalError(String.format(STR_UNKNOWN_CLASS_REQUESTED, mrcDaoEntityClass.getName()));

    DaoBaseAbstractEntity foundEntity = (DaoBaseAbstractEntity) foundObject;

    Set<T> result = new HashSet<T>();

    Set<DaoAbstractObject> daoset = foundEntity.getRecords(DaoAbstractObject.class);

    if(daoset != null) {
      for(DaoAbstractObject daorec : daoset) {
        ServiceBaseRec srvrec = copyDaoToSrvRecord(daorec, foundEntity.getEntityId());
        if(srvrec == null) continue;
        try {
          result.add(priSrvRecordClass.cast(srvrec));
        } catch(ClassCastException ex) {
          throw new IllegalArgumentException(ex);
        }
      }
    }

    return result;
  }

  public <T extends ServiceBaseRec> T getRecById(Class<T> priSrvRecordClass, Object proRecordId) throws FindException {
    Objects.requireNonNull(priSrvRecordClass);
    Objects.requireNonNull(proRecordId);

    T result = null;

    var foundEntity = (DaoBaseAbstractEntity) findDaoEntity(mrcDaoEntityClass);
    if(foundEntity == null)
      throw new InternalError(String.format(STR_UNKNOWN_CLASS_REQUESTED, mrcDaoEntityClass.getName()));

    var daorec = foundEntity.getRecById(DaoAbstractObject.class, convertSrvToDaoId(proRecordId));
    var srvrec = copyDaoToSrvRecord(daorec, foundEntity.getEntityId());
    result = priSrvRecordClass.cast(Objects.requireNonNull(srvrec));

    return result;
  }

  @Override
  public void validateRecord(ServiceBaseRec priSrvRecord) throws ServiceValidationException {
    Objects.requireNonNull(priSrvRecord);

    priSrvRecord.validate();

    DaoAbstractObject lriNewRec = copySrvToDaoRecord(priSrvRecord);
    try {
      lriNewRec.validate();
    } catch(DaoValidationException ex) {
      if(!ex.getValidationRecords().isEmpty()) {
        List<ServiceValidationExceptionRec> result =
            new ArrayList<ServiceValidationExceptionRec>();
        for(var rec : ex.getValidationRecords()) {
          result.add(new ServiceValidationExceptionRec(rec.getFieldId(), rec.getMsgId(),
              rec.getFieldNameId(), rec.getNativeMsg()));
        }
        throw new ServiceValidationException(result);
      }
    }
  }

  @Override
  public void insertRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord) {
    saveRecord(priDaoEntity, priSrvRecord, CRUD.INSERT);
  }

  @Override
  public void updateRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord) {
    saveRecord(priDaoEntity, priSrvRecord, CRUD.UPDATE);
  }

  @Override
  public void deleteRecord(DaoBaseEntity priDaoEntity, ServiceBaseRec priSrvRecord) {
    saveRecord(priDaoEntity, priSrvRecord, CRUD.DELETE);
  }
}
