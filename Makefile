install:
	npm install

build:
	npm run build

run:
	npm run dev

lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

test:
	npx playwright test

test-debug:
	npx playwright test --debug

