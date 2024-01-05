import java.util.List;
import java.util.Objects;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * ==================== "Chestniy Znak" API service sample client notes ====================
 * 
 * Objective:
 * Design separate request processor thread (RequestProcessor class below) sends client document creation requests onto remote REST API.
 * Requests must be sent onto remote API in defined frequency - times per time unit (via TimeUnit type).
 * Client requests (RequestGenerator class below) might income with more or less frequency than request processor.
 * 
 * Disclaimers:
 * 1. Accordance with objective, all classes designed as inner classes of class CrptApi.
 * 2. To see thread work sample, examine main() function, placed in bottom of the file.
 * 3. Communication with remote REST API happens via service vendor URL 'https://ismp.crpt.ru/api/v3/lk/documents/create'
 *    which is secure. Here is represented singletone class RestTemplateFactory for secure RestTemplate object instantiation.
 *    It uses secure store mounted on full-scale project, 
 *    so in current implementation was placed stubs there (in part of secure store resource/password).
 * 4. RequestGenerator class generates and sends multiple requests via separate thread (requests quantity can be specified).
 * 5. Needed JSON format presented below, at CrptApi class head.
 * 6. Threads work correctly under wide tests.
 * 
 * 
 * @author Authored by Andrey Miroshnichenko (deployed as CrptApi.java onto https://github.com/merzsh/test at 11.10.2023)
 */
public class CrptApi {
	
	/* JSON Document source template:
		{
			"description": { "participantInn": "string" }, 
			"doc_id": "string", 
			"doc_status": "string",
			"doc_type": "LP_INTRODUCE_GOODS",
			"importRequest": true,
			"owner_inn": "string", 
			"participant_inn": "string", 
			"producer_inn": "string", 
			"production_date": "2020-01-23", 
			"production_type": "string",
			"products": [ { 
			  "certificate_document": "string",
			  "certificate_document_date": "2020-01-23",
			  "certificate_document_number": "string",
			  "owner_inn": "string",
			  "producer_inn": "string",
			  "production_date": "2020-01-23",
			  "tnved_code": "string",
			  "uit_code": "string",
			  "uitu_code": "string" } ],
		  	"reg_date": "2020-01-23", 
			"reg_number": "string"
		}
	*/
	
	public static enum MsgCommand { STARTED, DATA, POISON_PILL, INTERRUPTED, EXCEPTION }
	
	public static class Header {
		protected static final String STR_EMPTY			= "";
		protected static final String STR_FIELD_EMPTY 	= "There are null, empty or wrong value fields: %s";
		protected static final String STR_REGEXP_NUMBER	= "^\\d*$";
		protected static final String STR_DATE_PETTERN	= "yyyy-MM-dd";
		protected static final String STR_HEADER 		= "Header object: {id='%d', controlCommand='%s', reservedA='%s', reservedB='%s'}";
		
		protected Long			id;
		protected MsgCommand 	controlCommand;
		protected String 		reservedA;
		protected String 		reservedB;
		
		public static class Builder {
			protected Long			id = 0L;
			protected MsgCommand 	controlCommand;
			protected String 		reservedA;
			protected String 		reservedB;
			
			protected void validate() {
				// Just some validation assumptions (i.e ID is not null) to return correct object.
		    	// All checks have to be adjusted according concrete business implementation.
		    	
		    	var fields = new StringBuilder();
		    	
		    	if(id < 0) fields.append("id");
		    				
				if(fields.length() > 0) throw new IllegalArgumentException( String.format(STR_FIELD_EMPTY, fields.toString()) );
			}
			
			public Builder() { }
			
			public Builder id(Long id) {
				this.id = id;
				return this;
			}
			
			public Builder controlCommand(MsgCommand controlCommand) {
				this.controlCommand = controlCommand;
				return this;
			}
			
			public Builder reservedA(String reservedA) {
				this.reservedA = reservedA;
				return this;
			}
			
			public Builder reservedB(String reservedB) {
				this.reservedB = reservedB;
				return this;
			}
			
			public Header build() {
				validate();
				return new Header(this);
			}
		}
		
		protected Header(Builder builder) {
			assert builder != null;
			
			this.id				= builder.id;
			this.controlCommand	= builder.controlCommand;
			this.reservedA 		= builder.reservedA;
			this.reservedB 		= builder.reservedB;
		}
		
		@JsonIgnore
		public Long getId() {
			return id;
		}
		
		@JsonIgnore
		public MsgCommand getControlCommand() {
			return controlCommand;
		}
		
		public void setControlCommand(MsgCommand controlCommand) {
			this.controlCommand = controlCommand;
		}
		
		@JsonIgnore
		public String getReservedA() {
			return reservedA;
		}
		
		public void setReservedA(String reservedA) {
			this.reservedA = reservedA;
		}
		
		@JsonIgnore
		public String getReservedB() {
			return reservedB;
		}
		
		public void setReservedB(String reservedB) {
			this.reservedB = reservedB;
		}
		
		@Override
		public String toString() {
			return String.format(STR_HEADER, id, controlCommand, reservedA, reservedB);
		}
	}
	
	// Designed as immutable class, for example
	public static class Document extends Header {
		
		public static class Description {
			private static final String STR_DESCR = "Description object: {participantInn='%s'}";
			
			private String participantInn;
			
			public Description(String participantInn) {
				if(participantInn != null && !participantInn.matches(STR_REGEXP_NUMBER))
					throw new IllegalArgumentException( String.format(STR_FIELD_EMPTY, participantInn) );
				this.participantInn = participantInn;
			}
			
		    public String getParticipantInn() {
		        return participantInn;
		    }
		    
		    @Override
		    public String toString() {
		    	return String.format(STR_DESCR, participantInn);
		    }
		}
		
		public static class Product {
			// GoF 'Builder' pattern implemented for convenient object instantiation - way not to specify all fields via constructor
			public static class Builder {
				private String certificateDocument;
			    private LocalDate certificateDocumentDate;
			    private String certificateDocumentNumber;
			    private String ownerInn;
			    private String producerInn;
			    private LocalDate productionDate;
			    private String tnvedCode;
			    private String uitCode;
			    private String uituCode;
			    
			    private void validate() {
			    	// Just some validation assumptions (i.e ID is not null) to return correct object.
			    	// All checks have to be adjusted according concrete business implementation.
			    	
			    	var fields = new StringBuilder();
					
					if(certificateDocumentNumber != null) {
						// assume this "Number" means digits & letters - no error
					}
					if( ownerInn != null && !ownerInn.matches(STR_REGEXP_NUMBER) ) 
						fields.append("ownerInn, ");
					if( producerInn != null && !producerInn.matches(STR_REGEXP_NUMBER) ) 
						fields.append("producerInn, ");
					
					if(fields.length() > 0) throw new IllegalArgumentException(String.format(STR_FIELD_EMPTY, fields.toString()));
			    }
			    
				public Builder() {
					super();
				}
				
				public Builder certificateDocument(String certificateDocument) {
					this.certificateDocument = certificateDocument;
					return this;
				}
				
				public Builder certificateDocumentDate(LocalDate certificateDocumentDate) {
					this.certificateDocumentDate = certificateDocumentDate;
					return this;
				}
				
				public Builder certificateDocumentNumber(String certificateDocumentNumber) {
					this.certificateDocumentNumber = certificateDocumentNumber;
					return this;
				}
				
				public Builder ownerInn(String ownerInn) {
					this.ownerInn = ownerInn;
					return this;
				}
				
				public Builder producerInn(String producerInn) {
					this.producerInn = producerInn;
					return this;
				}
				
				public Builder productionDate(LocalDate productionDate) {
					this.productionDate = productionDate;
					return this;
				}
				
				public Builder tnvedCode(String tnvedCode) {
					this.tnvedCode = tnvedCode;
					return this;
				}
				
				public Builder uitCode(String uitCode) {
					this.uitCode = uitCode;
					return this;
				}
				
				public Builder uituCode(String uituCode) {
					this.uituCode = uituCode;
					return this;
				}
				
				public Product build() {
					validate();
					return new Product(this);
				}
			}
			
			private static final String STR_PRODUCT = "Product object: {" +
					"certificateDocument='%s'," +
					"certificateDocumentDate='%s'," +
					"certificateDocumentNumber='%s'," +
					"ownerInn='%s'," +
					"producerInn='%s'," +
					"productionDate='%s'," +
					"tnvedCode='%s'," +
					"uitCode='%s'," +
					"uituCode='%s'}";
			
		    private String certificateDocument;
		    private LocalDate certificateDocumentDate;
		    private String certificateDocumentNumber;
		    private String ownerInn;
		    private String producerInn;
		    private LocalDate productionDate;
		    private String tnvedCode;
		    private String uitCode;
		    private String uituCode;
		    
		    private Product(Builder builder) {
		    	assert builder != null;
		    	
		    	certificateDocument 		= builder.certificateDocument;
			    certificateDocumentDate 	= builder.certificateDocumentDate;
			    certificateDocumentNumber	= builder.certificateDocumentNumber;
			    ownerInn 					= builder.ownerInn;
			    producerInn 				= builder.producerInn;
			    productionDate 				= builder.productionDate;
			    tnvedCode 					= builder.tnvedCode;
			    uitCode 					= builder.uitCode;
			    uituCode 					= builder.uituCode;
		    }
		    
		    @JsonGetter("certificate_document")
		    public String getCertificateDocument() {
		    	return certificateDocument;
		    }
		    
		    @JsonGetter("certificate_document_date")
		    @JsonFormat(pattern = STR_DATE_PETTERN)
		    public LocalDate getCertificateDocumentDate() {
		    	return certificateDocumentDate;
		    }
		    
		    @JsonGetter("certificate_document_number")
		    public String getCertificateDocumentNumber() {
		    	return certificateDocumentNumber;
		    }
		    
		    @JsonGetter("owner_inn")
		    public String getOwnerInn() {
		    	return ownerInn;
		    }
		    
		    @JsonGetter("producer_inn")
		    public String getProducerInn() {
		    	return producerInn;
		    }
		    
		    @JsonGetter("production_date")
		    @JsonFormat(pattern = STR_DATE_PETTERN)
		    public LocalDate getProductionDate() {
		    	return productionDate;
		    }
		    
		    @JsonGetter("tnved_code")
		    public String getTnvedCode() {
		    	return tnvedCode;
		    }
		    
		    @JsonGetter("uit_code")
		    public String getUitCode() {
		    	return uitCode;
		    }
		    
		    @JsonGetter("uitu_code")
		    public String getUituCode() {
		    	return uituCode;
		    }
		    
		    @Override
		    public String toString() {
		    	return String.format(STR_PRODUCT, certificateDocument, certificateDocumentDate, certificateDocumentNumber, 
		    			ownerInn, producerInn, productionDate, tnvedCode, uitCode, uituCode);
		    }
		}
		
		// GoF 'Builder' pattern implemented for convenient object instantiation - way not to specify all fields via constructor
		public static class Builder extends Header.Builder {
			// header fields
			protected String controlCommand;
			protected String cryptoKey;
			
			// document fields
			private Description description;
		    private String docId;
		    private String docStatus;
		    private String docType;
		    private Boolean importRequest;
		    private String ownerInn;
		    private String participantInn;
		    private String producerInn;
		    private LocalDate productionDate;
		    private String productionType;
		    private List<Product> products;
		    private LocalDate regDate;
		    private String regNumber;
		    
		    protected void validate() {
		    	// Just some validation assumptions (i.e ID is not null) to return correct object.
		    	// All checks have to be adjusted according concrete business implementation.
		    	
		    	super.validate();
		    	
		    	var fields = new StringBuilder();
		    	
		    	if(description == null) description = new Description(null);
		    	if( ownerInn != null && !ownerInn.matches(STR_REGEXP_NUMBER) ) {
		    		// if INN is not declared number sequence - bad data, error
					fields.append("ownerInn, ");
		    	}
		    	if( participantInn != null && !participantInn.matches(STR_REGEXP_NUMBER) ) 
					fields.append("participantInn, ");
		    	if( producerInn != null && !producerInn.matches(STR_REGEXP_NUMBER) ) 
					fields.append("producerInn, ");
		    	if( regNumber != null && !regNumber.matches(STR_REGEXP_NUMBER) ) 
		    		fields.append("regNumber, ");
				
				
				if(fields.length() > 0) throw new IllegalArgumentException(String.format(STR_FIELD_EMPTY, fields.toString()));
		    }
		    
		    public Builder() {
		    	super();
		    }
		    
		    @Override
		    public Builder id(Long id) {
				super.id(id);
				return this;
			}
		    
		    @Override
		    public Builder controlCommand(MsgCommand controlCommand) {
				super.controlCommand(controlCommand);
				return this;
			}
			
		    @Override
			public Builder reservedA(String reservedA) {
				super.reservedA(reservedA);
				return this;
			}
		    
		    @Override
			public Builder reservedB(String reservedB) {
				super.reservedB(reservedB);
				return this;
			}
		    
		    public Builder description(Description description) {
		    	if(description != null) {
		    		this.description = new Description( description.getParticipantInn() );
		    	} else this.description = null;
		    	
		    	return this;
		    }
		    
		    public Builder docId(String docId) {
		    	this.docId = docId;
		    	return this;
		    }
		    
		    public Builder docStatus(String docStatus) {
		    	this.docStatus = docStatus;
		    	return this;
		    }
		    
		    public Builder docType(String docType) {
		    	this.docType = docType;
		    	return this;
		    }
		    
		    public Builder importRequest(Boolean importRequest) {
		    	this.importRequest = importRequest;
		    	return this;
		    }
		    
		    public Builder ownerInn(String ownerInn) {
		    	this.ownerInn = ownerInn;
		    	return this;
		    }
		    
		    public Builder participantInn(String participantInn) {
		    	this.participantInn = participantInn;
		    	return this;
		    }
		    
		    public Builder producerInn(String producerInn) {
		    	this.producerInn = producerInn;
		    	return this;
		    }
		    
		    public Builder productionDate(LocalDate productionDate) {
		    	this.productionDate = productionDate;
		    	return this;
		    }
		    
		    public Builder productionType(String productionType) {
		    	this.productionType = productionType;
		    	return this;
		    }
		    
		    public Builder products(List<Product> products) {
		    	List<Product> result = null;
		    	
		    	if(products != null) {
		    		result = new ArrayList<>();
		    		for(Product p : products) {
		    			result.add( new Product.Builder()
		    				.certificateDocument(p.getCertificateDocument())
		    				.certificateDocumentDate(p.getCertificateDocumentDate())
		    				.certificateDocumentNumber(p.getCertificateDocumentNumber())
		    				.ownerInn(p.getOwnerInn())
		    				.producerInn(p.getProducerInn())
		    				.productionDate(p.getProductionDate())
		    				.tnvedCode(p.getTnvedCode())
		    				.uitCode(p.getUitCode())
		    				.uituCode(p.getUituCode())
		    				.build() );
		    		}
		    	}
		    	
		    	this.products = result;
		    	return this;
		    }
		    
		    public Builder regDate(LocalDate regDate) {
		    	this.regDate = regDate;
		    	return this;
		    }
		    
		    public Builder regNumber(String regNumber) {
		    	this.regNumber = regNumber;
		    	return this;
		    }
			
		    public Document build() {
		    	validate();
		    	return new Document(this);
		    }
		}
		
		protected static final String STR_DOC = "Document object: {" +
				"\n\theader='%s'" +
				"\n\tdescription='%s'," +
				"\n\tdocId='%s'," +
				"\n\tdocStatus='%s'," +
				"\n\tdocType='%s'," +
				"\n\timportRequest='%s'," +
				"\n\townerInn='%s'," +
				"\n\tparticipantInn='%s'," +
				"\n\tproducerInn='%s'," +
				"\n\tproductionDate='%s'," + 
				"\n\tproductionType='%s'," +
				"\n\tproducts='%s'," +
				"\n\tregDate='%s',"+
				"\n\tregNumber='%s'" + "\n}";
		
		private Description description;
		private String docId;
	    private String docStatus;
	    private String docType;
	    private Boolean importRequest;
	    private String ownerInn;
	    private String participantInn;
	    private String producerInn;
	    private LocalDate productionDate;
	    private String productionType;
	    private List<Product> products = new ArrayList<>();
	    private LocalDate regDate;
	    private String regNumber;
	    
	    private Document(Builder builder) {
	    	super(builder);
	    	
	    	description		= builder.description;
		    docId			= builder.docId;
		    docStatus		= builder.docStatus;
		    docType			= builder.docType;
		    importRequest	= builder.importRequest;
		    ownerInn		= builder.ownerInn;	
		    participantInn	= builder.participantInn;
		    producerInn		= builder.producerInn;
		    productionDate	= builder.productionDate;
		    productionType	= builder.productionType;
		    products		= builder.products;
		    regDate			= builder.regDate;
		    regNumber		= builder.regNumber;
	    }
	    
	    @JsonGetter("description")
	    public Description getDescription() {
	    	if(description != null) return new Description( description.getParticipantInn() );
	    	else return null;
	    }
	    
	    @JsonGetter("doc_id")
	    public String getDocId() {
	    	return docId;
	    }
	    
	    @JsonGetter("doc_status")
	    public String getDocStatus() {
	    	return docStatus;
	    }
	    
	    @JsonGetter("doc_type")
	    public String getDocType() {
	    	return docType;
	    }
	    
	    @JsonGetter("importRequest")
	    public Boolean getImportRequest() {
	    	return importRequest;
	    }
	    
	    @JsonGetter("owner_inn")
	    public String getOwnerInn() {
	    	return ownerInn;
	    }
	    
	    @JsonGetter("participant_inn")
	    public String getParticipantInn() {
	    	return participantInn;
	    }
	    
	    @JsonGetter("producer_inn")
	    public String getProducerInn() {
	    	return producerInn;
	    }
	    
	    @JsonGetter("production_date")
	    @JsonFormat(pattern = STR_DATE_PETTERN)  
	    public LocalDate getProductionDate() {
	    	return productionDate;
	    }
	    
	    @JsonGetter("production_type")
	    public String getProductionType() {
	    	return productionType;
	    }
	    
	    @JsonGetter("products")
	    public List<Product> getProducts(){
	    	List<Product> result = null;
	    	
	    	if(products != null) {
	    		result = new ArrayList<>();
	    		for(Product p : products) {
	    			result.add( new Product.Builder()
	    				.certificateDocument(p.getCertificateDocument())
	    				.certificateDocumentDate(p.getCertificateDocumentDate())
	    				.certificateDocumentNumber(p.getCertificateDocumentNumber())
	    				.ownerInn(p.getOwnerInn())
	    				.producerInn(p.getProducerInn())
	    				.productionDate(p.getProductionDate())
	    				.tnvedCode(p.getTnvedCode())
	    				.uitCode(p.getUitCode())
	    				.uituCode(p.getUituCode())
	    				.build() );
	    		}
	    	}
	    	
	    	return result;
	    }
	    
	    @JsonGetter("reg_date")
	    @JsonFormat(pattern = STR_DATE_PETTERN)  
	    public LocalDate getRegDate() {
	    	return regDate;
	    }
	    
	    @JsonGetter("reg_number")
	    public String getRegNumber() {
	    	return regNumber;
	    }
	    
	    @Override
	    public String toString() {
	    	String strProducts = STR_EMPTY;
	    	
	    	if(products != null) {
	    		var sbProducts = new StringBuilder();
	    		for(Product p : products) {
	    			sbProducts.append("\n\t\t");
	    			sbProducts.append( p.toString() );
	    		}
	    		strProducts = sbProducts.toString();
	    	}
	    	
	    	return String.format(STR_DOC, super.toString(), description,
	    			docId, docStatus, docType, importRequest, ownerInn, participantInn, producerInn, productionDate, 
	    			productionType, strProducts, regDate, regNumber);
	    }
	}
	
	public static class DocumentGenerator implements Supplier<Document> {
		protected String generateStrNum(int length) {
			assert length > 0 && length < 100;
			
			var num = Math.round( Math.random() * Math.pow(10, length) );
			return Long.valueOf(num).toString();
		}
		
		protected String generateString(int length) {
			var result = new StringBuilder();
			
			for(int i=0; i<length; i++) {
				result.append( (char)(Math.round(Math.random() * 93) + 33) );
			}
			return result.toString();
		}
		
		protected LocalDate generateDate() {
			return LocalDate.of(2023, (int)Math.round(Math.random() * 11 + 1), (int)Math.round(Math.random() * 27 + 1));
		}
		
		protected boolean generateBool() {
			if(Long.valueOf(Math.round(Math.random() * 10)).intValue() %2 == 0) return true;
			else return false;
		}
		
		protected Document generateDocument() {
			int strLen = 33, numLen = 10;
			
			var productA = new Document.Product.Builder()
				.certificateDocument( generateString(strLen) )
				.certificateDocumentDate( generateDate() )
				.certificateDocumentNumber( generateStrNum(numLen) )
				.ownerInn( generateStrNum(numLen) )
				.producerInn( generateStrNum(numLen) )
				.productionDate( generateDate() )
				.tnvedCode( generateStrNum(numLen) )
				.uitCode( generateString(strLen) )
				.uituCode( generateString(strLen) )
				.build();
			
			/*var productB = new Document.Product.Builder()
					.certificateDocument( testGenerateString(strLen) )
					.certificateDocumentDate( testGenerateStrDate() )
					.certificateDocumentNumber( testGenerateStrNum(numLen) )
					.ownerInn( productA.getOwnerInn() )
					.producerInn( productA.getProducerInn() )
					.productionDate( productA.getProductionDate() )
					.tnvedCode( testGenerateStrNum(numLen) )
					.uitCode( testGenerateString(strLen) )
					.uituCode( testGenerateString(strLen) )
					.build();*/
			
			List<Document.Product> products = new ArrayList<>();
			products.add(productA);
			//products.add(productB);
			
			String docId = generateStrNum(numLen);
			
			Document document = new Document.Builder()
					.id( Long.parseLong(docId) )
					.controlCommand(MsgCommand.DATA)
					.description( new Document.Description(generateStrNum(numLen)) )
					.docId(docId)
					.docStatus( generateString(strLen) )
					.docType("LP_INTRODUCE_GOODS")
					.importRequest( generateBool() )
					.ownerInn( productA.getOwnerInn() )
					.participantInn( generateStrNum(numLen) )
					.producerInn( productA.producerInn )
					.productionDate( productA.getProductionDate() )
					.productionType( generateString(strLen) )
					.products(products)
					.regDate( generateDate() )
					.regNumber( generateStrNum(numLen) )
					.build();
			
			return document;
		}

		@Override
		public Document get() {
			Document result = null;
			
			synchronized (this) {
				result = generateDocument();
			}
			
			return result;
		}
	}
	
	/**
	 * RestTemplate object factory for complex HTTPS creation.
	 * For convenience is used "Double Checked Locking & volatile" thread safe singletone pattern
	 */
	public static class RestTemplateFactory {
		
		private static volatile RestTemplate restTemplate = null;
		
		private RestTemplateFactory() { }
		
		/**
		 * Gets key store resource defined in application.properties file. 
		 * It's just a stub have to be implemented in full-scale application such property value reading (@Value).
		 */
		private static Resource getKeyStoreResource() {
			return null;
		}
		
		/**
		 * Gets key store password defined in application.properties file. 
		 * It's just a stub have to be implemented in full-scale application such property value reading (@Value).
		 */
		private static String getKeyStorePassword() {
			return "pass";
		}
		
		/**
		 * Constructs RestTemplate object for secured service API consumption (querying via HTTPS).
		 * It's just sample implementation that may corrected in full-scale application and represented as bean (@bean).
		 */
		private static RestTemplate createHttpsRestTemplateObject() {
			try {
				var sslContext = new SSLContextBuilder()
						.loadTrustMaterial( getKeyStoreResource().getURL(), getKeyStorePassword().toCharArray() )
						.build();
				
				var sslConFactory = new SSLConnectionSocketFactory(sslContext);
				var httpClient = HttpClients.custom().setSSLSocketFactory(sslConFactory).build();
				var requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
				
				return new RestTemplate(requestFactory);
			}catch(Throwable ex) {
				synchronized(System.err) {
					ex.printStackTrace();
				}
				return null;
			}
		}
		
		public static RestTemplate getInstance() {
			RestTemplate local = restTemplate;
			if(local == null) {
				synchronized (RestTemplateFactory.class) {
					local = restTemplate;
					// check other thread creates instance already
					if(local == null) {
						local = createHttpsRestTemplateObject();
						restTemplate = local;
					}
				}
			}
			return restTemplate;
		}
	}
	
	public static class RestTemplateMetadata {
		public static enum Protocol {HTTP, HTTPS}
		
		public static class Builder {
			protected static final String STR_FIELD_EMPTY 	= "There are null, empty or wrong value fields: %s";
			
			protected Protocol		protocol 	= Protocol.HTTPS;
			protected String		serverName	= "my.company.com";
			protected int			serverPort	= 80;
			protected String		urlSuffix	= "suffix";
			protected URI			baseUri		= null;
			
			protected void validate() { 	    	
		    	var fields = new StringBuilder();
		    	
		    	if( protocol   == null ) fields.append("protocol, ");
		    	if( serverPort < 0 || serverPort > 65535 ) fields.append("serverPort, ");
		    	
		    	try {
		    		baseUri = new URI(protocol.name().toLowerCase(), null, serverName, 
							serverPort, "/" + urlSuffix, /*"query"*/ null, null );
		    		assert baseUri != null;
				} catch (URISyntaxException ex) {
					fields.append( String.format("URI wrong syntax: '%s', ", ex.getMessage()) );
				}
		    	
				if(fields.length() > 0) throw new IllegalArgumentException( String.format(STR_FIELD_EMPTY, fields.toString()) );
			}
			
			public Builder() { }
			
			public Builder protocol(Protocol protocol) {
				this.protocol = protocol;
				return this;
			}
			
			public Builder serverName(String serverName) {
				this.serverName = serverName;
				return this;
			}
			
			public Builder serverPort(int serverPort) {
				this.serverPort = serverPort;
				return this;
			}
			
			public Builder urlSuffix(String urlSuffix) {
				this.urlSuffix = urlSuffix;
				return this;
			}
			
			public RestTemplateMetadata build() {
				validate();
				return new RestTemplateMetadata(this);
			}
		}
		
		protected Protocol		protocol;
		protected String		serverName;
		protected int			serverPort;
		protected String		urlSuffix;
		protected URI			baseUri;
		
		private RestTemplateMetadata(Builder builder) {
			assert builder != null;
			
			protocol 	= builder.protocol;
			serverName	= builder.serverName;
			serverPort 	= builder.serverPort;
			urlSuffix 	= builder.urlSuffix;
			baseUri		= builder.baseUri;
		}
		
		public Protocol getProtocol() {
			return protocol;
		}
		
		public String getServerName() {
			return serverName;
		}
		
		public int getServerPort() {
			return serverPort;
		}
		
		public String getUrlSuffix() {
			return urlSuffix;
		}
		
		public URI getBaseUri() {
			return baseUri;
		}
		
		@Override
		public String toString() {
			return baseUri.toString();
		}
	}
	
	public static class RestMetadataChestnyZnak extends RestTemplateMetadata {
		public static class Builder extends RestTemplateMetadata.Builder {
			
			protected String baseQuery		= "pg=milk";
			protected String documentSuffix	= "documents";
			protected String createAction	= "create";
			
			protected void validate() {
				super.validate();
				
				var fields = new StringBuilder();
		    	
		    	if( documentSuffix == null ) fields.append("documentSuffix, ");
		    	if( createAction   == null ) fields.append("createAction, ");
				
				if(fields.length() > 0) throw new IllegalArgumentException( String.format(STR_FIELD_EMPTY, fields.toString()) );
			}
			
			public Builder() { super(); }
			
			@Override
			public Builder protocol(Protocol protocol) {
				super.protocol(protocol);
				return this;
			}
			
			@Override
			public Builder serverName(String serverName) {
				super.serverName(serverName);
				return this;
			}
			
			@Override
			public Builder serverPort(int serverPort) {
				super.serverPort(serverPort);
				return this;
			}
			
			@Override
			public Builder urlSuffix(String urlSuffix) {
				super.urlSuffix(urlSuffix);
				return this;
			}
			
			public Builder baseQuery(String baseQuery) {
				this.baseQuery = baseQuery;
				return this;
			}
			
			public Builder documentSuffix(String documentSuffix) {
				this.documentSuffix = documentSuffix;
				return this;
			}
			
			public Builder createAction(String createAction) {
				this.createAction = createAction;
				return this;
			}
			
			public RestMetadataChestnyZnak build() {
				validate();
				return new RestMetadataChestnyZnak(this);
			}
		}
		
		protected String baseQuery;
		protected String documentSuffix;
		protected String createAction;
		
		private RestMetadataChestnyZnak(Builder builder) {
			super(builder);
			
			baseQuery		= builder.baseQuery;
			documentSuffix 	= builder.documentSuffix;
			createAction 	= builder.createAction;
		}
		
		public String getBaseQuery() {
			return baseQuery;
		}
		
		public String getDocumentSuffix() {
			return documentSuffix;
		}
		
		public String getCreateAction() {
			return createAction;
		}
		
		public URI getDocumentCreationUri() throws URISyntaxException {
			return new URI(baseUri.getScheme(), null, baseUri.getHost(), 
					baseUri.getPort(), baseUri.getPath() + "/" + documentSuffix + "/" + createAction, 
					baseQuery, null);
		}
	}
	
	/**
	 * Base abstract message (document) request processing runnable class
	 *
	 * @param <T> - message (document) type
	 */
	public static abstract class Request<T extends Header> implements Runnable {
		protected static final String STR_REQUEST_ERROR = "Request (id=%s) was processed by remote API " + 
				"with next error '%s', HTTP-response status '%s' expected!";
		
		protected Long			sleepTimeNanos	= -1L;
		protected Consumer<T> 	actionHandler	= null;
		protected Supplier<T>	messageFactory	= null;
		
		protected void triggerEvent(T data, MsgCommand command) {
			assert data != null;
			
			if(actionHandler != null) {
				if(command != null) data.setControlCommand(command);
				actionHandler.accept(data);
			}
		}
		
		protected void triggerEvent(MsgCommand command) {
			if(messageFactory != null) triggerEvent(messageFactory.get(), command);
		}
		
		public Request(Long requestLimit, TimeUnit timeUnit) {
			String strTimeUnit = "timeUnit", strRequestLimit = "requestLimit";
			Long multiplier = -1L;
			
			Objects.requireNonNull(timeUnit, strTimeUnit);
			
			if( (requestLimit > 0) && ( (timeUnit == TimeUnit.NANOSECONDS && requestLimit == (multiplier = 1L)) || 
					(timeUnit == TimeUnit.MICROSECONDS && requestLimit <= (multiplier = Double.valueOf(Math.pow(10, 3)).longValue())) ||
					(timeUnit == TimeUnit.MILLISECONDS && requestLimit <= (multiplier = Double.valueOf(Math.pow(10, 6)).longValue())) ||
					(timeUnit == TimeUnit.SECONDS && requestLimit <= (multiplier = Double.valueOf(Math.pow(10, 9)).longValue())) ||
					(timeUnit == TimeUnit.MINUTES && requestLimit <= (multiplier = Double.valueOf(Math.pow(10, 9)).longValue()*60)) ||
					(timeUnit == TimeUnit.MINUTES && requestLimit <= (multiplier = Double.valueOf(Math.pow(10, 9)).longValue()*3600)) 
					) ){
				sleepTimeNanos = multiplier / requestLimit;
			} else throw new IllegalArgumentException(strRequestLimit);
		}
		
		public void setActionHandler(Consumer<T> actionHandler, Supplier<T>	messageFactory) {
			this.actionHandler = actionHandler;
			this.messageFactory = messageFactory;
		}
	}
	
	/**
	 * Send requests from user to remote API
	 *
	 * @param <T> - message (document) type
	 * @param <U> - security key objects with toString() method defined
	 */
	public static class RequestProcessor<T extends Header, U> extends Request<T> {
		protected BlockingQueue<T>					queue;
		protected Function<T, ResponseEntity<?>> 	restSender;
		
		public RequestProcessor(Long requestLimit, TimeUnit timeUnit, int requestBufferLength, 
				Function<T, ResponseEntity<?>> restSender) {
			super(requestLimit, timeUnit);
			
			String strBuffLen = "requestBufferLength", strRestSender = "restSender";
					
			if(requestBufferLength < 1 || requestBufferLength > 10000) throw new IllegalArgumentException(strBuffLen);
			queue = new ArrayBlockingQueue<>(requestBufferLength);
			
			this.restSender = Objects.requireNonNull(restSender, strRestSender);
		}
		
		/**
		 * Client method to send document request onto remote API "Chestny Znak"
		 * @param document - POJO class mapped to JSON document
		 * @param certificate - authorization certificate for remote API
		 * @return InterruptedException, returns in case of external interruption to maintain it in caller thread, null otherwise
		 */
		public InterruptedException sendRequest(T document, U certificate) {
			String strDocument = "document";
			Objects.requireNonNull(document, strDocument);
			
			if(certificate != null) document.setReservedA( certificate.toString() );
			else document.setReservedA( null );
			
			try {
				queue.put(document);
				return null;
			}catch(InterruptedException ex) {
				return ex;
			}
		}

		@Override
		public void run() {
			T newDoc = null;
			
			try {
				// trigger event to report client about successfully thread starting
				triggerEvent(MsgCommand.STARTED);
				
				String json;
				var mapper = new ObjectMapper().findAndRegisterModules();
				
				while(true) {
					newDoc = queue.take();
					assert newDoc != null;
					
					// in case document is terminal "last wagon"-command (i.e. "poison pill")
					if( newDoc.getControlCommand() == MsgCommand.POISON_PILL ) {
						// it's over - successfully completing all our tasks
						break;
					}
					
					// send user message (requested document) via HTTPS to remote API
					ResponseEntity<?> restResponse = restSender.apply(newDoc);
					assert restResponse != null;
					
					// suppose, HttpStatus.CREATED is OK (no error) answer
					if(restResponse.getStatusCode() == HttpStatus.CREATED) {
						// request was processed (created) by remote API successfully
						// convert current document to JSON for trace & debug purposes
						json = mapper.writeValueAsString( newDoc );
					} else {
						// request was processed (not created) by remote API with some errors
						// inform client about error
						// STR_REQUEST_ERROR = "Request (id=%s) processed with next error '%s'!";
						json = String.format( STR_REQUEST_ERROR, newDoc.getId(), 
								restResponse.getStatusCode().value() + ", " + restResponse.getStatusCode().name(),
								HttpStatus.CREATED.value() + ", " + HttpStatus.CREATED.name() );
					}
					
					newDoc.setReservedB(json);
					
					// trigger event to report client about current document was processed
					triggerEvent(newDoc, null);
					
					// ... let's go to chill several nanoseconds for fulfilling some of our requirements :)
					TimeUnit.NANOSECONDS.sleep(sleepTimeNanos);
				}
				
				// trigger event to report client about successfully thread completion
				triggerEvent(newDoc, null);
			}catch(Throwable ex) {
				MsgCommand err = (ex instanceof InterruptedException) ? MsgCommand.INTERRUPTED : MsgCommand.EXCEPTION;
				if(newDoc != null) triggerEvent(newDoc, err);
				else triggerEvent(err);
				
				// log error
				synchronized (System.err) {
					ex.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * Emulates multiple user requests
	 *
	 * @param <T> - message (document) type
	 */
	public static class RequestGenerator<T extends Header> extends Request<T> {
		protected static final int INT_MAX_GENERATED_DOCS = 10000;
		protected int generatedDocQuan = 0;
		protected BiFunction<T, String, InterruptedException> messageSender;
		
		/**
		 * Generates security key
		 * @return String key
		 */
		protected String generateSecurityKey() {
			return "0d90d966-5027-416f-a0cd-0697db8c79f3";
		}
		
		/**
		 * Prepare terminal message (i.e. "poison pill") competes process
		 * @return generated terminal message
		 */
		protected T preparePoisonPill() {
			String strControlObj = "Error, set the message factory (current value is null) via setActionHandler() method!";
			if(messageFactory == null) throw new IllegalStateException(strControlObj);
			
			T result = messageFactory.get();
			assert result != null;
			result.setControlCommand(MsgCommand.POISON_PILL);
			
			return result;
		}
		
		public RequestGenerator(Long requestLimit, TimeUnit timeUnit, int generatedDocQuan, 
				BiFunction<T, String, InterruptedException> messageSender) {
			super(requestLimit, timeUnit);
			
			String strGeneratedDocQuan = "generatedDocQuan", strMessageSender = "messageSender";
			if(generatedDocQuan < 1 || generatedDocQuan > INT_MAX_GENERATED_DOCS) 
				throw new IllegalArgumentException(strGeneratedDocQuan);
			this.generatedDocQuan = generatedDocQuan;
			
			this.messageSender = Objects.requireNonNull(messageSender, strMessageSender);
		}
		
		@Override
		public void run() {
			T newDoc = null;
			
			try {
				// trigger event to report client about successfully thread starting
				triggerEvent(MsgCommand.STARTED);
				
				assert generatedDocQuan > 1 && generatedDocQuan <= 10000;
				assert messageFactory != null;
				
				// prepare terminal "last wagon"-command (i.e. "poison pill")
				T terminalMessage = preparePoisonPill();
				
				Exception exx = null;
				
				
				for(int i=0; i<generatedDocQuan; i++) {
					// generate new message
					newDoc = messageFactory.get();
					assert newDoc!= null;
					
					// send message to processor thread, which sends it onto API
					exx = messageSender.apply( newDoc, generateSecurityKey() );
					if(exx != null) throw exx;

					// trigger event to report client about current message (document) was processed
					triggerEvent(newDoc, null);
					
					// ... and let's snooze again few nanoseconds for realistic user behavior :)
					TimeUnit.NANOSECONDS.sleep(sleepTimeNanos);
				}
				// feed API processor thread with final "poison pill"-message to complete process ...
				messageSender.apply( terminalMessage, null );
				
				// trigger event to report client about successfully process completion
				triggerEvent(terminalMessage, null);
			}catch(Throwable ex) {
				MsgCommand err = (ex instanceof InterruptedException) ? MsgCommand.INTERRUPTED : MsgCommand.EXCEPTION;
				if(newDoc != null) triggerEvent(newDoc, err);
				else triggerEvent(err);
				
				// log error
				synchronized (System.err) {
					ex.printStackTrace();
				}
			}
		}
	}
	
	protected static	   RestTemplate restTemplate	= null;
	
	protected static 	   URI	  URI_API_DOC_CREATE	= null;
	protected static final String STR_URL_SERVER_NAME	= "ismp.crpt.ru";
	protected static final String STR_URL_APP_SUFFIX	= "api/v3/lk";
	
	protected static final String STR_THREAD_GENERATOR	= "RequestGenerator-thread";
	protected static final String STR_THREAD_PROCESSOR	= "RequestProcessor-thread";
	protected static final String STR_THREAD			= "Thread '%s' %s";
	protected static final String STR_THR_STARTED 		= "has started successfully.";
	protected static final String STR_THR_RUNNING 		= "is running, data trace -> ";
	protected static final String STR_THR_COMPLETED		= "has completed, all data processed :)";
	protected static final String STR_THR_INTERRUPTED	= "was interrupted by someone, exiting :/";
	protected static final String STR_THR_EXCEPTIONED	= "was exceptioned by some critical error unfortunately :(";
	
	protected static String getThreadStatusDesc(MsgCommand command) {
		assert command != null;
		String strCommand = null;
		
		switch(command) {
		case STARTED:
			strCommand = STR_THR_STARTED;
			break;
		case DATA:
			strCommand = STR_THR_RUNNING;
			break;
		case POISON_PILL:
			strCommand = STR_THR_COMPLETED;
			break;
		case INTERRUPTED:
			strCommand = STR_THR_INTERRUPTED;
			break;
		case EXCEPTION:
			strCommand = STR_THR_EXCEPTIONED;
			break;
		default:
			assert false;
		}
		
		return String.format( STR_THREAD, Thread.currentThread().getName(), strCommand );
	}
	
	public static void eventHandler(Document doc) {
		String result = getThreadStatusDesc( doc.getControlCommand() );
		
		// if message is not control signal - prepare data content for output
		if(doc.getControlCommand() == MsgCommand.DATA) {
			// make differ output for visual convenience to distinguish two threads
			if( Thread.currentThread().getName().equals(STR_THREAD_GENERATOR) ) result += doc.getDocId(); // doc id
			else if( Thread.currentThread().getName().equals(STR_THREAD_PROCESSOR) ) result += doc.getReservedB(); // json
			else assert false;
		}
		
		synchronized (System.out) {
			System.out.println(result);
		}
	}
	
	public static ResponseEntity<?> restSender(Document doc){
		if(doc == null) return null;
		
		assert restTemplate != null;
		assert URI_API_DOC_CREATE != null;
		
		// send request to remote API
		ResponseEntity<?> responce = restTemplate.postForEntity(URI_API_DOC_CREATE, doc, Document.class);
		
		return responce;
	}
	
	public static void init() throws URISyntaxException {
		var urlMetadata = new RestMetadataChestnyZnak.Builder()
				.serverName(STR_URL_SERVER_NAME)
				.urlSuffix(STR_URL_APP_SUFFIX)
				.build();
		assert urlMetadata != null;
		
		// construct document creation URI
		URI_API_DOC_CREATE = urlMetadata.getDocumentCreationUri();
		
		// construct RestTemplate https instance
		restTemplate = RestTemplateFactory.getInstance();
	}
	
	public static void launch() throws URISyntaxException, InterruptedException {
		var docGen = new DocumentGenerator();
		
		var reqProc = new RequestProcessor<Document, String>(30L, TimeUnit.MINUTES, 10, CrptApi::restSender);
		reqProc.setActionHandler(CrptApi::eventHandler, docGen);
		var thrProc = new Thread(reqProc, STR_THREAD_PROCESSOR);
		thrProc.start();
		
		var reqGen = new RequestGenerator<Document>(2L, TimeUnit.SECONDS, 10, reqProc::sendRequest);
		reqGen.setActionHandler(CrptApi::eventHandler, docGen);
		var thrGen = new Thread(reqGen, STR_THREAD_GENERATOR);
		thrGen.start();
		
		thrGen.join();
		thrProc.join();
		
		System.out.println("All requested job is done");
	}

	public static void main(String[] args) {
		try {
			init();
			launch();
		}catch(Throwable ex) {
			// log error
			synchronized (System.err) {
				ex.printStackTrace();
			}
		}
	}

}
