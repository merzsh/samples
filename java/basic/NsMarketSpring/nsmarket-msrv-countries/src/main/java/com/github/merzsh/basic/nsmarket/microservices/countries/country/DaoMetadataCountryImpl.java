package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import java.lang.module.FindException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Repository;

import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoMetadataEntityImpl;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoMetadataFieldImpl;

@Repository
public class DaoMetadataCountryImpl extends DaoMetadataEntityImpl implements DaoMetadataCountry {

  private static final String STR_DB_TABLE_ID = "tbl_countries";

  public DaoMetadataCountryImpl() {
    super("dao_dummy_id", STR_DB_TABLE_ID);
  }

  @Override
  public <T extends DaoAbstractObject> Set<T> getRecords(Class<T> priDaoRecordClass) {
    Set<T> result = new HashSet<T>();

    try {
      // This have to be implemented via reflection read of entity annotations - just stub for convenience :);
      result.add(priDaoRecordClass.cast(new DaoMetadataFieldImpl("pk_iso_code", true, false, true, 3)));
      result.add(priDaoRecordClass.cast(new DaoMetadataFieldImpl("pk_lang", true, false, false, 2)));
      result.add(priDaoRecordClass.cast(new DaoMetadataFieldImpl("iso_code_alpha2", false, false, false, 2)));
      result.add(priDaoRecordClass.cast(new DaoMetadataFieldImpl("country_name_full", false, false, false, 28)));
      result.add(priDaoRecordClass.cast(new DaoMetadataFieldImpl("country_name_short", false, false, false, 10)));
    } catch(ClassCastException ex) {
      throw new UnsupportedOperationException(ex);
    }

    return result;
  }

  @Override
  public void updateRecord(DaoAbstractObject priDaoRecord) {
  }

  @Override
  public void insertRecord(DaoAbstractObject priDaoRecord) {
  }

  @Override
  public void deleteRecord(DaoAbstractObject priDaoRecord) {
  }

  @Override
  public <T extends DaoAbstractObject> T getRecById(Class<T> priDaoRecordClass, Object proRecordId) throws FindException {
    return null;
  }
}
