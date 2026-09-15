package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import java.util.Objects;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObjectImpl;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoValidationException;

public class DaoManufacturerRecImpl extends DaoAbstractObjectImpl implements DaoManufacturerRec, AbstractCloneable {

  private static final String PROP_NAMESPACE_MANUFACTURER = "manufacturer";

  @NotNull(message = "default:mvlId_is_null")
  @Positive(message = "default:mvlId_is_nega")
  protected int mviId;

  @NotNull(message = "default:mvsLang_is_null")
  @Size(min = 2, max = 2, message = "default:mvsLang_oversized")
  protected String mvsLang;

  @Size(min = 0, max = 28, message = "default:mvsCountryName_oversized")
  protected String mvsCompanyName;

  @Size(min = 0, max = 5, message = "default:mvsCountryName_oversized")
  protected String mvsLegalForm;

  protected int mviCountryId;

  public DaoManufacturerRecImpl(int pviId, String pvsLang, String pvsCompanyName, String pvsLegalForm, int pviCountryId) {
    super(String.valueOf(pviId) + pvsLang);

    mviId = pviId;
    mvsLang = Objects.requireNonNull(pvsLang);
    mvsCompanyName = (pvsCompanyName == null) ? "" : pvsCompanyName;
    mvsLegalForm = (pvsLegalForm == null) ? "" : pvsLegalForm;
    mviCountryId = pviCountryId;
  }

  @Override
  public int getId() {
    return mviId;
  }

  @Override
  public String getLang() {
    return mvsLang;
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
  public int getCountryId() {
    return mviCountryId;
  }

  @Override
  public void validate() throws DaoValidationException {
    validate(this, PROP_NAMESPACE_MANUFACTURER);
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || getClass() != otherObject.getClass()) return false;
    if(this == otherObject) return true;

    var casted = (DaoManufacturerRecImpl) otherObject;
    return (mviId == casted.getId()) && Objects.equals(mvsLang, casted.getLang());
  }

  @Override
  public int hashCode() {
    return Objects.hash(String.valueOf(mviId), mvsLang);
  }

  @Override
  public String toString() {
    String result = "Manufacturer DAO rec.: {RecId='%s', Id='%d', Lang='%s', CompanyName='%s', LegalForm='%s'}";
    return String.format(result, mvsKeyId, mviId, mvsLang, mvsCompanyName, mvsLegalForm);
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(new DaoManufacturerRecImpl(mviId, mvsLang, mvsCompanyName, mvsLegalForm, mviCountryId));
      //return priClassToClone.cast( super.clone() );
    } catch(ClassCastException /*| CloneNotSupportedException*/ ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
