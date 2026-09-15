package com.github.merzsh.basic.nsmarket.kernel.service;

public interface SrvEntityMetadataFieldRec extends ServiceBaseRec {
  public boolean isFieldPk();

  public boolean isFieldFk();

  public boolean isNumber();

  public int getFieldMaxLength();
}
