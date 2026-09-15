package com.github.merzsh.basic.nsmarket.microservices.manufacturers.manufacturer;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRecImpl;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRecRest;

public record SrvEntityManufacturerRecRest(

    String namespace,
    int companyId,
    String companyName,
    String legalForm,
    int countryId,
    String countryIsoCodeAplpha2,
    String countryNameShort

) implements ServiceBaseRecRest {

  private static final String STR_EMPTY = "";
  private static final String STR_UNSUPPORTED_RECORD_CLASS = "Unsupported %s record class: '%s'";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_SRC = "source";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_DST = "destination";

  private static final Class<SrvEntityManufacturerRec> mrcSrvRecordClass = SrvEntityManufacturerRec.class;
  private static final Class<SrvEntityManufacturerRecRest> mrcSrvRestflClass = SrvEntityManufacturerRecRest.class;

  public static SrvEntityManufacturerRecRest instantiate() {
    return new SrvEntityManufacturerRecRest(STR_EMPTY, 0, STR_EMPTY, STR_EMPTY, -1, STR_EMPTY, STR_EMPTY);
  }

  private SrvEntityManufacturerRecRest copySrvToRestRecord(SrvEntityManufacturerRec priSrvRecord) {
    Objects.requireNonNull(priSrvRecord);

    return new SrvEntityManufacturerRecRest(
        priSrvRecord.getNamespace(),
        priSrvRecord.getId(),
        priSrvRecord.getCompanyName(),
        priSrvRecord.getLegalForm(),
        priSrvRecord.getCountry() == null ? -1 : priSrvRecord.getCountry().getIsoCodeDigital(),
        priSrvRecord.getCountry() == null ? STR_EMPTY : priSrvRecord.getCountry().getIsoCodeAplpha2(),
        priSrvRecord.getCountry() == null ? STR_EMPTY : priSrvRecord.getCountry().getCountryNameShort());
  }

  private SrvEntityManufacturerRec copyRestToSrvRecord(SrvEntityManufacturerRecRest prrRestRecord) {
    Objects.requireNonNull(prrRestRecord);

    SrvEntityCountryRec country = null;
    if(prrRestRecord.countryId > 0) {
      country = new SrvEntityCountryRecImpl(STR_EMPTY, prrRestRecord.countryId,
          prrRestRecord.countryIsoCodeAplpha2, STR_EMPTY, prrRestRecord.countryNameShort);
    }

    return new SrvEntityManufacturerRecImpl(
        prrRestRecord.namespace(),
        prrRestRecord.companyId(),
        prrRestRecord.companyName(),
        prrRestRecord.legalForm(),
        country);
  }

  @Override
  public <T> T copyRecord(Class<T> prcDestRecordClass, Object prcSrcRecord) {
    Objects.requireNonNull(prcDestRecordClass);
    Objects.requireNonNull(prcSrcRecord);

    Object lrcDstRec = null;

    try {
      if(prcDestRecordClass == mrcSrvRestflClass) {
        lrcDstRec = copySrvToRestRecord(mrcSrvRecordClass.cast(prcSrcRecord));
      } else if(prcDestRecordClass == mrcSrvRecordClass) {
        lrcDstRec = copyRestToSrvRecord(mrcSrvRestflClass.cast(prcSrcRecord));
      } else {
        throw new IllegalArgumentException(String.format(
            STR_UNSUPPORTED_RECORD_CLASS, STR_UNSUPPORTED_RECORD_CLASS_DST, prcDestRecordClass.getName()));
      }
    } catch(ClassCastException ex) {
      throw new IllegalArgumentException(String.format(
          STR_UNSUPPORTED_RECORD_CLASS, STR_UNSUPPORTED_RECORD_CLASS_SRC, prcSrcRecord.getClass().getName()), ex);
    }

    return prcDestRecordClass.cast(lrcDstRec);
  }
}
