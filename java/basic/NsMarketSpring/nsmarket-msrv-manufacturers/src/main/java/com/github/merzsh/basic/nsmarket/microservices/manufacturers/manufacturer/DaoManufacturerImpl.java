package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import jakarta.persistence.EntityNotFoundException;

import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntityImpl;
import com.github.merzsh.basic.nsmarket.kernel.dao.DataProvider;

@Repository
public class DaoManufacturerImpl extends DaoBaseEntityImpl implements DaoManufacturerExt {

  public DaoManufacturerImpl(DataProvider priDataProvider) {
    super(priDataProvider, "dao_dummy_id");

    mrcJpaEntityClass = JpaTabManufacturers.class;
  }

  @Override
  protected DaoAbstractObject copyJpaToDaoRecord(Object prcJpaEntityObj) {
    Objects.requireNonNull(prcJpaEntityObj, "prcJpaEntityObj");
    if(!(prcJpaEntityObj instanceof JpaTabManufacturers dbrec))
      throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, prcJpaEntityObj.getClass().getName()));

    return new DaoManufacturerRecImpl(
        dbrec.getId().intValue(), dbrec.getLang(), dbrec.getCompanyName(), dbrec.getLegalForm(), dbrec.getCountryId().intValue());
  }

  protected Object copyDaoToJpaRecord(DaoAbstractObject priDaoEntityObj) {
    if(!(Objects.requireNonNull(priDaoEntityObj) instanceof DaoManufacturerRec))
      throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, priDaoEntityObj.getClass().getName()));

    DaoManufacturerRec daorec = (DaoManufacturerRec) priDaoEntityObj;

    return new JpaTabManufacturers((long) daorec.getId(), daorec.getLang(), daorec.getCompanyName(), daorec.getLegalForm(), (long) daorec.getCountryId());
  }

  @Override
  protected Object convertDaoToJpaId(Object proDaoPrimaryKey) {
    Objects.requireNonNull(proDaoPrimaryKey);
    if(!(proDaoPrimaryKey instanceof String pk))
      throw new IllegalArgumentException("Provided ID is not String instance!");

    Long id_num = null;
    String id_lang = null;
    String[] ids = pk.split("~");

    if(ids.length >= 1) {
      try {
        id_num = Long.parseLong(ids[0]);
      } catch(NumberFormatException ex) {
        ex.printStackTrace();
      }
      if(ids.length == 2) {
        id_lang = ids[1];
      }
    }

    var result = new JpaTabManufacturersPK();
    result.mvcId = id_num;
    result.mvsLang = id_lang;
    return result;
  }

  @Override
  public Set<DaoManufacturerRec> getRecords() {
    return super.getRecords(DaoManufacturerRec.class);
  }

  @Override
  public DaoManufacturerRec getRecById(Long pvlManufacturerId, String pvsLang) throws EntityNotFoundException {
    String id1 = (pvlManufacturerId == null) ? "" : pvlManufacturerId.toString();
    String id2 = (pvsLang == null) ? "" : pvsLang;

    return super.getRecById(DaoManufacturerRec.class, id1 + "~" + id2);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void insertRecord(DaoManufacturerRec priDaoManufacturerRecord) {
    super.insertRecord(priDaoManufacturerRecord);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void updateRecord(DaoManufacturerRec priDaoManufacturerRecord) {
    super.updateRecord(priDaoManufacturerRecord);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void deleteRecord(DaoManufacturerRec priDaoManufacturerRecord) {
    super.updateRecord(priDaoManufacturerRecord);
  }
}
