package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;

public class DaoValidationExceptionRec implements AbstractCloneable, Cloneable {

  protected String mvsFieldId;
  protected String mvsMsgId;
  protected String mvsFieldNameId;
  protected String mvsNativeMsg;

  public DaoValidationExceptionRec(String pvsFieldId, String pvsMsgId, String pvsFieldNameId, String pvsNativeMsg) {
    if((pvsFieldId != null) && (!pvsFieldId.isEmpty())) mvsFieldId = pvsFieldId;
    else throw new IllegalArgumentException("pvsFieldId");

    if((pvsMsgId != null) && (!pvsMsgId.isEmpty())) mvsMsgId = pvsMsgId;
    else throw new IllegalArgumentException("pvsMsgId");

    mvsFieldNameId = (pvsFieldNameId != null) ? pvsFieldNameId : "";
    mvsNativeMsg = (pvsNativeMsg != null) ? pvsNativeMsg : "";
  }

  public String getFieldId() {
    return mvsFieldId;
  }

  public String getMsgId() {
    return mvsMsgId;
  }

  public String getFieldNameId() {
    return mvsFieldNameId;
  }

  public String getNativeMsg() {
    return mvsNativeMsg;
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || getClass() != otherObject.getClass()) return false;
    if(this == otherObject) return true;

    var casted = (DaoValidationExceptionRec) otherObject;
    return Objects.equals(mvsFieldId, casted.getFieldId()) && Objects.equals(mvsMsgId, casted.getMsgId());
  }

  @Override
  public int hashCode() {
    return Objects.hash(mvsFieldId, mvsMsgId);
  }

  @Override
  public String toString() {
    String result = "Validation exception record: {FieldId='%s', MsgId='%s', FieldNameId='%s', NativeMsg='%s'}";
    return String.format(result, mvsFieldId, mvsMsgId, mvsFieldNameId, mvsNativeMsg);
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(super.clone());
      //return priClassToClone.cast( new DaoCountryRecImpl(mvlIsoCode, mvsLang, mvsIsoCode, mvsCountryName, mvsCountryNameShort) );
    } catch(ClassCastException | CloneNotSupportedException ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
