import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// AWS DynamoDB Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

interface FormData {
  name: string;
  surname: string;
  phoneNumber: string;
  address: string;
  citizenshipNumber: string;
  buildingFloors: string;
  buildingStatus: string;
  buildingType: string;
  emergencyNeeds: string;
  dangerousSituation: string;
  numberOfPeople: string;
  medicalNeed: boolean;
  bleedingPatient: boolean;
  unconsciousPatient: boolean;
  shockPatient: boolean;
}

app.post('/submit-form', (req: Request, res: Response) => {
  const formData: FormData = req.body;

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: 'EmergencyFormSubmissions',
    Item: {
      submissionId: uuidv4(),
      ...formData,
    },
  };

  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).send('Error adding item');
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
      res.send('Item added successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
