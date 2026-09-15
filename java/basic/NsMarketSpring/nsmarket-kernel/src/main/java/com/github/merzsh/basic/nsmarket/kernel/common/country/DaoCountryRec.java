package com.github.merzsh.basic.nsmarket.kernel.common.country;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;

public interface DaoCountryRec extends DaoAbstractObject {
  public long getIsoCodeDigital();

  public String getLang();

  public String getIsoCodeAplpha2();

  public String getCountryName();

  public String getCountryNameShort();
}
