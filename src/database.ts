import express, { Request, Response } from 'express';
import mysql from 'mysql';
import mysql2 from 'mysql2';
function connectToMySQL2(): mysql2.Connection {
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

    connection.query('SELECT * FROM employee', (error, results: Employee[]) => {
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
app.get('/GetAllData', async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeesFromDB();
    res.json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

