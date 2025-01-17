db.createUser({
    user: "root",
    pwd: "example",
    roles: [
        { role: "root", db: "admin" }, // Full access to all databases
        { role: "readWrite", db: "myDatabase" }
      ]
  });