package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Objects;

public class ServiceValidationExceptionRec {
  protected String mvsFieldId;
  protected String mvsMsgId;
  protected String mvsFieldNameId;
  protected String mvsNativeMsg;

  public ServiceValidationExceptionRec(String pvsFieldId, String pvsMsgId, String pvsFieldNameId, String pvsNativeMsg) {
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

    var casted = (ServiceValidationExceptionRec) otherObject;
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
}
