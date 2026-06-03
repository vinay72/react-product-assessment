Architectural decision

I chose React Context for cart state because this is a single-product PDP with a minimal global state requirement. The two reasonable alternatives were a lightweight state library such as Zustand or keeping state local to the page and passing callbacks through components. I picked Context because it preserves a simple global API for cart operations, keeps cart persistence centralized in one place, and matches the assignment requirement to use a React global state solution without introducing extra dependencies.

Tabs vs Accordion

I used tabs for the product details section because the content is discrete, easy to scan, and users can instantly switch between description, specifications, and reviews on desktop and mobile. An accordion would also have been acceptable, but tabs feel more suited to the product-detail experience here because the information is not lengthy enough to require section expansion behavior.

More time improvements

With more time I would add a small cart drawer or badge summary to show cart contents beyond the cart item count and surface precise variant availability in the URL for deeper sharing. I would also improve the image gallery with separate product images per colour variant and a real zoom lens implementation. Finally, I would add unit tests for the cart reducer, variant selection logic, and localStorage persistence.

Trade-offs

The product data is fetched from Fake Store API for the base product metadata, while variant-specific details such as color swatches, stock matrices, specifications, and reviews are defined locally. This approach preserves the API requirement without forcing Fake Store data to dictate UI-specific variant behavior.
