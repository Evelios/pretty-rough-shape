# Pretty Rough Shape

A comic website for the web comic strip "Pretty Rough Shape"

## Installation:

__If using the Apple M1 chip__: [Installing jekyll](https://www.earthinversion.com/blogging/how-to-install-jekyll-on-appple-m1-macbook/)


```sh
npm install -g gulp  # Install bundle manager if not already done

npm install
npm install --target_arch=xc64  # Use this instead for MacOS with M1 chip

gem install jekyll jekyll-paginate jekyll-sitemap
```

## Development

Build the website
```sh
gulp jekyll-build
```

Re-build the website
```sh
gulp jekyll-rebuild
```

Build the website and then launch the server
```sh
gulp browser-sync
```

Watch the scss, html, and img files
```sh
gulp watch
```