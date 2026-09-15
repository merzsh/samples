package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRecImpl;

public class SrvEntityManufacturerRecImpl extends ServiceBaseRecImpl
    implements SrvEntityManufacturerRec, AbstractCloneable {

  protected static final String STR_EMPTY = new String();

  protected int mviId;
  protected String mvsCompanyName;
  protected String mvsLegalForm;
  protected SrvEntityCountryRec mriCountry;

  public SrvEntityManufacturerRecImpl(String pvsFieldNamespace, int pviId, String pvsCompanyName, String pvsLegalForm, SrvEntityCountryRec priCountry) {
    super(pvsFieldNamespace, String.valueOf(pviId), String.format("%s (%s)",
        (pvsCompanyName == null) ? STR_EMPTY : pvsCompanyName, (pvsLegalForm == null) ? STR_EMPTY : pvsLegalForm));

    mviId = pviId;
    mvsCompanyName = (pvsCompanyName == null) ? STR_EMPTY : pvsCompanyName;
    mvsLegalForm = (pvsLegalForm == null) ? STR_EMPTY : pvsLegalForm;
    mriCountry = priCountry;
  }

  @Override
  public int getId() {
    return mviId;
  }

  @Override
  public String getCompanyName() {
    return mvsCompanyName;
  }

  @Override
  public String getLegalForm() {
    return mvsLegalForm;
  }

  @Override
  public SrvEntityCountryRec getCountry() {
    return mriCountry;
  }

  @Override
  public void setCountry(SrvEntityCountryRec priRec) {
    mriCountry = priRec;
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || !(otherObject instanceof SrvEntityManufacturerRecImpl)) return false;
    if(this == otherObject) return true;

    var casted = (SrvEntityManufacturerRecImpl) otherObject;
    return super.equals(casted);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    String result = "Manufacturer service rec.: {Namespace='%s', RecordName='%s', Id='%s', CompanyName='%s', mvsLegalForm='%s'} / " +
        "Associated entity: %s";
    return String.format(result, getNamespace(), getKeyName(), getKeyId(), mvsCompanyName, mvsLegalForm,
        getCountry() == null ? "[undefined]" : getCountry().toString());
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(new SrvEntityManufacturerRecImpl(getNamespace(), mviId, mvsCompanyName, mvsLegalForm, mriCountry));
    } catch(ClassCastException /*| CloneNotSupportedException*/ ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
