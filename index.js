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



shapeAI.listen(3000, () => console.log("Server running!😎"));