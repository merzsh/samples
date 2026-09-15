package com.github.merzsh.basic.nsmarket.kernel.common.country;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRecImpl;

public class SrvEntityCountryRecImpl extends ServiceBaseRecImpl
    implements SrvEntityCountryRec, AbstractCloneable {

  protected String mvsIsoCode;
  protected String mvsCountryName;

  //@Size(min = 0, max = 3, message="default:mvsCountryNameShort_OVERSIZED")
  protected String mvsCountryNameShort;

  public SrvEntityCountryRecImpl(String pvsFieldNamespace,
                                 int pviIsoCode, String pvsIsoCode,
                                 String pvsCountryName, String pvsCountryNameShort) {
		
	/*@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
	public SrvEntityCountryRecImpl(@JsonProperty("namespace") String pvsFieldNamespace, 
			@JsonProperty("iso_code_id") int pviIsoCode, @JsonProperty("iso_code") String pvsIsoCode, 
			@JsonProperty("country_name") String pvsCountryName, @JsonProperty("country_name_short") String pvsCountryNameShort) {*/

    super(pvsFieldNamespace, String.valueOf(pviIsoCode), String.format("%s (%s)",
        pvsCountryNameShort == null ? "" : pvsCountryNameShort, Objects.requireNonNull(pvsIsoCode)));

    //Objects.requireNonNull(pvsCountryName, "pvsCountryName");

    mvsIsoCode = pvsIsoCode;
    mvsCountryName = (pvsCountryName == null) ? "" : pvsCountryName;
    mvsCountryNameShort = (pvsCountryNameShort == null) ? "" : pvsCountryNameShort;
  }

  @Override
  public int getIsoCodeDigital() {
    return Integer.parseInt(getKeyId());
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
  public boolean equals(Object otherObject) {
    if(!(otherObject instanceof SrvEntityCountryRecImpl casted)) return false;
    if(this == otherObject) return true;

    return super.equals(casted);
  }

  @Override
  public int hashCode() {
    return super.hashCode();
  }

  @Override
  public String toString() {
    String result = "Country service rec.: {Namespace='%s', IsoCodeDigital='%s', RecordName='%s', IsoCodeAplpha2='%s', CountryName='%s', CountryShortName='%s'}";
    return String.format(result, getNamespace(), getKeyId(), getKeyName(), mvsIsoCode, mvsCountryName, mvsCountryNameShort);
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      return priClassToClone.cast(new SrvEntityCountryRecImpl(getNamespace(), getIsoCodeDigital(), mvsIsoCode, mvsCountryName, mvsCountryNameShort));
    } catch(ClassCastException /*| CloneNotSupportedException*/ ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
