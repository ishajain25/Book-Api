require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Initialising express
const shapeAI = express();

//Configurations
shapeAI.use(express.json());

//Establish Database Connection
mongoose.connect( process.env.MONGO_URL , 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
)
.then(() => console.log("connection established !!"));


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
 Route               /author
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
 Route               /p
 Description         To get specific publication
 Access              Public
 Parameters          id
 Method              Get
*/
 

shapeAI.get("/p/:id", (req, res) => {
    const getSpecificPublication = database.publications.filter((publication) => publication.id === parseInt(req.params.id)); 

    if(getSpecificPublication.length === 0) {
        return res.json({error: `No publications found with Id ${req.params.id}`});
    }

        return res.json({publications: getSpecificPublication });

});

/*
 Route               /publications
 Description         to get a list of publications based on a book
 Access              Public
 Parameters          isbn
 Method              Get
*/

shapeAI.get("/publications/:isbn", (req,res) => {
    const getSpecificPublications = database.publications.filter((publication) => publication.books.includes(req.params.isbn))

    if(getSpecificPublications.length === 0) {
        return res.json({error: `No publication found with book ${req.params.isbn}`});
    }

        return res.json({publication: getSpecificPublications});
})

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
 Route               /p/new
 Description         To add new publication
 Access              Public
 Parameters          None
 Method              POST
*/

shapeAI.post("/p/new", (req, res) => {
    //body
    const { newPublication } = req.body;

    database.publications.push(newPublication);

    return res.json({books: database.publications, message: "Publication was added!"});
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
 Route               /publication/name
 Description         To update publication name
 Access              Public
 Parameters          id
 Method              PUT
*/

shapeAI.put("/publication/name/:id", (req, res) => {
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.id)) {
            publication.name = req.body.publicationName;
            return;
        }
    })

    return res.json({ publications: database.publications})
})

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

/*
 Route               /book/delete
 Description         delete a book
 Access              Public
 Parameters          isbn
 Method              DELETE
*/

shapeAI.delete("/book/delete/:isbn" , (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
 Route               /book/delete/author
 Description         delete an author from a book 
 Access              Public
 Parameters          isbn, author id
 Method              DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId" , (req, res) => {
    
    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );

            author.books = newBooksList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.authors,
        message: "author was deleted"
    })
});

/*
 Route               /author/delete
 Description         delete an author
 Access              Public
 Parameters          id
 Method              DELETE
*/

shapeAI.delete("/author/delete/:id" , (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.id)
    );

    database.authors = updatedAuthorDatabase;

    return res.json({authors: database.authors});
});

/*
 Route               /publication/delete/book
 Description         delete a book from publication
 Access              Public
 Parameters          isbn, publication id
 Method              DELETE
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId" , (req, res) => {
    //update publication database
    database.publications.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            )

            publication.books = newBooksList;
            return;
        }
    })

    //update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = 0; //no publication available
            return;
        }
    })

    return res.json({
        
        message: "book from publication deleted",
        books: database.books,
        publications: database.publications
    })
})


shapeAI.listen(3000, () => console.log("Server running!😎"));





