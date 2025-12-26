install:
	npm install

build:
	npm run build

run:
	npm run dev

lint:
	npm run lint

lint-fix:
	npm run lint:fix

test:
	npm test

test-debug:
	npm run test:debug

test-ui:
	npm run test:ui

test-report:
	npm run test:report

test-headed:
	npm run test:headed

# Полная проверка (lint + test)
check: lint test
	@echo "Все проверки пройдены"

