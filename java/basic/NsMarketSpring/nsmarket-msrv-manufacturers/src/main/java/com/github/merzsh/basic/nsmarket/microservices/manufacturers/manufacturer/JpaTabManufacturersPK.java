package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import java.io.Serializable;

public class JpaTabManufacturersPK implements Serializable {
  private static final long serialVersionUID = 1L;

  // Country ISO-code
  public Long mvcId;

  // Text fields language
  public String mvsLang;
}
