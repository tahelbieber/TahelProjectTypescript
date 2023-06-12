import express, { Request, Response } from 'express';
import mysql2, { Connection } from 'mysql2';

function connectToMySQL2(): Connection {
  const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tahel12345',
    database: 'taheldb'
  });

  connection.connect();

  return connection;
}

interface Employee {
  id: number;
  fullName: string;
  salary: number;
  birthdate: string;
  age: number;
  livesInIsrael: number;
}

function getEmployeesFromDB(): Promise<Employee[]> {
  return new Promise((resolve, reject) => {
    const connection = connectToMySQL2();

    connection.query('SELECT * FROM employee', (error: Error, results: Employee[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }

      connection.end();
    });
  });
}

const app = express();
app.get('/GetAllData', async (_req: Request, res: Response) => {
  try {
    const employees = await getEmployeesFromDB();
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

