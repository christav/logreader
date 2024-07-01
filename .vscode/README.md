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
| inc | string | N | Return only lines that include this string |
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
