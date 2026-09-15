package com.github.merzsh.basic.nsmarket.microservices.manufacturers;

public class PingManufacturersData {
  protected String mvsPing;

  public PingManufacturersData() {
    mvsPing = "Some ping manufacturers microservice data ... < 5ms :)";
  }

  public String getPingResp() {
    return mvsPing;
  }

}
