/* 
Things we have tested:
- Adding duplicate username / email to userbase (individually and both at the same time)
- Adding sandbox to a user
*/

/* 
Users that have been seeded in the database for testing:

- username: testUser1 (converted to lowercase)
- email: testUser1@someEmail.com (converted to lowercase)
- age: 21
- password: testPassword0!
- sandboxes: Test sandbox one

*/

import sandboxes from "./data/sandboxes.js";
import users from "./data/users.js";
import assert from "assert";

let allUsers;
try {
  allUsers = await users.getAllUsers();
} catch (e) {
  exitWithFailure(e);
}

await testUserData(allUsers);

async function testUserData(userList) {
  for (const user of userList) {
    let sboxes;
    try {
      sboxes = await sandboxes.getSandboxesbyUserId(user._id);
    } catch (e) {
      exitWithFailure(e);
    }
    switch (user.userName) {
      case "testuser1":
        assert.deepEqual(user.email, "testuser1@someemail.com");
        assert.deepEqual(sboxes.length, 1);
        assert.deepEqual(sboxes[0].sandbox_name, "Test sandbox one");
        break;
      default:
        exitWithFailure(`Undefined user in DB: ${user.userName}`);
    }
  }
}

function exitWithFailure(errorMsg) {
  console.error(errorMsg);
  process.exit(1);
}
