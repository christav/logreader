# ctlogsvr - A Log File Reader Service
![image of a log with text wrapped around it](/docs/logo.png)

## Introduction

This project supplies a simple server that exposes a API route
that will let you return log lines, newest log first, from log
files stored locally on the machine running the server.

## Setup and Requirements

The service is written in [Node.js](https://nodejs.org). It should be cross platform, but currently has only been tested on Windows 10 and 11.

To set up the server:
1. Install node.js on your machine if not already there. It has been tested with Node v20 and v22.
2. Clone this repository into the directory you wish to install to.
2. In the install directory, run `npm install` to pull down the dependencies.
3. In the install directory, run `npm run build` to compile the code.

## Running the service

There are three environment variables you can use to control the behavior of the service.

* LOG_FILES_DIR (required) - absolute path to the directory containing the logs you wish to access. This is the *only* directory that log files can be read from.
* LOG_LEVEL (optional, defaults to "info") - set the logging level for the service, for debugging or extra information. Valid log levels are `trace`, `debug`, `info`, `warn`, `error`, and `fatal`.
* PORT (optional, defaults to 3001) - port number to run the server on.

Once you've set the environment variables, you can run it by running `node build/index.js`.

### Examples

Linux:

*Serve up files in /var/logs, running on port 8888*
```bash
$ LOG_FILES_DIR=/var/logs PORT=8888 node build/index.js
```

Windows:

*Serve files from C:\ProgramData\logs, running on the default port*

Powershell:
```powershell
> $env:LOG_FILES_DIR="C:\ProgramData\logs"
> node build/index.js
```
cmd.exe:
```cmd
> SET LOG_FILES_DIR=C:\ProgramData\logs
> node build\index.js
```

## Log File Format

This service makes very little assumptions about the contents of the log files. All it requires is:
* The newest log record is at the end of the file.
* The file is written with one log entry per line, with lines separated by either lf (Unix/Mac format) or cr lf (Windows format) characters.
* The file contents are in UTF-8 encoding.

The output is undefined if the log does not meet these requirements.

## The API

The server exposes a single route, `/logs`, over the http protocol.

|Route|HTTP Verb|
|-----|---------|
| /logs| GET |

|Query String Parameter|Type|Required|Description|
|----------------------|----|-|-|
| log | string | Y | The log file to read |
| inc | string | N | Return only lines that include this string. This is an exact, case sensitive match. |
| n | integer > 0 | N | The maximum number of lines to return |

### Return formatting

This route can return the log data in one of three formats:
 * A json array of strings
 * Plain text separated by newline characters
 * List of HTML `<li>` elements

 The return format is controlled by the Accept header passed in the request.

| Accept Header Value | Output Format |
|-|-|
| text/plain | newline separated text |
| text/html | HTML `<li>` elements |
| application/json | json |

If no accept header is sent, or it's unrecognized, the default format is json.

### Example API calls

---
*First 50 lines from log0.log*

Request:
```
curl --request GET \
  --url 'http://localhost:3001/logs?log=log0.log&n=50'
```

Response:
```json
[
	"140.15.84.188 - roob6486 [01/Jul/2024:00:02:21 +0000] "PUT/seamless/impactfulHTTP/1.1" 204 7657",
	"138.38.183.185 - bogan7386 [01/Jul/2024:00:02:21 +0000] "PATCH/value-added/incubate/content/holisticHTTP/1.1" 403 17708",
	"182.87.19.104 - marks5378 [01/Jul/2024:00:02:21 +0000] "DELETE/niches/turn-key/evolveHTTP/1.0" 304 5505",
	"87.202.163.127 - gleichner5212 [01/Jul/2024:00:02:21 +0000] "POST/strategic/deliver/roiHTTP/2.0" 501 26608",
	"36.41.141.137 - boehm7472 [01/Jul/2024:00:02:21 +0000] "POST/supply-chains/deployHTTP/1.1" 304 9986",
	"140.222.115.218 - - [01/Jul/2024:00:02:21 +0000] "PUT/metrics/proactive/matrixHTTP/1.0" 500 4963",
	"220.28.229.117 - kohler1007 [01/Jul/2024:00:02:21 +0000] "PUT/morph/e-business/transitionHTTP/1.0" 416 22623",
	"207.210.34.12 - - [01/Jul/2024:00:02:21 +0000] "POST/disintermediate/e-commerceHTTP/1.0" 403 9536",
	"112.209.253.18 - mante8416 [01/Jul/2024:00:02:21 +0000] "PATCH/e-marketsHTTP/1.0" 501 20266",
	"188.149.63.124 - - [01/Jul/2024:00:02:21 +0000] "POST/24%2f7HTTP/2.0" 205 29473",
    ... 40 more lines ...
]
```
---
*All lines in log1.log that contain the string POST, in plain text*

Request:
```
curl --request GET \
  --url 'http://localhost:3001/logs?log=log1.log&inc=POST' \
  --header 'Accept: text/plain'
```

Response:
```
249.254.226.10 - - [01/Jul/2024:00:04:30 +0000] "POST /vortals/synergize/unleash HTTP/2.0" 200 24438
61.236.179.114 - schiller4836 [01/Jul/2024:00:04:30 +0000] "POST /dynamic HTTP/2.0" 205 11587
194.161.118.129 - sawayn4657 [01/Jul/2024:00:04:30 +0000] "POST /methodologies HTTP/1.0" 503 21591
128.71.251.66 - leannon5751 [01/Jul/2024:00:04:30 +0000] "POST /enhance/transform HTTP/1.1" 204 7721
189.148.228.39 - - [01/Jul/2024:00:04:30 +0000] "POST /portals/strategize/24%2f365/transform HTTP/2.0" 403 7646
180.109.14.85 - farrell5770 [01/Jul/2024:00:04:30 +0000] "POST /content/initiatives/aggregate HTTP/1.1" 203 15857
44.94.93.12 - lemke4040 [01/Jul/2024:00:04:30 +0000] "POST /rich/enterprise/24%2f365 HTTP/1.1" 400 11339
22.5.53.60 - kozey2351 [01/Jul/2024:00:04:30 +0000] "POST /transform/scale/convergence HTTP/2.0" 302 19074
110.221.83.48 - - [01/Jul/2024:00:04:30 +0000] "POST /open-source/whiteboard HTTP/1.0" 403 17096
166.86.146.106 - padberg4128 [01/Jul/2024:00:04:30 +0000] "POST /cross-platform/portals/distributed/front-end HTTP/2.0" 201 12753
... more lines ...
```

---
*First 10 lines of log10k.log, including the string GET, in HTML format*

Request:
```
curl --request GET \
  --url 'http://localhost:3001/logs?log=log10k.log&inc=GET&n=10' \
  --header 'Accept: text/html'
```

Response:
```
<li>208.208.124.105 - beahan5441 [01/Jul/2024:00:07:23 +0000] "GET /engineer/b2c HTTP/1.0" 304 8526</li>
<li>128.121.113.174 - von5217 [01/Jul/2024:00:07:23 +0000] "GET /content HTTP/1.0" 501 23011</li>
<li>201.236.38.12 - - [01/Jul/2024:00:07:23 +0000] "GET /syndicate HTTP/2.0" 403 8453</li>
<li>78.29.152.42 - kerluke6455 [01/Jul/2024:00:07:23 +0000] "GET /supply-chains/roi/ubiquitous HTTP/1.1" 201 3119</li>
<li>196.154.183.173 - - [01/Jul/2024:00:07:23 +0000] "GET /end-to-end/wireless/networks/brand HTTP/1.0" 405 13345</li>
<li>64.67.41.122 - - [01/Jul/2024:00:07:23 +0000] "GET /methodologies HTTP/2.0" 400 13320</li>
<li>175.208.179.219 - - [01/Jul/2024:00:07:23 +0000] "GET /integrate/brand/vertical HTTP/1.1" 406 5105</li>
<li>162.194.67.231 - - [01/Jul/2024:00:07:23 +0000] "GET /compelling HTTP/2.0" 401 19607</li>
<li>77.219.109.163 - - [01/Jul/2024:00:07:23 +0000] "GET /benchmark/web-enabled/cross-media HTTP/2.0" 406 25115</li>
<li>216.70.108.159 - lueilwitz3173 [01/Jul/2024:00:07:23 +0000] "GET /users/recontextualize/bricks-and-clicks HTTP/2.0" 405 6574</li>
```
