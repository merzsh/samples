package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import java.util.Set;

import jakarta.persistence.EntityNotFoundException;

import com.github.merzsh.basic.nsmarket.kernel.common.country.DaoCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntity;

public interface DaoCountryExt extends DaoBaseEntity {
  public Set<DaoCountryRec> getRecords();

  public DaoCountryRec getRecById(Long pvlIsoCode, String pvsLang) throws EntityNotFoundException;

  public void insertRecord(DaoCountryRec priDaoCountryRecord);

  public void updateRecord(DaoCountryRec priDaoCountryRecord);

  public void deleteRecord(DaoCountryRec priDaoCountryRecord);

  public void dummy_insert();

  public void dummy_select();
}
