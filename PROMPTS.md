- "react-router-dom example"
- "swr vs react query"

- <br>

```
i have this code:
const prevPage = () => {
    if (pagination > 1) {
      setPagination((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const nextPage = () => {
    if (data && pagination < data.pagination.last_visible_page) {
      setPagination((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
next page function is okay, but prevPage is not scrolling on top from page 2 to page 1. can you explain to me?
```

- change this to typescript:`
const fetcher = (...args) => fetch(...args).then((res) => res.json());`
