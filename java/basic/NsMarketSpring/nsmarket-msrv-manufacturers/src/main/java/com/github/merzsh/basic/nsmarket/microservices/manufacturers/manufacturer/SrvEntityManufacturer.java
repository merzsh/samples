package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import jakarta.persistence.EntityNotFoundException;

import java.util.Set;

import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseEntity;


public interface SrvEntityManufacturer extends ServiceBaseEntity {
  public Set<SrvEntityManufacturerRec> getRecords();

  public SrvEntityManufacturerRec getRecById(int pviManufacturerId) throws EntityNotFoundException;

  public void insertRecord(SrvEntityManufacturerRec priSrvManufacturerRecord);

  public void updateRecord(SrvEntityManufacturerRec priSrvManufacturerRecord);

  public void deleteRecord(SrvEntityManufacturerRec priSrvManufacturerRecord);
}
