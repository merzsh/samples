package com.github.merzsh.basic.nsmarket.microservices.countries;

public class PingCountriesData {
  protected String mvsPing;

  public PingCountriesData() {
    mvsPing = "Some ping data ... < 3ms :)";
  }

  public String getPingResp() {
    return mvsPing;
  }

}
