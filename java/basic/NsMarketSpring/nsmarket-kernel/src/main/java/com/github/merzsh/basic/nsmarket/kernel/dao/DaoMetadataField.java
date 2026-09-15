package com.github.merzsh.basic.nsmarket.kernel.dao;

public interface DaoMetadataField extends DaoAbstractObject {
  public String getFieldId();

  public boolean isFieldPk();

  public boolean isFieldFk();

  public boolean isNumber();

  public int getFieldMaxLength();
}
