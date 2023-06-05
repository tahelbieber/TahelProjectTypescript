import express, { Request, Response } from "express";
// CR minor [clean code]: unused import, remove this
import mysql from "mysql";
import mysql2 from "mysql2";
function connectToMySQL2(): mysql2.Connection {
	const connection = mysql2.createConnection({
		host: "localhost",
		user: "root",
		password: "Tahel12345",
		database: "taheldb",
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

		connection.query(
			"SELECT * FROM employee",
			// CR minor [syntax]: Error - Parameter 'error' implicitly has an 'any' type. ts(7006)
			// Please mention the type of the error parameter
			// In general, there shouldn't be any ts errors/warnings in the code, marked by the linter in red/yellow squigly lines
			(error, results: Employee[]) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}

				connection.end();
			}
		);
	});
}

const app = express();
// CR minor [clean code]: unused parameter "req"
// to mark this parameter as unused, you can rename it to "_", or "_req" from more indicative marking,
// also when using the underscore you don't need to specify the parameter's type
app.get("/GetAllData", async (req: Request, res: Response) => {
	try {
		const employee = await getEmployeesFromDB();
		res.json(employee);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An error occurred" });
	}
});

app.listen(5000, () => {
	console.log("Server is running on port 5000");
});
