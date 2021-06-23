## Build Instructions

1. Edit the `sample.env` file and add Postgres Credentials in the environment variables and then rename the file to `.env`
2. The script for creating the table used in development is in the folder `TableData` and the file is named `CreateTable.sql`.
3. The binary dump of the table is in `TableData/RestaurantList`. Encoding : `BIG_5`. Can be imported with **pgadmin**

4. ```
    npm install
    ```` 
5. ```
      npm start
   ```