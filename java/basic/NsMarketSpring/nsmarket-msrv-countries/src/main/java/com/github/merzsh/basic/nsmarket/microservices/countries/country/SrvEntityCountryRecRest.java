package com.github.merzsh.basic.nsmarket.microservices.countries.country;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRecImpl;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRecRest;

public record SrvEntityCountryRecRest(
    String namespace,
    int isoCodeId,
    String isoCodeAlpha2,
    String countryName,
    String countryNameShort
) implements ServiceBaseRecRest {
  private static final String STR_EMPTY = "";
  private static final String STR_UNSUPPORTED_RECORD_CLASS = "Unsupported %s record class: '%s'";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_SRC = "source";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_DST = "destination";

  private static final Class<SrvEntityCountryRec> mrcSrvRecordClass = SrvEntityCountryRec.class;
  private static final Class<SrvEntityCountryRecRest> mrcSrvRestflClass = SrvEntityCountryRecRest.class;

  public static SrvEntityCountryRecRest instantiate() {
    return new SrvEntityCountryRecRest(STR_EMPTY, 0, STR_EMPTY, STR_EMPTY, STR_EMPTY);
  }

  private SrvEntityCountryRecRest copySrvToRestRecord(SrvEntityCountryRec priSrvRecord) {
    Objects.requireNonNull(priSrvRecord);

    return new SrvEntityCountryRecRest(
        priSrvRecord.getNamespace(),
        priSrvRecord.getIsoCodeDigital(),
        priSrvRecord.getIsoCodeAplpha2(),
        priSrvRecord.getCountryName(),
        priSrvRecord.getCountryNameShort());
  }

  private SrvEntityCountryRec copyRestToSrvRecord(SrvEntityCountryRecRest prrRestRecord) {
    Objects.requireNonNull(prrRestRecord);

    return new SrvEntityCountryRecImpl(
        prrRestRecord.namespace(),
        prrRestRecord.isoCodeId(),
        prrRestRecord.isoCodeAlpha2(),
        prrRestRecord.countryName(),
        prrRestRecord.countryNameShort());
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
