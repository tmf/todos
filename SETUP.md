# Setup

- [Get started locally](#get-started-locally)
- [Source code](#source-code)
- [Certificate with mkcert](#certificate-with-mkcert)
- [Certificate with openssl](#certificate-with-openssl)
- [OSX Apache](#osx-apache)
- [nginx with Docker](#nginx-with-docker)
- [Github Pages](#github-pages)

## Get started locally
1. Get the [Source code](#source-code)
1. Create `localhost.pem` and `localhost-key.pem` either with [Certificate with mkcert](#certificate-with-mkcert) or [Certificate with openssl](#certificate-with-openssl)
1. Start web server either with [OSX Apache](#osx-apache) or [nginx with Docker](#nginx-with-docker)
1. Open [https://localhost/todos](https://locahost/todos)

## Source code

You can get the source code with `git` or by directly downloading a `zip` file:
- By `git`:
	If you don't have `git`, follow these instructions: [git-scm.com/video/get-going](https://git-scm.com/video/get-going).

	```sh
	git clone https://github.com/tmf/todos.git # clones repository into `todos` directory
	```

- By `zip`:
	Download [`main.zip`](https://github.com/tmf/todos/archive/main.zip) and unzip it:

	```sh
	unzip main.zip todos # unzips source code into `todos` directory
	```

## Certificate with mkcert

In order to access the web server via `https://` without warnings we can generate a locally trusted self-signed certificate with [`mkcert`](https://github.com/FiloSottile/mkcert):

```sh
mkcert localhost # generate localhost.pem + localhost-key.pem
mkcert -install # install local mkcert certificate authority
```

## Certificate with openssl

If you don't have a certificate authority already, you need to create it once by:

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

The certificate can then be created with a Certificate Signing Request (CSR):

1. Create CSR configuration:
	
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
	O = tmf
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
		-days 365 \
		-extfile localhost.cnf \
		-extensions v3_ca
	```


## OSX Apache

1. Generate `localhost.pem` and `localhost-key.pem` with either [Certificate with mkcert](#certificate-with-mkcert) or [Certificate with openssl](#certificate-with-openssl)

1. Add the following to `/private/etc/apache2/other/.conf`, by replacing all `/Users/you/Sites/todos` path prefixes with the absolute path to the `todos` repository :
	```
	Listen 443
	LoadModule ssl_module libexec/apache2/mod_ssl.so

	<VirtualHost 127.0.0.1:80>
		ServerName localhost
		Redirect 307 / https://localhost
	</VirtualHost>
	
	<VirtualHost 127.0.0.1:443>
		ServerName localhost
		SSLEngine on
		SSLCertificateFile /Users/you/Sites/todos/localhost.pem
		SSLCertificateKeyFile /Users/you/Sites/todos/localhost-key.pem
		<Location "/todos">
			Alias "/Users/you/Sites/todos/docs"
		</Location>
	</VirtualHost
	```

1. Restart the web server with the new configuration
	```sh
	sudo /usr/sbin/apachectl restart
	```

## nginx with Docker

1. Generate `localhost.pem` and `localhost-key.pem` with either [Certificate with mkcert](#certificate-with-mkcert) or [Certificate with openssl](#certificate-with-openssl)

1. The `docs` directory can be served with `nginx` via this `docker` command:

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

	- By giving the container a name, it becomes easier to identify the container with `docker ps`.
	- The `--rm` flag is used to not aggregate docker containers locally: otherwise stopped containers have to be cleaned up with `docker rm`.
	- As the docker engine runs with elevated privileges we can directly open port `80`, bypassing the need for prompting super-user privileges with `sudo` for ports lower than `1024`.
	- The volume mount of the `docs` directory in the `nginx` default site root allows live-editing the source files without restarting the container.
	- server configuration is in [`.github/nginx/conf.d/default.conf`](.github/nginx/conf.d/default.conf)
	- The `docs` folder is just for using Github Pages from a repository folder, otherwise it would be named `public` or `src`...

## Github Pages

Requirements:
- public repository
- or Pro Github account for private repositories

`/docs` folder as source: [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#choosing-a-publishing-source)

This project is hosted by Github Pages on https://tmf.github.io/todos:

![](https://user-images.githubusercontent.com/1573003/110827388-4fc5cb00-8296-11eb-9b91-3a9e27b74d44.png)
