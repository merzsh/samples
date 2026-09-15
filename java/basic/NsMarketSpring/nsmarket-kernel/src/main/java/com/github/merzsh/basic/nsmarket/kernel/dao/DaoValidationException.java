package com.github.merzsh.basic.nsmarket.kernel.dao;

import java.util.List;
import java.util.Objects;

public class DaoValidationException extends RuntimeException {

  private static final long serialVersionUID = 1L;
  List<DaoValidationExceptionRec> mriValidationRecords = null;

  public DaoValidationException(List<DaoValidationExceptionRec> priValidationRecords) {
    mriValidationRecords = Objects.requireNonNull(priValidationRecords);
  }

  public List<DaoValidationExceptionRec> getValidationRecords() {
    return mriValidationRecords;
  }

  @Override
  public String toString() {
    String result = this.getClass().getName() + ":\n";
    for(var rec : mriValidationRecords) {
      result += rec.toString() + "\n";
    }
    return result;
  }
}
