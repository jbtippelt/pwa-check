deps = ${frontendDir}node_modules
bin = ${deps}/.bin
ng = ${bin}/ng
ghpages = ${bin}/angular-cli-ghpages
jest = ${bin}/jest
prettier = ${bin}/prettier

clean: clean
	rm -rf dist
.PHONY: clean

prune: clean
	rm -rf ${deps}
.PHONY: prune

deps: ${deps}
.PHONY: deps

${deps}: package.json package-lock.json
	npm install --no-audit ||  { touch package-lock.json; exit 1; }
	touch ${deps}

dev: deps
	${ng} serve

publish: deps
	${ng} build --prod --base-href https://jbtippelt.github.io/pwa-check/;
	${ghpages} -d dist/pwa-check/ --no-silent --repo=https://github.com/jbtippelt/pwa-check.git;
.PHONY: publish