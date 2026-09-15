package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import java.util.Set;

import jakarta.persistence.EntityNotFoundException;

import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseEntity;


public interface SrvEntityCountry extends ServiceBaseEntity {
  public Set<SrvEntityCountryRec> getRecords();

  public SrvEntityCountryRec getRecById(int pviIsoCodeId) throws EntityNotFoundException;

  public void insertRecord(SrvEntityCountryRec priSrvCountryRecord);

  public void updateRecord(SrvEntityCountryRec priSrvCountryRecord);

  public void deleteRecord(SrvEntityCountryRec priSrvCountryRecord);
}
