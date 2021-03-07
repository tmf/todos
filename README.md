# Todos

A dependency-free todo application built with the modern capabilities of the web platform, avoiding intermediate complexity where possible. 

## Features

- 📦 No external code dependencies
- 🌈 Progressive web application
- 🤖 Automated workflows
- ⚡️ Lighthouse score 100/100


## Requirements

- Web server: Apache httpd, nginx, GH Pages, S3, ...
- Browser: [Firefox](https://mozilla.org/firefox/all/#product-desktop-developer), [Chrome](https://google.com/chrome/), [Safari](https://developer.apple.com/safari/download/), [Edge](https://microsoft.com/edge) 

## Web server

<details><summary>OSX built-in Apache</summary>

1. Create certificate with:
    ```sh
    sudo ssh-keygen -f server.key
    sudo openssl req -new -key server.key -out request.csr
    sudo openssl x509 -req -in request.csr -signkey server.key -out server.crt
    ```

1. Add the following to `/private/etc/apache2/other/.conf`:
    ```
    Listen 443
    LoadModule ssl_module libexec/apache2/mod_ssl.so
    SSLCertificateFile "/Users/you/Sites/todos/server.crt"
    SSLCertificateKeyFile "/Users/you/Sites/todos/server.key"
    <VirtualHost 127.0.0.1:80>
        ServerName localhost
        DocumentRoot "/Users/you/Sites/todos/docs"
        <Directory "/Users/you/Sites/todos/docs">
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost>
    
    <VirtualHost 127.0.0.1:443>
        ServerName localhost
        DocumentRoot "/Users/you/Sites/todos/docs"
        SSLEngine on
        SSLCipherSuite ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP:+eNULL
        SSLCertificateFile /Users/you/Sites/todos/server.crt
        SSLCertificateKeyFile /Users/you/Sites/todos/server.key
        <Directory "/Users/you/Sites/todos/docs">
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost
    ```

1. Restart the webserver with the new configuration
    ```sh
    sudo /usr/sbin/apachectl restart # reload apache virtual hosts
    ```
</details>
<details><summary>nginx with Docker</summary>

Requirements:
- [Docker](https://www.docker.com/products/docker-desktop)
- SSL setup:

    <details><summary>mkcert setup</summary>
    - [mkcert](https://github.com/FiloSottile/mkcert)

    In order to access the web server via `https://` without warnings we can generate a locally trusted self-signed certificate with `mkcert`:

    ```sh
    mkcert localhost # generate localhost.pem + localhost-key.pem
    mkcert -install # install local mkcert certificate authority
    ```

    </details>

    <details><summary>openssl setup</summary>

    1. Create certificate authority
        
        ```sh
        sudo openssl genrsa \
            -out /etc/ssl/private/localhostCA.key \
            2048
        sudo openssl req \
            -new \
            -x509 \
            -sha256 \
            -days 365 \
            -nodes \
            -key /etc/ssl/private/localhostCA.key \
            -out /etc/ssl/certs/localhostCA.pem
        ```

    1. Install certificate authority locally
        - Firefox:
            Preferences -> Privacy & Security -> Certificates -> View Certificates -> Authorities -> Import
        - Chrome:
            Settings -> Advanced -> Privacy and security -> Manage certificates -> Authorities -> Import

    1. Create CSF configuration:
        
        `localhost.cnf`:
        ```conf
        [req]
        default_bits = 2048
        distinguished_name = req_distinguished_name
        prompt = no

        [req_distinguished_name]
        C = CH
        ST = Zurich
        L = Zurich
        O = localhost
        CN = localhost

        [v3_ca]
        subjectAltName = @alt_names

        [alt_names]
        DNS.1 = localhost
        ```

    1. Create CSR

        ```sh
        openssl req \
            -new \
            -config localhost.cnf \
            -sha256 \
            -nodes \
            -newkey rsa:2048 \
            -keyout localhost-key.pem \
            -out localhost.csr
        ```

    1. Create certificate

        ```sh
        sudo openssl x509 \
            -req \
            -in localhost.csr \
            -CA /etc/ssl/certs/localhostCA.pem \
            -CAkey /etc/ssl/private/localhostCA.key \
            -CAcreateserial \
            -out localhost.pem \
            -sha256 \
            -days 3650 \
            -extfile localhost.cnf \
            -extensions v3_ca
        ```

    1. Clean up files

        ```sh
        rm localhost.cnf localhost.csr
        ```

    </details>

The `docs` directory can be served by any web server, such as `nginx`:

```sh
docker run \
	--name todos-nginx \
	--rm \
	-p 80:80 \
	-p 443:443 \
	-v $PWD/docs:/usr/share/nginx/html/todos \
	-v $PWD/.github/nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf \
	-v $PWD/localhost.pem:/etc/nginx/conf.d/localhost.crt \
	-v $PWD/localhost-key.pem:/etc/nginx/conf.d/localhost.key \
	nginx:latest
```

- > By giving the container a name, it becomes easier to identify the container with `docker ps`.
- > The `--rm` flag is used to not aggregate docker containers locally: otherwise stopped containers have to be cleaned up with `docker rm`.
- > As the docker engine runs with elevated privileges we can directly open port `80`, bypassing the need for prompting super-user privileges with `sudo` for ports lower than `1024`.
- > The volume mount of the `docs` directory in the `nginx` default site root allows live-editing the source files without restarting the container.
- > The `docs` folder is just for using GH Pages from a repository folder, otherwise it would be named `public` or `src`...
</details>

<details><summary>GH Pages</summary>

`/docs` folder as source: [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source)

</details>
<details><summary>S3</summary>

[AWS Toolkit for Visual Studio Code](https://aws.amazon.com/visualstudiocode/)

</details>

Navigate to the web server with a browser:

```sh
open https://localhost/todos
```

## License

This project is licensed under the [MIT](LICENSE) license.
