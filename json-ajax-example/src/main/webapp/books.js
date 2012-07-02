
/**************************
 * global variables
 */ 

var libraryServiceUrl = 'http://localhost:8080/rest-app-example/library';

/**************************
 * index.html functions
 */ 

function onLoadList() {
	fetchList();
}

function fetchList() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', libraryServiceUrl + '/books/');
	httpRequest.setRequestHeader('Accept', 'application/json;charset=UTF-8');
	httpRequest.onload = onListLoaded;
	httpRequest.send();
}

function onListLoaded() {
	var books = JSON.parse(this.responseText);
	if (books.length == 0) {
		document.getElementById('page').innerHTML = '<p>Library contains no books.</p>';
	} else {
		document.getElementById('page').innerHTML = 
			  '<table>' 
			+ '<tr>'
			+ '<th>Title</th>'
			+ '<th>Author</th>' 
			+ '<th>&nbsp;</th>'
			+ '</tr>'
			+ buildTable(books)
			+ '</table>'
			+ '<hr/>'
			+ 'data: ' + this.responseText;
	}
}

function buildTable(books) {
	var bookTable = '';
	for (var i=0, l=books.length; i < l; i++) {
		var book = books[i];
		bookTable += '<tr>'
			+ '<td><a href="view.html?bookId=' + book.bookId + '">' + book.title + '</a></td>'
			+ '<td>' + book.author + '</td>'
			+ '<td><a href="editForm.html?bookId=' + book.bookId + '">edit</a></td>'
			+ '</tr>';
	}
	return bookTable;
}

/**************************
 * addForm.html functions
 */ 

function onSubmitAdd(form) {
	var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', libraryServiceUrl + '/books/');
    httpRequest.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    httpRequest.onload = function() { window.location = 'index.html'; };
    httpRequest.send(JSON.stringify(buildBook(form)));
}

/**************************
 * editForm.html functions
 */ 

function onLoadEditForm() {
	var bookId = getQueryVariable('bookId');
	if (bookId == null) {
		document.getElementById('page').innerHTML = '<p>Missing bookId.</p>';
	} else {
		fetchView(bookId, onEditViewLoaded);
	}
}

function onEditViewLoaded() {
	var book = JSON.parse(this.responseText);
	document.getElementById('page').innerHTML = 
	     '<form name="editForm" onsubmit="onSubmitEdit(this); return false;">'
	   + '<table>'
	   + '<tr>'
       + '<th>Title</th>'
       + '<td><input type="text" name="title" value="' + book.title + '" /></td>'
       + '</tr>'
       + '<tr>'
       + '<th>Author</th>'
       + '<td><input type="text" name="author" value="' + book.author + '" /></td>'
       + '</tr>'
       + '<tr>'
       + '<td rowspan="2""><input type="submit" name="submit" value="Save" /></td>'
       + '</tr>'
       + '</table>'
       + '<input type="hidden" name="bookId" value="' + book.bookId + '" />'
       + '</form>'
       + '<hr/>'
       + 'data: ' + this.responseText;
};

function onSubmitEdit(form) {
	var httpRequest = new XMLHttpRequest();
    httpRequest.open('PUT', libraryServiceUrl + '/books/book/' + form['bookId'].value);
    httpRequest.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    httpRequest.onload = function() { window.location = 'index.html'; };
    httpRequest.send(JSON.stringify(buildBook(form)));
}

/**************************
 * view.html functions
 */ 

function onLoadView() {
	var bookId = getQueryVariable('bookId');
	if (bookId == null) {
		document.getElementById('page').innerHTML = '<p>Missing bookId.</p>';
	} else {
		var httpRequest = new XMLHttpRequest();
		fetchView(bookId, onViewLoaded);
	}
}

function onViewLoaded() {
	var book = JSON.parse(this.responseText);
	document.getElementById('page').innerHTML = 
		'<table>'
		+ '<tr>'
		+ '<th>Title</th>'
		+ '<td>' + book.title + '</td>'
		+ '</tr>'
		+ '<tr>'
		+ '<th>Author</th>'
		+ '<td>' + book.author + '</td>'
		+ '</tr>'
		+ '</table>'
		+ '<form action="editForm.html?bookId=' + book.bookId + '" method="POST">'
	    + '<input type="submit" name="submit" value="Edit" />'
	    + '</form>'
	    + '<hr />'
	    + 'data: ' + this.responseText;
}

/**************************
 * common functions
 */ 

function buildBook(form) {
	return {
			'title': form['title'].value, 
			'author': form['author'].value
			};
}

function fetchView(bookId, onload) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', libraryServiceUrl + '/books/book/' + bookId);
    httpRequest.setRequestHeader('Accept', 'application/json;charset=UTF-8');
    httpRequest.onload = onload;
    httpRequest.send();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
    return null;
}
