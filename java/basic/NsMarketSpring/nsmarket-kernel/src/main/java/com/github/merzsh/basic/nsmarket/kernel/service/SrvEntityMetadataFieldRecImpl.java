package com.github.merzsh.basic.nsmarket.kernel.service;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;

public class SrvEntityMetadataFieldRecImpl extends ServiceBaseRecImpl
    implements SrvEntityMetadataFieldRec, AbstractCloneable {

  private final static String STR_FIELD_LENGTH_ZERO =
      "Field length might not be zero (see argument '%s')!";

  protected boolean mvbFieldIsPk;
  protected boolean mvbFieldIsFk;
  protected boolean mvbIsNumber;
  protected int mviFieldMaxLength;

  public SrvEntityMetadataFieldRecImpl(String pvsFieldNamespace, String pvsFieldId, String pvsFieldName,
                                       boolean pvbFieldIsPk, boolean pvbFieldIsFk, boolean pvbIsNumber, int pviFieldMaxLength) {

    super(pvsFieldNamespace, pvsFieldId, pvsFieldName);

    if(pviFieldMaxLength <= 0)
      throw new IllegalArgumentException(String.format(STR_FIELD_LENGTH_ZERO, "pviFieldMaxLength"));

    mvbFieldIsPk = pvbFieldIsPk;
    mvbFieldIsFk = pvbFieldIsFk;
    mvbIsNumber = pvbIsNumber;
    mviFieldMaxLength = pviFieldMaxLength;
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
    if(!(otherObject instanceof SrvEntityMetadataFieldRecImpl casted)) return false;
    if(this == otherObject) return true;

    return super.equals(casted);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    String result = "Service field metadata: {FieldNamespace='%s', FieldId='%s', FieldName='%s', IsPK='%b', IsFK='%b', IsNumber='%b', FieldMaxLength='%d'}";
    return String.format(result, getNamespace(), getKeyId(), getKeyName(), mvbFieldIsPk, mvbFieldIsFk, mvbIsNumber, mviFieldMaxLength);
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(new SrvEntityMetadataFieldRecImpl(getNamespace(), getKeyId(),
          getKeyName(), mvbFieldIsPk, mvbFieldIsFk, mvbIsNumber, mviFieldMaxLength));
      //return priClassToClone.cast( super.clone() );
    } catch(ClassCastException /*| CloneNotSupportedException*/ ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
