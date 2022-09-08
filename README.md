# Pretty Rough Shape

A comic website for the web comic strip "Pretty Rough Shape"

## Installation:

1. Download your editor of choice, for example [Visual Studio Code](https://code.visualstudio.com/download)

2. Install the version control software [git](https://git-scm.com/downloads) with all the defaults the installer gives
   you
    * [Generate an SSH Key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
      Type this into your git bash console
     ```sh
     eval `ssh-agent -s`
     ssh-keygen -t ed25519 -C "your_email@example.com"
     ssh-add ~/.ssh/id_ed25519
     clip < ~/.ssh/id_ed25519.pub # This copies your ssh key to your clipboard
     ```
    * [Add the SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
        + Under your GitHub profile go to __Settings -> SSH and GPG Keys -> New SSH Key__
        + Paste the SSH key from the previous command into that box and give your PC Key a name and press __Add SSH
          Key__
        
3. Following the instructions for [installing Jekyll and Ruby](https://jekyllrb.com/docs/installation/windows/)
    * Download & install [Ruby+Devkit](https://www.ruby-lang.org/en/) with the RubyInstaller
        + Install Ruby with the `MSYS2 and MINGW development tool chain`
        + This should open a new window `rdisk install` where you download extra Ruby libraries

4. Open the _Git Bash_ terminal and move into the parent directory that you want to put the `pretty-rough-shape` code
   directory and then clone the repository there. For example,
   ```sh
   cd "~/Documents/Web"
   git clone https://github.com/Evelios/pretty-rough-shape.git
   cd pretty-rough-shape
   ```

5. Install project automation tools

   ```sh
   # Install the project's automation tools
   npm install -g gulp gulp-cli
   ```

6. Download and install the project library dependencies

    __Windows__
    
   ```sh
   npm install
   ```

   If this fails run the following command and then run `npm install` again.
   ```sh
   npm install -g pngquant-bin
   ```

   __MacOS__

   ```sh
   npm install
   ```

   > Install additional repository
      .If using the __Apple M1 chip__: Additional information for setup can be found
      for [installing jekyll with the M1.](https://www.earthinversion.com/blogging/how-to-install-jekyll-on-appple-m1-macbook/)

      ```sh
      npm install --target_arch=xc64  # Use this instead for MacOS with M1 chip
      
      ```
7. Install the Ruby dependency files through the `gem` ruby package manager program
   ```sh
   gem install -g Gemfile
   ```

## Installation Verification

Open up a new __Git Bash__ terminal and run the following commands. You should be able to run all of the following commands to check that the the programs are installed. It will show you the programs current version. If it says that command is not found, then installation for that program has failed, or the system `PATH` is not correctly pointing to that binary execuitable for that program.

```sh
node -v
npm -v
ruby -v
gem -v
jekyll -v
gulp -v
```

## Development

* Standard development with live reload, watch the scss, html, and img files
   ```sh
   gulp watch
   ```

* Build the website
   ```sh
   gulp jekyll-build
   ```

* Re-build the website
   ```sh
   gulp jekyll-rebuild
   ```

* Build the website and then launch the server
   ```sh
   gulp browser-sync
   ```

* For just Jekyll building without the assistance of the `Gulp` command you can use the following command to get better debugging
   ```sh
   bundle exec jekyll serve --livereload
   ```
