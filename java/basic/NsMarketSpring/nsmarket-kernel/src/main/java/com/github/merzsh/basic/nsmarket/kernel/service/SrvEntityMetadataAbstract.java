package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Set;

public interface SrvEntityMetadataAbstract extends ServiceBaseEntity {
  public Set<String> getTabelsId();

  public String getTableName(String pvsTableId);

  public Set<String> getFieldsId();

  public String getFieldName(String pvsFieldId);

  public Set<SrvEntityMetadataFieldRec> getRecords();
}
