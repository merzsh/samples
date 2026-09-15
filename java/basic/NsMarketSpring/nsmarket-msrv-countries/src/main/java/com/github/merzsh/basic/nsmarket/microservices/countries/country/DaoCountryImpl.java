package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import java.util.List;
import java.util.Objects;
import java.util.Set;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.github.merzsh.basic.nsmarket.kernel.common.country.DaoCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.common.country.DaoCountryRecImpl;
import com.github.merzsh.basic.nsmarket.kernel.common.country.JpaTabCountries;
import com.github.merzsh.basic.nsmarket.kernel.common.country.JpaTabCountriesPK;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntityImpl;
import com.github.merzsh.basic.nsmarket.kernel.dao.DataProvider;

/**
 * Table level access
 */
@Repository
public class DaoCountryImpl extends DaoBaseEntityImpl implements DaoCountryExt {

  public DaoCountryImpl(DataProvider priDataProvider) {
    super(priDataProvider, "dao_dummy_id");

    mrcJpaEntityClass = JpaTabCountries.class;
  }

  @Override
  protected DaoAbstractObject copyJpaToDaoRecord(Object prcJpaEntityObj) {
    Objects.requireNonNull(prcJpaEntityObj, "prcJpaEntityObj");
    if(!(prcJpaEntityObj instanceof JpaTabCountries))
      throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, prcJpaEntityObj.getClass().getName()));

    JpaTabCountries dbrec = (JpaTabCountries) prcJpaEntityObj;

    DaoCountryRec daorec = new DaoCountryRecImpl(dbrec.getIsoCode().longValue(), dbrec.getLang(),
        dbrec.getIsoCodeAlpha2(), dbrec.getCountryTitleFull(), dbrec.getCountryTitleShort());

    return daorec;
  }

  protected Object copyDaoToJpaRecord(DaoAbstractObject priDaoEntityObj) {
    if(!(Objects.requireNonNull(priDaoEntityObj) instanceof DaoCountryRec))
      throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED, priDaoEntityObj.getClass().getName()));

    DaoCountryRec daorec = (DaoCountryRec) priDaoEntityObj;

    var result = new JpaTabCountries(daorec.getIsoCodeDigital(), daorec.getLang(), daorec.getIsoCodeAplpha2());
    result.setCountryTitleFull(daorec.getCountryName());
    result.setCountryTitleShort(daorec.getCountryNameShort());

    return result;
  }

  @Override
  protected Object convertDaoToJpaId(Object proDaoPrimaryKey) {
    Objects.requireNonNull(proDaoPrimaryKey);
    if(!(proDaoPrimaryKey instanceof String)) throw new IllegalArgumentException("Provided ID is not String instance!");

    Long id_iso = null;
    String id_lang = null;
    var pk = (String) proDaoPrimaryKey;
    String ids[] = pk.split("~");

    if(ids.length >= 1) {
      try {
        id_iso = Long.parseLong(ids[0]);
      } catch(NumberFormatException ex) {
        ex.printStackTrace();
      }
      if(ids.length == 2) {
        id_lang = ids[1];
      }
    }

    var result = new JpaTabCountriesPK();
    result.mviIsoCode = id_iso;
    result.mvsLang = id_lang;
    return result;
  }

  @Override
  public Set<DaoCountryRec> getRecords() {
    return super.getRecords(DaoCountryRec.class);
  }

  @Override
  public DaoCountryRec getRecById(Long pvlIsoCode, String pvsLang) throws EntityNotFoundException {
    String id1 = (pvlIsoCode == null) ? new String() : pvlIsoCode.toString();
    String id2 = (pvsLang == null) ? new String() : pvsLang;

    return super.getRecById(DaoCountryRec.class, id1 + "~" + id2);
  }

  @Override
  public <T extends DaoAbstractObject> T getRecById(Class<T> priDaoRecordClass, Object proRecordId) throws EntityNotFoundException {
    return super.getRecById(priDaoRecordClass, proRecordId);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void insertRecord(DaoCountryRec priDaoCountryRecord) {
    super.insertRecord(priDaoCountryRecord);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void updateRecord(DaoCountryRec priDaoCountryRecord) {
    super.updateRecord(priDaoCountryRecord);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.MANDATORY)
  public void deleteRecord(DaoCountryRec priDaoCountryRecord) {
    super.deleteRecord(priDaoCountryRecord);
  }

  @Override
  @Transactional(transactionManager = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED)
  public void dummy_insert() {
    //Long id2 = Math.round(Math.random()*100);

    if(countAll(JpaTabCountries.class) != 0) return;

    JpaTabCountries tab = null;

    tab = new JpaTabCountries(641L, "EN", "RU");
    tab.setCountryTitleFull("Russian Federation");
    tab.setCountryTitleShort("Russia");
    mriDataProvider.getConnection().persist(tab);

    tab = new JpaTabCountries(641L, "RU", "RU");
    tab.setCountryTitleFull("Российская федерация");
    tab.setCountryTitleShort("Россия");
    mriDataProvider.getConnection().persist(tab);

    tab = new JpaTabCountries(156L, "EN", "CN");
    tab.setCountryTitleFull("Chinese Republic");
    tab.setCountryTitleShort("China");
    mriDataProvider.getConnection().persist(tab);

    tab = new JpaTabCountries(156L, "RU", "CN");
    tab.setCountryTitleFull("Китайская народная республика");
    tab.setCountryTitleShort("Китай");
    mriDataProvider.getConnection().persist(tab);

    tab = new JpaTabCountries(112L, "EN", "BY");
    tab.setCountryTitleFull("Belorussia");
    tab.setCountryTitleShort("Belorussia");
    mriDataProvider.getConnection().persist(tab);

    tab = new JpaTabCountries(112L, "RU", "BY");
    tab.setCountryTitleFull("Белоруссия");
    tab.setCountryTitleShort("Белоруссия");
    mriDataProvider.getConnection().persist(tab);
  }

  @Override
  public void dummy_select() {
    mriDataProvider.openNewConnectionManual();
    try {
      List<JpaTabCountries> lst = selectAll(JpaTabCountries.class, mriDataProvider.getConnectionManual());
      System.out.println("\nSELECT ALL COUNTRIES SQL STATEMENT CONTENTS:");
      for(JpaTabCountries rec : lst) {
        System.out.println(rec);
      }
    } finally {
      mriDataProvider.closeConnectionManual();
    }
  }
}
