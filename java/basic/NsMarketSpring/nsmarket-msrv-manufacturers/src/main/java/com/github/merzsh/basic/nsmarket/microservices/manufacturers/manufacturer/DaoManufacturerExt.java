package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import jakarta.persistence.EntityNotFoundException;

import java.util.Set;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoBaseEntity;

public interface DaoManufacturerExt extends DaoBaseEntity {
  public Set<DaoManufacturerRec> getRecords();

  public DaoManufacturerRec getRecById(Long pvlManufacturerId, String pvsLang) throws EntityNotFoundException;

  public void insertRecord(DaoManufacturerRec priDaoManufacturerRecord);

  public void updateRecord(DaoManufacturerRec priDaoManufacturerRecord);

  public void deleteRecord(DaoManufacturerRec priDaoManufacturerRecord);
}
