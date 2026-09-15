package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.List;
import java.util.Objects;

public class ServiceValidationException extends RuntimeException {
  private static final long serialVersionUID = 1L;

  List<ServiceValidationExceptionRec> mriValidationRecords = null;

  public ServiceValidationException(List<ServiceValidationExceptionRec> priValidationRecords) {
    mriValidationRecords = Objects.requireNonNull(priValidationRecords);
  }

  public List<ServiceValidationExceptionRec> getValidationRecords() {
    return mriValidationRecords;
  }

  @Override
  public String toString() {
    StringBuilder result = new StringBuilder(this.getClass().getName() + ":\n");
    for(var rec : mriValidationRecords) {
      result.append(rec.toString()).append("\n");
    }
    return result.toString();
  }
}
