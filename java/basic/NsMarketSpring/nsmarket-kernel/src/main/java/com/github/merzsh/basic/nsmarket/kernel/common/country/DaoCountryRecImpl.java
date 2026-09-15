package com.github.merzsh.basic.nsmarket.kernel.common.country;

import java.util.Objects;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObjectImpl;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoValidationException;

public class DaoCountryRecImpl extends DaoAbstractObjectImpl implements DaoCountryRec, AbstractCloneable, Cloneable {

  private static final String PROP_NAMESPACE_COUNTRY = "country";

  @NotNull(message = "default:mvlIsoCode_is_null")
  @Positive(message = "default:mvlIsoCode_is_nega")
  private long mvlIsoCode;

  @NotNull(message = "default:mvsLang_is_null")
  @Size(min = 2, max = 2, message = "default:mvsLang_oversized")
  private String mvsLang;

  @NotNull(message = "default:mvsLang_is_null")
  @Size(min = 2, max = 2, message = "default:mvsLang_oversized")
  private String mvsIsoCode;

  @Size(min = 0, max = 28, message = "default:mvsCountryName_oversized")
  private String mvsCountryName;

  @Size(min = 0, max = 10, message = "default:mvsCountryNameShort_oversized")
  private String mvsCountryNameShort;

  public DaoCountryRecImpl(long pvlIsoCode, String pvsLang, String pvsIsoCode, String pvsCountryName, String pvsCountryNameShort) {
    super(String.valueOf(pvlIsoCode) + pvsLang);

    mvlIsoCode = pvlIsoCode;
    mvsLang = Objects.requireNonNull(pvsLang);
    mvsIsoCode = Objects.requireNonNull(pvsIsoCode);
    mvsCountryName = Objects.requireNonNull(pvsCountryName);
    mvsCountryNameShort = Objects.requireNonNull(pvsCountryNameShort);
  }

  @Override
  public long getIsoCodeDigital() {
    return mvlIsoCode;
  }

  @Override
  public String getLang() {
    return mvsLang;
  }

  @Override
  public String getIsoCodeAplpha2() {
    return mvsIsoCode;
  }

  @Override
  public String getCountryName() {
    return mvsCountryName;
  }

  @Override
  public String getCountryNameShort() {
    return mvsCountryNameShort;
  }

  @Override
  public void validate() throws DaoValidationException {
    validate(this, PROP_NAMESPACE_COUNTRY);
  }

  @Override
  public boolean equals(Object otherObject) {
    if(otherObject == null || getClass() != otherObject.getClass()) return false;
    if(this == otherObject) return true;

    var casted = (DaoCountryRecImpl) otherObject;
    return (mvlIsoCode == casted.getIsoCodeDigital()) && Objects.equals(mvsLang, casted.getLang());
  }

  @Override
  public int hashCode() {
    return Objects.hash(mvlIsoCode, mvsLang);
  }

  @Override
  public String toString() {
    String result = "Country DAO rec.: {KeyId='%s', IsoCodeDigital='%d', Lang='%s', IsoCodeAplpha2='%s', CountryName='%s', CountryShortName='%s'}";
    return String.format(result, mvsKeyId, mvlIsoCode, mvsLang, mvsIsoCode, mvsCountryName, mvsCountryNameShort);
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
