// ===== CLASS (Week 7/8: Objects & Classes) =====
class Book {
    constructor(data) {
        this.title = data.title || "No Title";
        this.author = data.author_name ? data.author_name.join(", ") : "Unknown";
        this.year = data.first_publish_year || "N/A";
        this.cover = data.cover_i;
        this.subjects = data.subject || [];
    }

    showDetails(popup, x, y) {
        popup.innerHTML = `
      <b>${this.title}</b><br>
      Author: ${this.author}<br>
      Year: ${this.year}
    `;
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.style.display = "block";
    }
}

// ===== GLOBAL DATA =====
let allBooks = [];

// ===== DISPLAY FUNCTION (Arrow function - Week 6) =====
const displayBooks = (books) => {
    const container = document.getElementById("books");
    const popup = document.getElementById("popup");

    container.innerHTML = "";

    if (books.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const div = document.createElement("div");
        div.className = "book";

        const img = document.createElement("img");
        img.src = book.cover
            ? `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`
            : "https://via.placeholder.com/150";

        const title = document.createElement("p");
        title.innerText = book.title;

        const btn = document.createElement("button");
        btn.innerText = "Show Details";

        // ===== EVENTS (Week 9) =====
        div.addEventListener("mouseover", (e) => {
            book.showDetails(popup, e.pageX, e.pageY);
        });

        div.addEventListener("mouseleave", () => {
            popup.style.display = "none";
        });

        btn.addEventListener("click", (e) => {
            book.showDetails(popup, e.pageX, e.pageY);
        });

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(btn);
        container.appendChild(div);
    });
};

// ===== FETCH DATA (Week 11: Async / Promises) =====
async function fetchBooks(query) {
    try {
        const url = `https://openlibrary.org/search.json?q=${query}&limit=20`;

        const response = await fetch(url);
        const data = await response.json();

        allBooks = data.docs.map(d => new Book(d));

        displayBooks(allBooks);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("books").innerHTML =
            "<p>Error loading books.</p>";
    }
}

// ===== SEARCH BUTTON =====
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;

    // ===== DEFAULT LANGUAGE (Week 6 concept) =====
    const lang = document.getElementById("language").value || "english";

    // (We don't use lang in API, but we still implement the concept)
    console.log("Language:", lang);

    fetchBooks(query || "fiction");
});

// ===== GENRE FILTER (Week 10) =====
document.getElementById("genre-select").addEventListener("change", (e) => {
    const genre = e.target.value.toLowerCase();

    if (!genre) {
        displayBooks(allBooks);
        return;
    }

    const filtered = allBooks.filter(book =>
        book.subjects.some(s =>
            s.toLowerCase().includes(genre)
        )
    );

    displayBooks(filtered);
});

// ===== INITIAL LOAD (IMPORTANT FIX) =====
document.addEventListener("DOMContentLoaded", () => {
    fetchBooks("bestseller"); // ✅ ALWAYS loads books on start
});