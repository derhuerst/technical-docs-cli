# Getting Started with `v5.db.transport.rest`

Let's walk through the **requests that are necessary to implement a typical basic transit app**.

*Note:* To properly & securely handle user input containing URL-unsafe characters, always [URL-encode](https://en.wikipedia.org/wiki/Percent-encoding) your query parameters!

The following code snippets uses [`curl`](https://curl.haxx.se) (a versatile command line HTTP tool) and [`jq`](https://stedolan.github.io/jq/) (the command line swiss army knife for processing JSON).

### 1. search for stops

The `/locations?query=…` route allows you to query stops, points of interest (POIs) & addresses. We're only interested in stops though, so we filter using `poi=false&addresses=false`:

```shell
curl 'https://v5.db.transport.rest/locations?poi=false&addresses=false&query=südkreuz' -s | jq
```

```js
[
	{
		"type": "stop",
		"id": "8011113",
		"name": "Berlin Südkreuz",
		"location": {
			"type": "location",
			"id": "8011113",
			"latitude": 52.47623,
			"longitude": 13.365863
		},
		"products": {
			"nationalExpress": true,
			"national": true,
			// …
		}
	}
	// …
]
```

These are the basics. Check the full [API docs](api.md) for all features!
