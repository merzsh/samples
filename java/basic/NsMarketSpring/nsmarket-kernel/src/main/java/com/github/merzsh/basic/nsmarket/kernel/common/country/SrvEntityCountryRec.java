package com.github.merzsh.basic.nsmarket.kernel.common.country;

import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRec;

public interface SrvEntityCountryRec extends ServiceBaseRec {
  public int getIsoCodeDigital();

  public String getIsoCodeAplpha2();

  public String getCountryName();

  public String getCountryNameShort();
}
