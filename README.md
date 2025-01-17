# Basic Job Wall
This is a very basic job wall it allows users to view jobs which are in the database and create jobs, which allows you to include a redirect link to the offical job listing.

It has a very basic Signup and Login using bcrypt.
## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: bcrypt
- **Deployment**: Render
- **Testing:** Mongoose
- **Version Control**: Git

## Starting the Project
1. clone this repository and open it in a code editor, like Visual Studio Code.
2. type into console: "npm install"
3. rename .env.example to .env
4. go into .env and add a valid mongoDB Database key to the variable name MONGO_URI
5. to start the program type into the console: "npm run start"
	1. or for dev environment: "npm run devStart"


## Features
- **User Authentication**: login and registration for employers
- **Job Creation**: Employers can create company profiles and manage job postings.
- **Update company profiles**: Employers can update their company profile
- **Job Search with filters**

## Primary Pages:
1. "**/users/codejobs**": This is where you can view all the jobs in the database, it also allows you to filter the jobs based on very simple filters.
2. "**/users/codejobs/:companyId**": When you click on a company on the codejobs page it will redirect you to a page where you will be able to view the basic information about the company. If the user who created the company has inputed no values to the company, it won't show any information.
3. "**/users/signup**": This where you register yourself to add jobs later on. The Signup also creates a company which is connected to your Signup. The password you enter will be hashed with bcrypt and is stored in the database.
4. "**/users/login**": This is where you login to your profile. Afterwards you will be redirected to ->
5. "**/users/createjob**": This is where you create a new job which will be shown in the "**/users/codejobs**". This is also where you can update your company information.
## Contact

For questions or support, please contact me at fynn.minden@code.berlin

## License
You can find the License in License.me
