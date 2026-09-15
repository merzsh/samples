package com.github.merzsh.basic.nsmarket.kernel.service;

import java.util.Objects;

import com.github.merzsh.basic.nsmarket.kernel.common.AbstractCloneable;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObject;
import com.github.merzsh.basic.nsmarket.kernel.dao.DaoAbstractObjectImpl;

public class ServiceAbstractObjectImpl implements ServiceAbstractObject, AbstractCloneable {

  protected DaoAbstractObject mriKeyId;
  protected String mvsNamespace;

  public ServiceAbstractObjectImpl() {
    mriKeyId = new DaoAbstractObjectImpl();
    mvsNamespace = "";
  }

  public ServiceAbstractObjectImpl(String pvsObjectId) {
    mriKeyId = new DaoAbstractObjectImpl(pvsObjectId);
    mvsNamespace = "";
  }

  public ServiceAbstractObjectImpl(String pvsObjectId, String pvsNamespace) {
    mriKeyId = new DaoAbstractObjectImpl(pvsObjectId);
    mvsNamespace = Objects.requireNonNull(pvsNamespace);
  }

  @Override
  public String getKeyId() {
    return mriKeyId.getKeyId();
  }

  @Override
  public String getNamespace() {
    return mvsNamespace;
  }

  @Override
  public boolean equals(Object otherObject) {
    if(!(otherObject instanceof ServiceAbstractObjectImpl casted)) return false;
    if(this == otherObject) return true;

    return Objects.equals(getKeyId(), casted.getKeyId()) && Objects.equals(getNamespace(), casted.getNamespace());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getKeyId(), getNamespace());
  }

  @Override
  public String toString() {
    String result = "Service Header: {KeyId='%s', Namespace='%s'}";
    return String.format(result, getKeyId(), getNamespace());
  }

  @Override
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException {
    try {
      var copy = Integer.parseInt(mriKeyId.getKeyId()) == mriKeyId.hashCode()
          ? new ServiceAbstractObjectImpl() : new ServiceAbstractObjectImpl(getKeyId(), getNamespace());
      return priClassToClone.cast(copy);
    } catch(ClassCastException ex) {
      throw new IllegalArgumentException(ex);
    }
  }
}
