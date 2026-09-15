package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import java.util.Objects;

import jakarta.persistence.*;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "tbl_manufacturers")
@IdClass(JpaTabManufacturersPK.class)
public class JpaTabManufacturers {
  protected static final Validator mriValidator = Validation.buildDefaultValidatorFactory().getValidator();

  // Composed Primary key
	/*public static class PK implements Serializable {
		private static final long serialVersionUID = 1L;
		
		// Company Id
		protected Long mvcId;
		// Text fields language
		protected String mvsLang;
	}*/

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @NotNull
  @Positive
  @Column(name = "pk_id", nullable = false)
  protected Long mvcId;

  @Id
  @NotNull
  @Size(min = 2, max = 2)
  @Column(name = "pk_lang", nullable = false)
  protected String mvsLang;

  @Size(min = 0, max = 28)
  @Column(name = "company_name", nullable = true)
  protected String mvsCompanyName;

  @Size(min = 0, max = 5)
  @Column(name = "legal_form", nullable = true)
  protected String mvsLegalForm;

  @Column(name = "fk_country_id", nullable = true)
  protected Long mvcCountryId;

  public JpaTabManufacturers() {
  }

  public JpaTabManufacturers(Long pvcId, String pvsLang) {
    mvcId = Objects.requireNonNull(pvcId);
    mvsLang = Objects.requireNonNull(pvsLang);
  }

  public JpaTabManufacturers(Long pvcId, String pvsLang, String pvsCompanyName, String pvsLegalForm, Long pvcCountryId) {
    this(pvcId, pvsLang);
    mvsCompanyName = pvsCompanyName;
    mvsLegalForm = pvsLegalForm;
    mvcCountryId = pvcCountryId;
  }

  public void validate() throws IllegalStateException {
    // Validation method implements onto DAO level record (it's dummy note)
  }

  public Long getId() {
    return mvcId;
  }

  public String getLang() {
    return mvsLang;
  }

  public String getCompanyName() {
    return mvsCompanyName;
  }

  public void setCompanyName(String pvsCompanyName) {
    mvsCompanyName = (pvsCompanyName == null) ? "" : pvsCompanyName;
  }

  public String getLegalForm() {
    return mvsLegalForm;
  }

  public void setLegalForm(String pvsLegalForm) {
    mvsLegalForm = (pvsLegalForm == null) ? "" : pvsLegalForm;
  }

  public Long getCountryId() {
    return mvcCountryId;
  }

  public void setCountry(Long pvcCountryId) {
    mvcCountryId = pvcCountryId;
  }

  @Override
  public String toString() {
    return String.format("Producer rec.: {Id='%d', TextLang='%s', CompanyName='%s', LegalStatus='%s'}",
        mvcId.intValue(), mvsLang, mvsCompanyName, mvsLegalForm);
  }
}
