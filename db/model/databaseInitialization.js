const path = require("path");
const database = require("better-sqlite3");

const options = {
  // verbose: console.log, // development only
};

const db = new database(path.join(__dirname, "..", "cem02braz.db"), options);

//=====================//
//                     //
//   CREATING TABLES   //
//                     //
//=====================//

db.exec(
  `CREATE TABLE IF NOT EXISTS Employee (
    ID INTEGER PRIMARY KEY NOT NULL,
    Name TEXT NOT NULL,
    CPF TEXT NOT NULL UNIQUE,
    Active INTEGER DEFAULT 1,
    ActiveSince TEXT DEFAULT "2021-04-01 00:00:00",
    InactiveSince TEXT
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS Email (
    ID INTEGER PRIMARY KEY NOT NULL,
    EmployeeID INTEGER NOT NULL,
    Address TEXT NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee (ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS Role (
    ID INTEGER PRIMARY KEY NOT NULL,
    EmployeeID INTEGER NOT NULL,
    Registration TEXT NOT NULL,
    Role TEXT NOT NULL,
    Field TEXT NOT NULL,
    Subject TEXT,
    Shift TEXT NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employee (ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS RoleSupervisor (
    ID INTEGER PRIMARY KEY NOT NULL,
    RoleID INTEGER NOT NULL,
    SupervisorRoleID INTEGER,
    CONSTRAINT unique_role_supervisor UNIQUE (SupervisorRoleID, RoleID),
    FOREIGN KEY (RoleID) REFERENCES Role (ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (SupervisorRoleID) REFERENCES Role (ID)
      ON DELETE SET NULL
      ON UPDATE SET NULL
  )`
);

db.exec(
  `CREATE TABLE IF NOT EXISTS ActivityReport (
    ID INTEGER PRIMARY KEY NOT NULL,
    RoleID INTEGER NOT NULL,
    Timestamp TEXT NOT NULL,
    Date TEXT NOT NULL,
    MorningShift TEXT,
    AfternoonShift TEXT,
    NightShift TEXT,
    FOREIGN KEY (RoleID) REFERENCES Role (ID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    )`
);

//====================//
//                    //
//   CREATING VIEWS   //
//                    //
//====================//

db.exec(
  `CREATE VIEW IF NOT EXISTS names_registrations_emails
    AS SELECT Name, Registration, Address as Email
    FROM Employee T JOIN Email E
    ON T.ID = E.EmployeeID
    WHERE T.Active = 1`
);

db.exec(
  `CREATE VIEW IF NOT EXISTS report_activity_log
    AS SELECT Address as Email, Timestamp, Date, MorningShift, AfternoonShift, NightShift
    FROM ActivityReport A JOIN Email E
    ON A.EmployeeID = E.EmployeeID
    ORDER BY Email, Timestamp`
);

//======================//
//                      //
//   CREATING INDEXES   //
//                      //
//======================//

db.exec(
  `CREATE INDEX IF NOT EXISTS  idx_activity_report ON ActivityReport(RoleID, Timestamp)`
);
