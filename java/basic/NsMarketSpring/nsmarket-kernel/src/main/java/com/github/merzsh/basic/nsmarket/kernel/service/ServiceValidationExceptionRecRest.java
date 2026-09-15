package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Objects;

public record ServiceValidationExceptionRecRest(
    String fieldId,
    String msgId,
    String fieldNameId,
    String nativeMsg
) implements ServiceBaseRecRest {
  private static final String STR_EMPTY = "";
  private static final String STR_UNSUPPORTED_RECORD_CLASS = "Unsupported %s record class: '%s'";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_SRC = "source";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_DST = "destination";

  private static final Class<ServiceValidationExceptionRec> mrcSrvRecordClass = ServiceValidationExceptionRec.class;
  private static final Class<ServiceValidationExceptionRecRest> mrcSrvRestflClass = ServiceValidationExceptionRecRest.class;

  public static ServiceValidationExceptionRecRest instantiate() {
    return new ServiceValidationExceptionRecRest(STR_EMPTY, STR_EMPTY, STR_EMPTY, STR_EMPTY);
  }

  private ServiceValidationExceptionRecRest copySrvToRestRecord(ServiceValidationExceptionRec priSrvRecord) {
    Objects.requireNonNull(priSrvRecord);

    return new ServiceValidationExceptionRecRest(
        priSrvRecord.getFieldId(),
        priSrvRecord.getMsgId(),
        priSrvRecord.getFieldNameId(),
        priSrvRecord.getNativeMsg());
  }

  private ServiceValidationExceptionRec copyRestToSrvRecord(ServiceValidationExceptionRecRest prrRestRecord) {
    Objects.requireNonNull(prrRestRecord);

    return new ServiceValidationExceptionRec(
        prrRestRecord.fieldId(),
        prrRestRecord.msgId(),
        prrRestRecord.fieldNameId(),
        prrRestRecord.nativeMsg());
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
