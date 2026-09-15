package com.github.merzsh.basic.nsmarket.kernel.common.country;

import java.util.Objects;

import jakarta.persistence.Column;
//import jakarta.persistence.Embeddable;
//import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbl_countries")
@IdClass(JpaTabCountriesPK.class)
public class JpaTabCountries {

  protected static final Validator mriValidator = Validation.buildDefaultValidatorFactory().getValidator();

  // Composed Primary key
  //@Embeddable
	/*public static class PK implements Serializable {
		
		private static final long serialVersionUID = 1L;

		// Country ISO-code
		protected Long mviIsoCode;
		// Text fields language
		protected String mvsLang;
	}*/

  //@EmbeddedId
  //protected PK pk = new PK();

  @Id
  //@GeneratedValue(strategy = GenerationType.SEQUENCE)
  @NotNull
  @Positive /*@Size(min = 3, max = 3)*/
  @Column(name = "pk_iso_code", nullable = false)
  protected Long mviIsoCode;

  @Id
  @NotNull
  @Size(min = 2, max = 2)
  @Column(name = "pk_lang", nullable = false)
  protected String mvsLang;

  @NotNull
  @Size(min = 2, max = 2)
  @Column(name = "iso_code_alpha2", nullable = false)
  protected String mvsIsoCodeAlpha2;

  @Size(min = 2, max = 28)
  @Column(name = "country_name_full", nullable = false)
  protected String mvsCountryTitleFull;

  @Size(min = 2, max = 10)
  @Column(name = "country_name_short", nullable = true)
  protected String mvsCountryTitleShort;

  public JpaTabCountries() {
  }

  public JpaTabCountries(Long pviIsoCode, String pvsLang, String pvsIsoCodeAlpha2) {
    Objects.requireNonNull(pviIsoCode, "pviIsoCode");
    Objects.requireNonNull(pvsLang, "pvsLang");
    Objects.requireNonNull(pvsIsoCodeAlpha2, "pvsIsoCodeAlpha2");

    mviIsoCode = pviIsoCode;
    mvsLang = pvsLang;
    mvsIsoCodeAlpha2 = pvsIsoCodeAlpha2;
  }

  public JpaTabCountries(Long pviIsoCode, String pvsLang, String pvsIsoCodeAlpha2, String pvsCountryName, String pvsCountryNameShort) {
    this(pviIsoCode, pvsLang, pvsIsoCodeAlpha2);

    mvsCountryTitleFull = pvsCountryName;
    mvsCountryTitleShort = pvsCountryNameShort;
  }

  public void validate() throws IllegalStateException {
    var viols = mriValidator.validate(this);
    if(!viols.isEmpty()) {
      for(var err : viols) {
        String msg = err.getMessage();
        String fld = "";
        for(var f : err.getPropertyPath()) {
          fld = f.getName();
          break;
        }
        String result = "JPA entity '%s' constraint violation with message '%s' for field '%s'!";
        throw new IllegalStateException(String.format(result, getClass().getName(), msg, fld));
      }
    }
  }

  public Long getIsoCode() {
    return mviIsoCode;
  }

  public String getLang() {
    return mvsLang;
  }

  public String getIsoCodeAlpha2() {
    return mvsIsoCodeAlpha2;
  }

  public String getCountryTitleFull() {
    return mvsCountryTitleFull;
  }

  public void setCountryTitleFull(String pvsCountryTitleFull) {
    mvsCountryTitleFull = pvsCountryTitleFull;
  }

  public String getCountryTitleShort() {
    return mvsCountryTitleShort;
  }

  public void setCountryTitleShort(String pvsCountryTitleShort) {
    mvsCountryTitleShort = pvsCountryTitleShort;
  }

  @Override
  public String toString() {
    return String.format("COUNTRY REC.: {IsoCodeDigit='%d', TextLang='%s', IsoCodeAlpha2='%s', TitleFull='%s', TitleShort='%s'}",
        mviIsoCode, mvsLang, mvsIsoCodeAlpha2, mvsCountryTitleFull, mvsCountryTitleShort);
  }
}
