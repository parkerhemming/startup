const { S3Client } = require("@aws-sdk/client-s3");
const { fromIni } = require("@aws-sdk/credential-providers");
const path = require("path");

const s3Client = new S3Client({
	region: "us-east-1",
	credentials: fromIni({
		filepath: path.join(__dirname, "aws-credentials.ini"),
		profile: "local",
	}),
});

module.exports = { s3Client };
