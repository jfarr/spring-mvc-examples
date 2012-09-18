Spring-MVC Examples
===================

### Examples

These simple examples demonstrate the basic features of Spring-MVC using both pre-2.0 XML based configuration style
and the latest Spring 3.x annotation-driven style.

This section also demonstrates basic JSON enabled web services using both a pre-RESTful query parameter-based style with Spring 1.2.x 
and a RESTful web services style with Spring 3.x.

* [hello-spring-mvc](https://github.com/jfarr/spring-mvc-examples/tree/master/hello-spring-mvc) - Bare minimum Spring MVC application using a JSP view with JSTL support.
* [multi-action-controller-example](https://github.com/jfarr/spring-mvc-examples/tree/master/multi-action-controller-example) - Simple web application using MultiActonController.
* [json-view-example](https://github.com/jfarr/spring-mvc-examples/tree/master/json-view-example) - Render JSON responses using a Jackson-based JSON marshalling view.
* [json-binding-example](https://github.com/jfarr/spring-mvc-examples/tree/master/json-binding-example) - Bind HTTP POST data to model objects using a JSON HTTP request reader.
* [spring3-example](https://github.com/jfarr/spring-mvc-examples/tree/master/spring3-example) - A modern Spring-MVC application using autowiring and MVC annotations (@Controller, @RequestMapping, etc.)
* [spring3-json-example](https://github.com/jfarr/spring-mvc-examples/tree/master/spring3-json-example) - Example web application and RESTful JSON web service built using the built-in Jackson object mapping support in Spring 3.

### The Example Application

The examples are based on a simple library application that can add then edit a single book.

![Library State Diagram](https://github.com/jfarr/spring-mvc-examples/raw/master/src/site/library_state_diagram.png)

**Figure 1: Library Application State Diagram**

### Testing the JSON Examples

The JSON examples include sample [RESTClient](http://code.google.com/p/rest-client/) requests in the src/test/resources 
folder that can be used to test sending JSON data to and retrieving data from the JSON web service. The sample requests
assume that the application server is running on port 8080, so may need to be modified for your development environment.

### Advanced Examples

These more advanced examples demonstrate backing a RESTful web service with an ORM persistence layer using Hibernate and 
adding fast full-text search using Hibernate Search and Lucene.

This section also demonstrates pure static HTML / Ajax client applications that consume these RESTful web services using raw XmlHttpRequest as well as
the jQuery, jQuery UI, and ember.js frameworks.


* [rest-app-example](https://github.com/jfarr/spring-mvc-examples/tree/master/rest-app-example) - [\[demo\]](http://rest-app-example.cloudfoundry.com/) - A more elaborate example of exposing web applications as HTML or JSON services that builds on the previous examples.
* [json-ajax-example](https://github.com/jfarr/spring-mvc-examples/tree/master/json-ajax-example) - A pure Javascript / Ajax application that consumes the JSON services provided by [rest-app-example](https://github.com/jfarr/spring-mvc-examples/tree/master/rest-app-example).  
* [jquery-ajax-example](https://github.com/jfarr/spring-mvc-examples/tree/master/jquery-ajax-example) - Simplified version of the RESTful JSON application client from [json-ajax-example](https://github.com/jfarr/spring-mvc-examples/tree/master/json-ajax-example) using [jQuery](http://jquery.com/).    
* [hibernate-example](https://github.com/jfarr/spring-mvc-examples/tree/master/hibernate-example) - [\[demo\]](http://hibernate-example.cloudfoundry.com/) - Example HTML / JSON application with an HSQL database back-end using [Hibernate](http://www.hibernate.org/) and JPA annotations.
* [hibernate-search-example](https://github.com/jfarr/spring-mvc-examples/tree/master/hibernate-search-example) - Example HTML / JSON application using [Hibernate Search](http://www.hibernate.org/subprojects/search.html) and [Lucene](http://lucene.apache.org/) for automatic fast full-text search and indexing.
* [jquery-autocomplete-example](https://github.com/jfarr/spring-mvc-examples/tree/master/jquery-autocomplete-example) - An example single-page Ajax application using [JQuery UI](http://jqueryui.com/) and the JSON services provided by the [hibernate-example](https://github.com/jfarr/spring-mvc-examples/tree/master/hibernate-search-example) to implement auto-complete search functionality. 
* [ember-example](https://github.com/jfarr/spring-mvc-examples/tree/master/ember-example) - [\[demo\]](http://jfarr.github.com/spring-mvc-examples/ember-example/books/index.html) - Example application building on jquery-autocomplete-example that uses the [ember.js](http://emberjs.com/) framework to implement a front-end RESTful MVC architecture.
