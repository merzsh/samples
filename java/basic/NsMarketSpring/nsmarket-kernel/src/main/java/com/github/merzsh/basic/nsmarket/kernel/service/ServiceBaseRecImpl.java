package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import jakarta.validation.Validation;
import jakarta.validation.Validator;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObjectImpl;

public class ServiceBaseRecImpl extends ServiceAbstractObjectImpl implements ServiceBaseRec, AbstractCloneable {
  protected static class ComparatorRowId implements Comparator<ServiceValidationExceptionRec> {
    @Override
    public int compare(ServiceValidationExceptionRec o1, ServiceValidationExceptionRec o2) {
      return o1.getFieldId().compareTo(o2.getFieldId());
    }
  }

  private static final String PROP_NAMESPACE = "abstract";
  private final static String STR_FIELD_ID_EMPTY =
      "Field Id might not be empty (see argument '%s')!";

  protected static final String PROP_FLDNAM_COMMON = "nsm.violation.%s.entity.field.%s.%s";
  protected static final String PROP_FLDMSG_COMMON = "nsm.violation.%s.entity.messg.%s.%s";
  protected static final String PROP_LAYER_PREFIX = "default";
  protected static final String PROP_UNKNOWN_FLD = "dummy_fld";
  protected static final String PROP_UNKNOWN_MSG = "dummy_msg";

  protected DaoAbstractObject mriKeyName;

  protected static final Validator mriValidator =
      Validation.buildDefaultValidatorFactory().getValidator();

  public ServiceBaseRecImpl(String pvsFieldNamespace, String pvsKeyFieldId, String pvsKeyFieldName) {
    super(Objects.requireNonNull(pvsKeyFieldId), Objects.requireNonNull(pvsFieldNamespace));

    if(pvsKeyFieldId.isEmpty())
      throw new IllegalArgumentException(String.format(STR_FIELD_ID_EMPTY, "pvsKeyFieldId"));

    mriKeyName = new DaoAbstractObjectImpl(Objects.requireNonNull(pvsKeyFieldName));
  }

  @Override
  public String getKeyName() {
    return mriKeyName.getKeyId();
  }

  protected void validate(ServiceAbstractObjectImpl obj, String pvsNamespace) throws ServiceValidationException {
    Objects.requireNonNull(obj);
    Objects.requireNonNull(pvsNamespace);

    var viols = mriValidator.validate(obj);
    if(!viols.isEmpty()) {
      List<ServiceValidationExceptionRec> result = new ArrayList<ServiceValidationExceptionRec>();
      String lvsFieldId = "", lvsMsgId = "", lvsFieldNameId = "", lvsNativeMsg = "";
      for(var err : viols) {
        lvsNativeMsg = err.getMessage();
        for(var fld : err.getPropertyPath()) {
          lvsFieldId = fld.getName();
          break;
        }
        // get field & message prefix from annotation message section in format "prefix:message"
        String prefix = PROP_LAYER_PREFIX;

        if((lvsNativeMsg != null) && (!lvsNativeMsg.isEmpty())) {
          String tokens[] = lvsNativeMsg.split(":");
          if(tokens.length == 2) {
            prefix = tokens[0];
            lvsNativeMsg = tokens[1];
          } else {
            lvsNativeMsg = tokens[0];
          }
        } else lvsNativeMsg = PROP_UNKNOWN_MSG;

        if((lvsFieldId == null) || (lvsFieldId.isEmpty())) lvsFieldId = PROP_UNKNOWN_FLD;

        lvsFieldNameId = String.format(PROP_FLDNAM_COMMON, prefix, pvsNamespace, lvsFieldId);
        lvsMsgId = String.format(PROP_FLDMSG_COMMON, prefix, pvsNamespace, lvsNativeMsg);
        result.add(new ServiceValidationExceptionRec(lvsFieldId, lvsMsgId, lvsFieldNameId, lvsNativeMsg));
      }
      result.sort(new ComparatorRowId());
      throw new ServiceValidationException(result);
    }
  }

  @Override
  public void validate() throws ServiceValidationException {
    validate(this, PROP_NAMESPACE);
  }

  @Override
  public boolean equals(Object otherObject) {
    if(!(otherObject instanceof ServiceBaseRecImpl casted)) return false;
    if(this == otherObject) return true;

    return super.equals(casted);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    String result = "Service record header: {KeyId='%s', KeyName='%s'}";
    return String.format(result, getKeyId(), getKeyName());
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      var copy = new ServiceBaseRecImpl(getNamespace(), getKeyId(), getKeyName());
      return priClassToClone.cast(copy);
    } catch(ClassCastException ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
