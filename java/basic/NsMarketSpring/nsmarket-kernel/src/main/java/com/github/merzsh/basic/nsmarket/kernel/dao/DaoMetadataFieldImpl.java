package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;

public class DaoMetadataFieldImpl extends DaoAbstractObjectImpl implements DaoMetadataField, AbstractCloneable, Cloneable {

  private final static String STR_FIELD_NAME_EMPTY =
      "Field name might not be empty (see argument '%s')!";
  private final static String STR_FIELD_LENGTH_ZERO =
      "Field length might not be zero (see argument '%s')!";

  protected boolean mvbFieldIsPk;
  protected boolean mvbFieldIsFk;
  protected boolean mvbIsNumber;
  protected int mviFieldMaxLength;

  public DaoMetadataFieldImpl(String pvsFieldId, boolean pvbFieldIsPk, boolean pvbFieldIsFk, boolean pvbIsNumber, int pviFieldMaxLength) {
    super(pvsFieldId);

    // TO-DO: have to be implemented by reflection to read entity annotations
    Objects.requireNonNull(pvsFieldId, "pvsFieldId");
    if(pvsFieldId.length() == 0)
      throw new IllegalArgumentException(String.format(STR_FIELD_NAME_EMPTY, "pvsFieldId"));
    if(pviFieldMaxLength <= 0)
      throw new IllegalArgumentException(String.format(STR_FIELD_LENGTH_ZERO, "pviFieldMaxLength"));

    mvbFieldIsPk = pvbFieldIsPk;
    mvbFieldIsFk = pvbFieldIsFk;
    mvbIsNumber = pvbIsNumber;
    mviFieldMaxLength = pviFieldMaxLength;
  }

  @Override
  public String getFieldId() {
    return mvsKeyId;
  }

  @Override
  public boolean isFieldPk() {
    return mvbFieldIsPk;
  }

  @Override
  public boolean isFieldFk() {
    return mvbFieldIsFk;
  }

  @Override
  public boolean isNumber() {
    return mvbIsNumber;
  }

  @Override
  public int getFieldMaxLength() {
    return mviFieldMaxLength;
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || getClass() != otherObject.getClass()) return false;
    if(this == otherObject) return true;

    var casted = (DaoMetadataFieldImpl) otherObject;
    return Objects.equals(mvsKeyId, casted.getFieldId());
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    String result = "Field metadata: {FieldId='%s', IsPK='%b', IsFK='%b', IsNumber='%b', FieldMaxLength='%d'}";
    return String.format(result, mvsKeyId, mvbFieldIsPk, mvbFieldIsFk, mvbIsNumber, mviFieldMaxLength);
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(super.clone());
    } catch(ClassCastException | CloneNotSupportedException ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
