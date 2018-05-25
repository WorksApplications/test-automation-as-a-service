# TaaS Web API Server

## Quick start

### Jenkins Integration

For triggering a job in your Jenkins system, copy `config.yml.example` to `config.yml` and edit your Jenkins integration parameters in the `config.yml` file.

To obtain your username and a Jenkins API token:

* Login to your Jenkins system
* Click your name on the upper-right corner of the page
* Click *Configure* on the left sidebar
* Click *Show API Token...* on the page
* Copy *User ID* to the `username` field of the `config.yml` file
* Copy *API Token* to the `api_token` field of the `config.yml` file

To set a Job token:

* Login to your Jenkins system
* Click the job you want to be triggered
* Click *Configure* on the left sidebar
* Check the *Trigger builds remotely (e.g., from scripts)* checkbox
* Enter any random string into the *Authentication Token* textbox
* Copy *Authentication Token* to the `job_token` field of the `config.yml` file

### Start the server

Switch to the root directory which has a `package.json` file and run:

```
npm install
npm start
```

To run a server with supervisor (restart automatically):

```
npm run forever
```

## Configuration

You may want to change the `config.yml` file to run the server with a different configuration.

## API Reference

### Trigger a test job

#### Request

```
POST /testjobs
```

Request body should be **JSON** encoded.

| Key       | Type         | Description                              |
| --------- | ------------ | ---------------------------------------- |
| `branch`  | String       | The Git branch of your test cases        |
| `url`     | String       | The URL of a target site under test      |
| `channel` | String       | A Slack channel which the test report goes |
| `groups`  | String Array | Enabled TestNG groups                    |

#### Example

```
POST /testjobs HTTP/1.1
Host: 127.0.0.1:5008
Content-Type: application/json
Cache-Control: no-cache

{
	"branch": "develop",
	"url": "https://jillg-develop.hue.worksap.com/",
	"channel": "kuang_qi_test",
	"groups": ["HueCommon"]
}
```

#### Response

Return `HTTP 201` on success.

Response body: `{"info": "A test job is triggered."}`.
