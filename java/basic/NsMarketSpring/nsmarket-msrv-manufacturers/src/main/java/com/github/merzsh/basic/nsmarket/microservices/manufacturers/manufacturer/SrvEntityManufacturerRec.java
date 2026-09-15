package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRec;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;

public interface SrvEntityManufacturerRec extends ServiceBaseRec {
  public int getId();

  public String getCompanyName();

  public String getLegalForm();

  public SrvEntityCountryRec getCountry();

  public void setCountry(SrvEntityCountryRec priRec);
}
