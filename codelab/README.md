# Google Codelabs Tools

Ce codelab a été créé avec les outils Google Codelabs : https://github.com/googlecodelabs/tools

## Installation des Google Codelabs Tools

L'installation des Google Codelabs Tools nécessite l'installation préalable de Go.

### Sur Mac OS

- Installer Go avec Homebrew :

    ```
    brew install golang
    ```

- Ajouter les variables d'environnement suivantes dans le fichier `~/.zshrc` ou l'équivalent selon le bash utilisé :

    ```
    # Go configuration
    export GOPATH=$HOME/go
    export GOROOT="$(brew --prefix golang)/libexec"
    export PATH="$PATH:${GOPATH}/bin:${GOROOT}/bin"
    ```

- Recharger le bash :

    ```
    source ~/.zshrc
    ```

- Installer les Google Codelab Tools :

    ```bash
    go install github.com/googlecodelabs/tools/claat@latest
    ```

- Vérifier que l'outil `claat` est bien installé :

    ```
    claat help
    ```

### Sur Windows

- Suivre les instructions de la documentation de Go : https://go.dev/doc/install

## Écriture du codelab

Le codelab est généré à partir d'un fichier Markdown respectant le format décrit ici :
https://github.com/googlecodelabs/tools/tree/main/claat/parser/md

## Génération du codelab

- Générer le code source du codelab à partir du fichier Markdown

    ```
    claat export nestjs.md
    ```

- Lancer le codelab en local

    ```
    claat serve
    ```

- Le codelab est lancé sur `http://localhost:9090`, il n'y a plus qu'à cliquer sur le lien `nestjs/`


## Déploiement du codelab sur Github.io

TODO
