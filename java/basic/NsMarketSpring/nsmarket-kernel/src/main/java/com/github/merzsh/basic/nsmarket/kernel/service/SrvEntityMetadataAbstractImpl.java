package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Map;
import java.util.HashMap;
import java.util.Objects;
import java.util.Set;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAggregate;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoMetadataField;

public abstract class SrvEntityMetadataAbstractImpl extends ServiceBaseEntityImpl implements SrvEntityMetadataAbstract {
  protected Map<String, String> mriTables = new HashMap<String, String>();
  protected Map<String, String> mriFieldNames = new HashMap<String, String>();

  protected abstract DaoMetadataField processSrcRecord(DaoMetadataField priDaoSrcRecord);

  @Override
  protected ServiceBaseRec copyDaoToSrvRecord(DaoAbstractObject prcDaoEntityRec, String pvsDaoEntityId) {
    Objects.requireNonNull(prcDaoEntityRec, "prcDaoEntityRec");
    if(!(prcDaoEntityRec instanceof DaoMetadataField daorec))
      throw new IllegalArgumentException(String.format(STR_UNKNOWN_CLASS_REQUESTED,
          prcDaoEntityRec.getClass().getName()));

    if(processSrcRecord(daorec) == null) return null;

    return new SrvEntityMetadataFieldRecImpl(pvsDaoEntityId == null ? "" : pvsDaoEntityId,
        daorec.getFieldId(), getFieldName(daorec.getFieldId()), daorec.isFieldPk(),
        daorec.isFieldFk(), daorec.isNumber(), daorec.getFieldMaxLength());
  }

  public SrvEntityMetadataAbstractImpl(DaoAggregate priDaoLayer, String pvsEntityNamespace, String pvsEntityId, String pvsEntityName) {
    super(priDaoLayer, pvsEntityNamespace, pvsEntityId, pvsEntityName);
  }

  @Override
  public Set<String> getTabelsId() {
    return mriTables.keySet();
  }

  @Override
  public String getTableName(String pvsTableId) {
    Objects.requireNonNull(pvsTableId, "pvsTableId");

    return mriTables.get(pvsTableId);
  }

  @Override
  public Set<String> getFieldsId() {
    return mriFieldNames.keySet();
  }

  @Override
  public String getFieldName(String pvsFieldId) {
    return mriFieldNames.get(pvsFieldId);
  }

  @Override
  public String toString() {
    String result = "Service entity metadata header: {EntityNamespace='%s', EntityId='%s', EntityName='%s', DbTableId='%s', DbTableName='%s'}";
    return String.format(result, getEntityNamespace(), getEntityId(), getEntityName(),
        getTabelsId().iterator().next(), getTableName(getTabelsId().iterator().next()));
  }

  @Override
  public Set<SrvEntityMetadataFieldRec> getRecords() {
    return getRecords(SrvEntityMetadataFieldRec.class);
  }
}
