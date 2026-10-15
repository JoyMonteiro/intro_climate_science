# Introduction to Climate Science

Course website, published at https://joymonteiro.github.io/intro_climate_science/

GitHub Pages builds the site with plain Jekyll on every push to `main`; there is
no theme. Edit `index.md` for the content. The look lives in
`_layouts/default.html` and `css/site.css`.

## Adding a lecture

1. Export the deck from [pres-sure](https://joymonteiro.github.io/pres-sure/)
   into its own folder, e.g. `lectures/03-ocean-circulation/` (the folder holds
   the exported `index.html` and any images next to it).
2. Add an entry to the list in `index.md`:

   ```markdown
   3. **[Ocean circulation](lectures/03-ocean-circulation/)**
      *3 Feb* · How heat moves around the planet.
   ```

   An entry whose title has no link shows as upcoming (greyed out).
   Keep the `{: .lectures}` line directly under the list.

Course details (code, semester, instructor, description, contact and license)
are in the front matter at the top of `index.md`.
