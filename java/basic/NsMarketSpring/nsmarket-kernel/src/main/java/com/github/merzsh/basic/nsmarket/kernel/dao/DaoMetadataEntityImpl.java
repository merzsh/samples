package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;

public abstract class DaoMetadataEntityImpl extends DaoBaseAbstractEntityImpl implements DaoMetadataEntity {

  protected String mvsTableId;

  public DaoMetadataEntityImpl(String pvsEntityId, String pvsTableId) {
    super(pvsEntityId);

    mvsTableId = Objects.requireNonNull(pvsTableId);
  }

  @Override
  public String getTableId() {
    return mvsTableId;
  }
}
