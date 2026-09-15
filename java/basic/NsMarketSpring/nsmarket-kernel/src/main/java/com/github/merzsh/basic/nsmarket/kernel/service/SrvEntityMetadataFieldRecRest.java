package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Objects;

public record SrvEntityMetadataFieldRecRest(
    String fieldNamespace,
    String fieldId,
    String fieldName,
    boolean fieldIsPk,
    boolean fieldIsFk,
    boolean isNumber,
    int fieldMaxLength
) implements ServiceBaseRecRest {

  private static final String STR_EMPTY = "";
  private static final String STR_UNSUPPORTED_RECORD_CLASS = "Unsupported %s record class: '%s'";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_SRC = "source";
  private static final String STR_UNSUPPORTED_RECORD_CLASS_DST = "destination";

  private static final Class<SrvEntityMetadataFieldRec> mrcSrvRecordClass = SrvEntityMetadataFieldRec.class;
  private static final Class<SrvEntityMetadataFieldRecRest> mrcSrvRestflClass = SrvEntityMetadataFieldRecRest.class;

  public static SrvEntityMetadataFieldRecRest instantiate() {
    return new SrvEntityMetadataFieldRecRest(STR_EMPTY, STR_EMPTY, STR_EMPTY, false, false, false, 0);
  }

  private SrvEntityMetadataFieldRecRest copySrvToRestRecord(SrvEntityMetadataFieldRec priSrvEntityRecord) {
    Objects.requireNonNull(priSrvEntityRecord);

    return new SrvEntityMetadataFieldRecRest(
        priSrvEntityRecord.getNamespace(),
        priSrvEntityRecord.getKeyId(),
        priSrvEntityRecord.getKeyName(),
        priSrvEntityRecord.isFieldPk(),
        priSrvEntityRecord.isFieldFk(),
        priSrvEntityRecord.isNumber(),
        priSrvEntityRecord.getFieldMaxLength());
  }

  private SrvEntityMetadataFieldRec copyRestToSrvRecord(SrvEntityMetadataFieldRecRest prrResrEntityRecord) {
    Objects.requireNonNull(prrResrEntityRecord);

    return new SrvEntityMetadataFieldRecImpl(
        prrResrEntityRecord.fieldNamespace(),
        prrResrEntityRecord.fieldId(),
        prrResrEntityRecord.fieldName(),
        prrResrEntityRecord.fieldIsPk(),
        prrResrEntityRecord.fieldIsFk(),
        prrResrEntityRecord.isNumber(),
        prrResrEntityRecord.fieldMaxLength());
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
