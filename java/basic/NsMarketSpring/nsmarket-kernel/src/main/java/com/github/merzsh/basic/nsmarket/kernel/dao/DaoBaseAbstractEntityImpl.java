package com.github.merzsh.basic.nsmarket.kernel.dao;

public abstract class DaoBaseAbstractEntityImpl extends DaoAbstractObjectImpl implements DaoBaseAbstractEntity {

  protected static final String STR_OBJNM_ENTITY_ID = "EntityId";

  protected Class<?> mrcJpaEntityClass;

  public DaoBaseAbstractEntityImpl(String pvsEntityId) {
    super(checkStrNull0(pvsEntityId, STR_OBJNM_ENTITY_ID));
  }

  @Override
  public String getEntityId() {
    return mvsKeyId;
  }

  @Override
  public void setEntityId(String pvsEntityId) {
    mvsKeyId = checkStrNull0(pvsEntityId, STR_OBJNM_ENTITY_ID);
  }

  @Override
  public boolean equals(Object otherObject) {
    return super.equals(otherObject);
  }

  @Override
  public String toString() {
    String result = "Dao entity: {%s='%s'}";
    return String.format(result, STR_OBJNM_ENTITY_ID, getKeyId());
  }
}
