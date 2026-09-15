package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.lang.module.FindException;
import java.util.HashSet;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

public abstract class DaoBaseEntityImpl extends DaoBaseAbstractEntityImpl implements DaoBaseEntity {

  protected static final String STR_OBJNM_DATAPROV = "DataProvider";
  protected static final String STR_OBJNM_TYPE = "Type";
  protected static final String STR_OBJNM_PKEY_JPA = "PkeyJpa";
  protected static final String STR_OBJNM_PKEY_DAO_REC = "PkeyDaoRec";
  protected static final String STR_OBJNM_DAO_RECORD = "DaoRecord";
  protected static final String STR_OBJNM_CONN = "Connection";
  protected static final String STR_OBJNM_DAOREC_CLASS = "DaoRecordClass";
  protected static final String STR_UNKNOWN_CLASS_REQUESTED = "Unknown class requested: '%s'";
  protected static final String STR_RECORD_WAS_NOT_FOUND = "Record with ID='%s' was not found in entity '%s'.";

  protected DataProvider mriDataProvider;

  protected <T> long countAll(Class<T> prcType) {
    Objects.requireNonNull(prcType, STR_OBJNM_TYPE);

    Long result = null;

    try {
      CriteriaBuilder cb = mriDataProvider.getConnection().getCriteriaBuilder();
      CriteriaQuery<Long> query = cb.createQuery(Long.class);
      Root<T> root = query.from(prcType);
      query.select(cb.count(root));

      result = mriDataProvider.getConnection().createQuery(query).getSingleResult();
    } finally {
      //mriDataProvider.closeConnection();
    }

    return result;
  }

  protected <T> List<T> selectAll(Class<T> prcType, EntityManager priConnection) {
    Objects.requireNonNull(prcType, STR_OBJNM_TYPE);
    Objects.requireNonNull(priConnection, STR_OBJNM_CONN);

    List<T> result = null;

    try {
      CriteriaBuilder cb = priConnection.getCriteriaBuilder();
      CriteriaQuery<T> query = cb.createQuery(prcType);
      Root<T> root = query.from(prcType);
      query.select(root);

      result = priConnection.createQuery(query).getResultList();
    } finally {
    }

    return result;
  }

  protected <T> T selectById(Class<T> prcType, Object proPrimaryKeyJpa) {
    Objects.requireNonNull(prcType, STR_OBJNM_TYPE);
    Objects.requireNonNull(proPrimaryKeyJpa, STR_OBJNM_PKEY_JPA);

    return mriDataProvider.getConnection().find(prcType, proPrimaryKeyJpa);
  }

  protected void setJpaEntityClass(Class<?> pClass) {
    Objects.requireNonNull(pClass);
    mrcJpaEntityClass = pClass;
  }

  protected abstract DaoAbstractObject copyJpaToDaoRecord(Object prcJpaEntityObj);

  protected abstract Object copyDaoToJpaRecord(DaoAbstractObject priDaoEntityObj);

  protected abstract Object convertDaoToJpaId(Object proDaoPrimaryKey);

  public DaoBaseEntityImpl(DataProvider priDataProvider, String pvsEntityId) {
    super(pvsEntityId);
    mriDataProvider = Objects.requireNonNull(priDataProvider, STR_OBJNM_DATAPROV);
  }

  @Override
  public DataProvider getDataProvider() {
    return mriDataProvider;
  }

  @Override
  public <T extends DaoAbstractObject> Set<T> getRecords(Class<T> priDaoRecordClass) {
    Objects.requireNonNull(priDaoRecordClass, STR_OBJNM_DAOREC_CLASS);

    Set<T> result = new HashSet<T>();

    // used for LAZY loading of linked entities & to avoid EAGR loading in copyJpaToDaoRecord() method
    mriDataProvider.openNewConnectionManual();
    try {
      List<?> dblist = selectAll(mrcJpaEntityClass, mriDataProvider.getConnectionManual());
      if(dblist != null) {
        for(Object dbrec : dblist) {
          DaoAbstractObject daorec = copyJpaToDaoRecord(dbrec);
          try {
            result.add(priDaoRecordClass.cast(daorec));
          } catch(ClassCastException ex) {
            throw new IllegalArgumentException(ex);
          }
        }
      }
    } finally {
      mriDataProvider.closeConnectionManual();
    }
    return result;
  }

  @Override
  public <T extends DaoAbstractObject> T getRecById(Class<T> priDaoRecordClass, Object proPkeyDaoRec) throws FindException {
    Objects.requireNonNull(priDaoRecordClass, STR_OBJNM_DAOREC_CLASS);
    Objects.requireNonNull(proPkeyDaoRec, STR_OBJNM_PKEY_DAO_REC);

    Object dbrec = selectById(mrcJpaEntityClass, convertDaoToJpaId(proPkeyDaoRec));
    if(dbrec != null) {
      DaoAbstractObject result = copyJpaToDaoRecord(dbrec);
      try {
        return priDaoRecordClass.cast(result);
      } catch(ClassCastException ex) {
        throw new IllegalArgumentException(ex);
      }
    } else throw new FindException(String.format(STR_RECORD_WAS_NOT_FOUND, proPkeyDaoRec, mrcJpaEntityClass.getName()));
  }

  @Override
  public void insertRecord(DaoAbstractObject priDaoRecord) {
    Objects.requireNonNull(priDaoRecord, STR_OBJNM_DAO_RECORD);

    Object jparec = copyDaoToJpaRecord(priDaoRecord);
    mriDataProvider.getConnection().persist(jparec);
  }

  @Override
  public void updateRecord(DaoAbstractObject priDaoRecord) {
    Objects.requireNonNull(priDaoRecord, STR_OBJNM_DAO_RECORD);

    Object jparec = copyDaoToJpaRecord(priDaoRecord);
    mriDataProvider.getConnection().merge(jparec);
  }

  @Override
  public void deleteRecord(DaoAbstractObject priDaoRecord) {
    Objects.requireNonNull(priDaoRecord, STR_OBJNM_DAO_RECORD);

    Object jparec = copyDaoToJpaRecord(priDaoRecord);
    jparec = mriDataProvider.getConnection().contains(jparec) ? jparec : mriDataProvider.getConnection().merge(jparec);

    mriDataProvider.getConnection().remove(jparec);
  }
}
