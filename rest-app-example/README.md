REST Application Example
========================

Simple example of a RESTful web application that exposes both HTML and JSON interfaces using Spring 3.x and Spring-MVC.

### The Example Application

This example builds on the application state machine of the previous examples by adding a list state, so the application
can view, add, or edit multiple books:

![Library State Diagram](https://github.com/jfarr/spring-mvc-examples/raw/master/rest-app-example/src/site/library_state_diagram.png)

**Library Application State Diagram**

The example implements the two web application interfaces using two different controller classes that
both derive from AbstractBookController:

* HtmlBookController - implements the application above by rendering HTML views and accepting HTML encoded data (form-urlencoded and multipart/form)
* JsonBookController - implements a subset of the application states by rendering JSON views and accepting JSON encoded data:
    * list, view - renders JSON views of these application states
    * save - accepts JSON encoded data and persists the application state
 
 AbstractBookController implements the basic book persistence (CRUD operations). The derived classes implement the application state
 changes (building the next model state and selecting the view to render).
 