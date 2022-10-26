# Harvester

This a simple CLI tool to scrape google search result URLs and store it a Json file.

## Why use this tool?

It is a useful tool to harvest URLs especially with the use of some google Dorks

```sh
node cli.js search --keyword="inurl:career jobs"
```


## How to install

Install the depencies

```sh
npm install
```

## Basic usage

Use search command and --keyword to find something on google
set --page number to scrape the search limit. Default is 1

```sh
node cli.js search --keyword="something to search" --page=5
```