package com.github.merzsh.basic.nsmarket.microservices.countries;

import java.util.Objects;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseEntity;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRec;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceBaseRecRest;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceValidationException;
import com.github.merzsh.basic.nsmarket.kernel.service.ServiceValidationExceptionRecRest;
import com.github.merzsh.basic.nsmarket.kernel.service.SrvEntityMetadataAbstract;
import com.github.merzsh.basic.nsmarket.kernel.service.SrvEntityMetadataFieldRecRest;

import com.github.merzsh.basic.nsmarket.microservices.countries.country.SrvEntityCountry;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRec;
import com.github.merzsh.basic.nsmarket.kernel.common.country.SrvEntityCountryRecImpl;
import com.github.merzsh.basic.nsmarket.microservices.countries.country.SrvEntityCountryRecRest;
import com.github.merzsh.basic.nsmarket.microservices.countries.country.SrvEntityMetadataCountry;

@RestController
@RequestMapping("/nsmarket/mservice/countries")
public class ControllerCountries {

  protected static final String STR_EMPTY = "";
  protected static final String STR_UNSUPPORTED_METADATA_INFO = "Unsupported metadata type requested: '%s'";
  protected static final String STR_UNSUPPORTED_SERVICE_ENTITY_CLASS = "Unsupported service entity class: '%s'";
  protected static final String STR_UNSUPPORTED_CRUD_TYPE = "Unsupported record modifier requested, type: '%s'";
  protected static final String STR_RECORD_FOUND_BUT_ID_NULL = "Record with ID='%d' found in entity '%s' but result is NULL (inconsistence)!";

  //protected final static String STR_PAGE_PRFIX = "nsmarket/webpages/";

  @Autowired
  private ApplicationContext mriAppContext;

  private static enum STR_MDATA {TABLE, FIELD}

  private static enum CRUD {INSERT, UPDATE, DELETE, VALIDATE}

  private ResponseEntity<String[]> getStringMetadata(
      SrvEntityMetadataAbstract priSrvEntityMetadata, STR_MDATA preStrMetadataType, String pvsId) {
    try {
      Objects.requireNonNull(priSrvEntityMetadata);
      Objects.requireNonNull(preStrMetadataType);

      Set<String> result = null;

      switch(preStrMetadataType) {
        case TABLE:
          if((pvsId == null) || (pvsId.equals(STR_EMPTY))) result = priSrvEntityMetadata.getTabelsId();
          else (result = new HashSet<>()).add(priSrvEntityMetadata.getTableName(pvsId));
          break;
        case FIELD:
          if((pvsId == null) || (pvsId.equals(STR_EMPTY))) result = priSrvEntityMetadata.getFieldsId();
          else (result = new HashSet<>()).add(priSrvEntityMetadata.getFieldName(pvsId));
          break;
        default:
          throw new IllegalArgumentException(String.format(STR_UNSUPPORTED_METADATA_INFO, preStrMetadataType.name()));
      }

      return result.isEmpty() ? new ResponseEntity<>(HttpStatus.NOT_FOUND) :
          new ResponseEntity<>(result.toArray(new String[0]), HttpStatus.OK);
    } catch(Exception ex) {
      ex.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  private <T extends ServiceBaseRecRest> ResponseEntity<Set<T>> getRecordsForOut(
      ServiceBaseEntity priSrvEntity, Class<T> prcOutRecordClass) {
    try {
      Objects.requireNonNull(priSrvEntity);
      Objects.requireNonNull(prcOutRecordClass);

      var query = priSrvEntity.getRecords(ServiceBaseRec.class);
      if(!query.isEmpty()) {
        Set<T> result = new HashSet<>();
        for(var rec : query) {
          Objects.requireNonNull(rec);

          var recRest = (ServiceBaseRecRest) prcOutRecordClass.getMethod("instantiate").invoke(null);
          var res = recRest.copyRecord(prcOutRecordClass, rec);
          result.add(res);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
      } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    } catch(Exception ex) {
      ex.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private <T extends ServiceBaseRecRest> ResponseEntity<T> getRecordForOut(
      ServiceBaseEntity priSrvEntity, Class<T> prcOutRecordClass, int pviSearchId) {
    try {
      Objects.requireNonNull(priSrvEntity);
      Objects.requireNonNull(prcOutRecordClass);

      ServiceBaseRec rec = null;
      try {
        rec = priSrvEntity.getRecById(ServiceBaseRec.class, Integer.valueOf(pviSearchId));
      } catch(EntityNotFoundException ex) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }

      if(rec != null) {
        var recRest = (ServiceBaseRecRest) prcOutRecordClass.getMethod("instantiate").invoke(null);
        var result = recRest.copyRecord(prcOutRecordClass, rec);
        return new ResponseEntity<>(result, HttpStatus.OK);
      } else
        throw new IllegalStateException(String.format(STR_RECORD_FOUND_BUT_ID_NULL, pviSearchId, priSrvEntity.getEntityId()));
    } catch(Exception ex) {
      ex.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public static class ViolationRecImpl extends SrvEntityCountryRecImpl implements ServiceBaseRec {

    ServiceValidationException mrcValidationException;

    public ViolationRecImpl(ServiceValidationException prcValidationException) {
      super(STR_EMPTY, 0, STR_EMPTY, STR_EMPTY, STR_EMPTY);

      mrcValidationException = Objects.requireNonNull(prcValidationException);
    }

    @Override
    public void validate() throws ServiceValidationException {
      if(mrcValidationException != null) throw mrcValidationException;
      else throw new IllegalStateException();
    }
  }

  private <T extends ServiceBaseRec> ResponseEntity<T> prepareRecordForInput(ServiceBaseEntity priSrvEntity,
                                                                             Class<T> prcSrvRecordClass, ServiceBaseRecRest priSrcRecord, CRUD preCrudType) {
    try {
      Objects.requireNonNull(priSrvEntity);
      Objects.requireNonNull(prcSrvRecordClass);
      Objects.requireNonNull(priSrcRecord);
      Objects.requireNonNull(preCrudType);

      var recRest = (ServiceBaseRecRest) priSrcRecord.getClass().getMethod("instantiate").invoke(null);
      var recSrv = recRest.copyRecord(prcSrvRecordClass, priSrcRecord);
      HttpStatus lveHttpStatus = HttpStatus.OK;

      switch(preCrudType) {
        case INSERT:
          lveHttpStatus = HttpStatus.CREATED;
          priSrvEntity.insertRecord(null, recSrv);
          break;
        case UPDATE:
          priSrvEntity.updateRecord(null, recSrv);
          break;
        case DELETE:
          priSrvEntity.deleteRecord(null, recSrv);
          break;
        case VALIDATE:
          try {
            priSrvEntity.validateRecord(recSrv);
          } catch(ServiceValidationException ex) {
            // transform validation exception to return record type using dummy nested record class
            ServiceBaseRec result = new ViolationRecImpl(ex);
            try {
              return new ResponseEntity<>(prcSrvRecordClass.cast(result), lveHttpStatus);
            } catch(ClassCastException exx) {
              throw new IllegalStateException(exx);
            }
          }
          break;
        default:
          throw new IllegalArgumentException(String.format(STR_UNSUPPORTED_CRUD_TYPE, preCrudType.name()));
      }
      return new ResponseEntity<>(lveHttpStatus);
    } catch(Exception ex) {
      ex.printStackTrace();
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("metadata/tables")
  public ResponseEntity<String[]> qetMetadataTables() {
    var metadata = mriAppContext.getBean(SrvEntityMetadataCountry.class);
    return getStringMetadata(metadata, STR_MDATA.TABLE, null);
  }

  @GetMapping("metadata/tables/{id}")
  public ResponseEntity<String> qetMetadataTableName(@PathVariable(name = "id") String pvsTableId) {
    var metadata = mriAppContext.getBean(SrvEntityMetadataCountry.class);
    ResponseEntity<String[]> result = getStringMetadata(metadata, STR_MDATA.TABLE, pvsTableId);
    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null) && (result.getBody().length == 1))
      return new ResponseEntity<>(result.getBody()[0], result.getStatusCode());
    else return new ResponseEntity<>(result.getStatusCode());
  }

  @GetMapping("metadata/fields")
  public ResponseEntity<String[]> qetMetadataFields() {
    var metadata = mriAppContext.getBean(SrvEntityMetadataCountry.class);
    return getStringMetadata(metadata, STR_MDATA.FIELD, null);
  }

  @GetMapping("metadata/fields/{id}")
  public ResponseEntity<String> qetMetadataFieldName(@PathVariable(name = "id") String pvsFieldId) {
    var metadata = mriAppContext.getBean(SrvEntityMetadataCountry.class);
    ResponseEntity<String[]> result = getStringMetadata(metadata, STR_MDATA.FIELD, pvsFieldId);
    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null) && (result.getBody().length == 1))
      return new ResponseEntity<>(result.getBody()[0], result.getStatusCode());
    else return new ResponseEntity<>(result.getStatusCode());
  }

  @GetMapping("metadata/records")
  public ResponseEntity<SrvEntityMetadataFieldRecRest[]> qetMetadataRecords() {
    var metadata = mriAppContext.getBean(SrvEntityMetadataCountry.class);
    var result = getRecordsForOut(metadata, SrvEntityMetadataFieldRecRest.class);
    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null))
      return new ResponseEntity<>(result.getBody().toArray(new SrvEntityMetadataFieldRecRest[0]), result.getStatusCode());
    else return new ResponseEntity<>(result.getStatusCode());
  }

  @GetMapping("data/records")
  public ResponseEntity<SrvEntityCountryRecRest[]> getDataRecords(@RequestParam(name = "lng", required = false) String pvsLang) {
    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);
    srvEntity.setLanguage(pvsLang);
    var result = getRecordsForOut(srvEntity, SrvEntityCountryRecRest.class);
    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null))
      return new ResponseEntity<>(result.getBody().toArray(new SrvEntityCountryRecRest[0]), result.getStatusCode());
    else return new ResponseEntity<>(result.getStatusCode());
  }

  @GetMapping("data/records/{id}")
  public ResponseEntity<SrvEntityCountryRecRest> getDataRecordById(
      @PathVariable(name = "id") int pviRecordId, @RequestParam(name = "lng", required = false) String pvsLang) {
    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);
    srvEntity.setLanguage(pvsLang);
    var result = getRecordForOut(srvEntity, SrvEntityCountryRecRest.class, pviRecordId);
    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null))
      return new ResponseEntity<>(result.getBody(), result.getStatusCode());
    else return new ResponseEntity<>(result.getStatusCode());
  }

  @PostMapping("data/records/{id}")
  public ResponseEntity<ServiceValidationExceptionRecRest[]> validateDataRecord(@PathVariable(name = "id") int pviRecordId,
                                                                                @RequestParam(name = "lng", required = false) String pvsLang,
                                                                                @RequestBody SrvEntityCountryRecRest prrDataRecord) {

    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);

    var result = prepareRecordForInput(srvEntity, SrvEntityCountryRec.class, prrDataRecord, CRUD.VALIDATE);

    if((result.getStatusCode() == HttpStatus.OK) && (result.getBody() != null)) {
      try {
        result.getBody().validate();
      } catch(ServiceValidationException ex) {
        List<ServiceValidationExceptionRecRest> errsRest = new ArrayList<>();
        for(var err : ex.getValidationRecords()) {
          var errRest = ServiceValidationExceptionRecRest.instantiate().copyRecord(ServiceValidationExceptionRecRest.class, err);
          errsRest.add(errRest);
        }
        return new ResponseEntity<>(errsRest.toArray(new ServiceValidationExceptionRecRest[0]), result.getStatusCode());
      }
    }
    return new ResponseEntity<>(result.getStatusCode());
  }

  @PostMapping("data/records")
  public ResponseEntity<?> insertDataRecord(@RequestParam(name = "lng", required = false) String pvsLang,
                                            @RequestBody SrvEntityCountryRecRest prrDataRecord) {

    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);
    srvEntity.setLanguage(pvsLang);

    return prepareRecordForInput(srvEntity, SrvEntityCountryRec.class, prrDataRecord, CRUD.INSERT);
  }

  @PutMapping("data/records/{id}")
  public ResponseEntity<?> updateDataRecord(@PathVariable(name = "id") int pviRecordId,
                                            @RequestParam(name = "lng", required = false) String pvsLang,
                                            @RequestBody SrvEntityCountryRecRest prrDataRecord) {

    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);
    srvEntity.setLanguage(pvsLang);

    return prepareRecordForInput(srvEntity, SrvEntityCountryRec.class, prrDataRecord, CRUD.UPDATE);
  }

  @DeleteMapping("data/records/{id}")
  public ResponseEntity<?> deleteDataRecord(@PathVariable(name = "id") int pviRecordId,
                                            @RequestParam(name = "lng", required = false) String pvsLang) {

    var srvEntity = mriAppContext.getBean(SrvEntityCountry.class);
    srvEntity.setLanguage(pvsLang);

    SrvEntityCountryRecRest recRest = new SrvEntityCountryRecRest(STR_EMPTY, pviRecordId, STR_EMPTY, STR_EMPTY, STR_EMPTY);

    return prepareRecordForInput(srvEntity, SrvEntityCountryRec.class, recRest, CRUD.DELETE);
  }

  @GetMapping("ping")
  public PingCountriesData ping() {
    //return "Welcome, ping of Spring Boot web application is successfull! :)";
    return new PingCountriesData();
  }
}
