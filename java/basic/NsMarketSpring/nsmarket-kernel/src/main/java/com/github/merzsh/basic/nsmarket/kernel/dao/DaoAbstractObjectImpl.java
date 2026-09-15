package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.Objects;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
//import jakarta.validation.constraints.Pattern;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;

public class DaoAbstractObjectImpl implements DaoAbstractObject, AbstractCloneable, Cloneable {

  protected static class ComparatorFieldId implements Comparator<DaoValidationExceptionRec> {
    @Override
    public int compare(DaoValidationExceptionRec o1, DaoValidationExceptionRec o2) {
      return o1.getFieldId().compareTo(o2.getFieldId());
    }
  }

  protected static final String STR_EMPTY = new String();
	
	/*protected static final String STR_OBJNM_PREFIX_ARG_IFACE	= "pri";
	protected static final String STR_OBJNM_PREFIX_ARG_CLASS	= "prc";
	protected static final String STR_OBJNM_PREFIX_ARG_STRNG	= "pvs";*/

  protected static final String STR_OBJNM_KEYID = "KeyId";

  protected static final String STR_ARG_ERTMPL = "Wrong argument '%s': %s.";
  protected static final String STR_ARG_ISNUL = "'null' value, object expected";
  protected static final String STR_ARG_LENG0 = "zero length, one symbol at least expected";

  protected static final String PROP_NAMESPACE = "abstract";

  protected static final String PROP_FLDNAM_COMMON = "nsm.violation.%s.entity.field.%s.%s";
  protected static final String PROP_FLDMSG_COMMON = "nsm.violation.%s.entity.messg.%s.%s";
  protected static final String PROP_LAYER_PREFIX = "default";
  protected static final String PROP_UNKNOWN_FLD = "dummy_fld";
  protected static final String PROP_UNKNOWN_MSG = "dummy_msg";

  protected static final Validator mriValidator = Validation.buildDefaultValidatorFactory().getValidator();

  protected static String checkStrNull0(String pCheckedValue, String pArgName) throws NullPointerException, IllegalArgumentException {
    pArgName = pArgName == null ? "?" : pArgName;

    Objects.requireNonNull(pCheckedValue, String.format(STR_ARG_ERTMPL, pArgName, STR_ARG_ISNUL));
    if(pCheckedValue.length() == 0)
      throw new IllegalArgumentException(String.format(STR_ARG_ERTMPL, pArgName, STR_ARG_LENG0));
    return pCheckedValue;
  }


  //@Pattern(regexp="[A-Z]", message="dao:illegal_pattern")
  @NotNull(message = "field_is_null")
  protected String mvsKeyId;

  public DaoAbstractObjectImpl() {
    // some default id
    mvsKeyId = Objects.requireNonNull(String.valueOf(super.hashCode()));
  }

  public DaoAbstractObjectImpl(String pvsKeyId) {
    mvsKeyId = checkStrNull0(pvsKeyId, STR_OBJNM_KEYID);
  }

  @Override
  public String getKeyId() {
    return mvsKeyId;
  }

  protected void validate(DaoAbstractObjectImpl obj, String pvsNamespace) throws DaoValidationException {
    Objects.requireNonNull(obj);
    Objects.requireNonNull(pvsNamespace);

    var viols = mriValidator.validate(obj);
    if(!viols.isEmpty()) {
      List<DaoValidationExceptionRec> result = new ArrayList<DaoValidationExceptionRec>();
      String lvsFieldId = "", lvsMsgId = "", lvsFieldNameId = "", lvsNativeMsg = "";
      for(var err : viols) {
        lvsNativeMsg = err.getMessage();
        for(var fld : err.getPropertyPath()) {
          lvsFieldId = fld.getName();
          break;
        }
        // get field & message prefix from annotation message section in format "prefix:message"
        String prefix = PROP_LAYER_PREFIX;

        if((lvsNativeMsg != null) && (lvsNativeMsg.length() != 0)) {
          String tokens[] = lvsNativeMsg.split(":");
          if(tokens.length == 2) {
            prefix = tokens[0];
            lvsNativeMsg = tokens[1];
          } else {
            lvsNativeMsg = tokens[0];
          }
        } else lvsNativeMsg = PROP_UNKNOWN_MSG;

        if((lvsFieldId == null) || (lvsFieldId.length() == 0)) lvsFieldId = PROP_UNKNOWN_FLD;

        lvsFieldNameId = String.format(PROP_FLDNAM_COMMON, prefix, pvsNamespace, lvsFieldId);
        lvsMsgId = String.format(PROP_FLDMSG_COMMON, prefix, pvsNamespace, lvsNativeMsg);
        result.add(new DaoValidationExceptionRec(lvsFieldId, lvsMsgId, lvsFieldNameId, lvsNativeMsg));
      }
      result.sort(new ComparatorFieldId());
      throw new DaoValidationException(result);
    }
  }

  @Override
  public void validate() throws DaoValidationException {
    validate(this, PROP_NAMESPACE);
  }

  @Override
  public int hashCode() {
    return mvsKeyId.hashCode();
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || !(otherObject instanceof DaoAbstractObjectImpl)) return false;
    if(this == otherObject) return true;

    var casted = (DaoAbstractObjectImpl) otherObject;
    return Objects.equals(mvsKeyId, casted.getKeyId());
  }

  @Override
  public String toString() {
    String result = "Dao header: {%s='%s'}";
    return String.format(result, STR_OBJNM_KEYID, getKeyId());
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
