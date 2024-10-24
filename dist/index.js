"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// AWS DynamoDB Configuration
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    const params = {
        TableName: 'EmergencyFormSubmissions',
        Item: {
            submissionId: (0, uuid_1.v4)(),
            ...formData,
        },
    };
    dynamoDB.put(params, (err, data) => {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            res.status(500).send('Error adding item');
        }
        else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.send('Item added successfully');
        }
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
