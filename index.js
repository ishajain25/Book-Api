//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initialising express
const shapeAI = express();

//Configurations
shapeAI.use(express.json());

/*
 Route               /
 Description         To get all books
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/" , (req, res) => {
    return res.json({books: database.books});
});

/*
 Route               /is
 Description         To get specific books based on isbn
 Access              Public
 Parameters          isbn
 Method              Get
*/

shapeAI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
}

    return res.json({ book: getSpecificBook});
});

/*
 Route               /c
 Description         To get specific books based on category
 Access              Public
 Parameters          category
 Method              Get
*/

shapeAI.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter((book) => book.category.includes (req.params.category));

    if(getSpecificBooks.length === 0) {
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }
    
        return res.json({ book: getSpecificBooks});
    });


/*
 Route               /a
 Description         To get specific books based on authors
 Access              Public
 Parameters          authors
 Method              Get
*/

shapeAI.get("/a/:authors", (req, res) => {
    const getSpecificBooksAu = database.books.filter((book) => book.authors.includes (parseInt(req.params.authors)));

    if(getSpecificBooksAu.length === 0) {
        return res.json({error: `No book found for the Author ${req.params.authors}`});
    }
    
        return res.json({ book: getSpecificBooksAu});
    });


/*
 Route               /author
 Description         To get all authors
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/author" , (req, res) => {
    return res.json({authors: database.authors});
});

/*
 Route               /au
 Description         To get specific author
 Access              Public
 Parameters          id
 Method              Get
*/
 

shapeAI.get("/au/:id", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) => author.id === parseInt(req.params.id)); //params take string so for id we hv to  parse

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found with Id ${req.params.id}`});
    }

        return res.json({author: getSpecificAuthor });

});    

/*
 Route               /author/
 Description         To get a list of authors based on a book
 Access              Public
 Parameters          isbn
 Method              Get
*/

shapeAI.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) => author.books.includes(req.params.isbn));

    if(getSpecificAuthors.length === 0) {
        return res.json({error: `No author found for the book ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthors });

});

/*
 Route               /publications
 Description         To get all publications
 Access              Public
 Parameters          None
 Method              Get
*/

shapeAI.get("/publications" , (req, res) => {
    return res.json({publications: database.publications});
});

/*
 Route               /book/new
 Description         To add new books
 Access              Public
 Parameters          None
 Method              POST
*/

shapeAI.post("/book/new", (req, res) => {
    //body
    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({books: database.books, message: "book was added!"});
});

/*
 Route               /author/new
 Description         To add new author
 Access              Public
 Parameters          None
 Method              POST
*/

shapeAI.post("/author/new", (req, res) => {
    //body
    const { newAuthor } = req.body;

    database.authors.push(newAuthor);

    return res.json({books: database.authors, message: "Author was added!"});
});

/*
 Route               /book/update
 Description         To update title of a book
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        } 
    });

    return res.json({ books: database.books });
});

/*
 Route               /book/author/update
 Description         To update/add new author
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/book/author/update/:isbn", (req, res) => {
    //update the book database 
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) 
            return book.authors.push(req.body.newAuthor);
    });

    //update the author database 
    database.authors.forEach((author) => {
        if(author.id === req.body.newAuthor) 
        return author.books.push (req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added"
    });
});

/*
 Route               /author/name
 Description         To update author name
 Access              Public
 Parameters          id
 Method              PUT
*/

shapeAI.put("/author/name/:id" , (req, res) => {
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    });

    return res.json({ authors: database.authors });
});

/*
 Route               /publication/update/book
 Description         Update new book to a publication
 Access              Public
 Parameters          isbn
 Method              PUT
*/

shapeAI.put("/publication/update/book/:isbn" , (req, res) => {
    //update the publication database
    database.publications.forEach((publication) => {
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication"
    });
});

shapeAI.listen(3000, () => console.log("Server running!😎"));