package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;

public interface DaoManufacturerRec extends DaoAbstractObject {
  public int getId();

  public String getLang();

  public String getCompanyName();

  public String getLegalForm();

  public int getCountryId();
}
