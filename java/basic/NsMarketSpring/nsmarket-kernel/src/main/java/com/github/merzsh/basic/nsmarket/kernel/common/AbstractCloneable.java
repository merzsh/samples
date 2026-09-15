package com.github.merzsh.basic.nsmarket.kernel.common;

public interface AbstractCloneable {
  // Implementation does not throws CloneNotSupportedException if class was inherited with Cloneable interface.
  // Cloneable - semantic interface means all fields can be simple deep copied (complex fields are shallow copies reference by default),
  //		useful for simple types mostly.

  // Such we use interfaces and do not wanna cast every time to implementation class, we created here separate clone specialization interface
  public <T> T clone(Class<T> priClassToClone) throws IllegalArgumentException;
}
