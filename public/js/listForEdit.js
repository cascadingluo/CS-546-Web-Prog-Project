// import sandboxes from "../../data/sandboxes.js";
// import {getSandboxesbyUserId, getSandboxesById} from "../..data/sandboxes.js/"

//  _id: ObjectId("661fa1f5e13a4c0a1c72b53b"),
// name: "Solar Sandbox",
// function getSandboxNames(user) {
//     let ret = []
//    let sandboxesLi =getSandboxesbyUserId(user);
//    for(let i = 0; i<sandboxesLi.length; i++){
//     ret.append({name: sandboxesLi[i].name, edit:`/edit/${sandboxesLi[i]._id}`, view:`/view/${sandboxesLi[i]._id}`, share:`/view/${sandboxesLi[i]._id}`})
//    }
//    return ret;
//   }

// https://stackoverflow.com/questions/76187626/sending-json-object-data-to-html-side
// grabbing
async function gettingSandboxes() {
  const response = await fetch('/getSandboxesInfo');
  const sandboxes = await response.json();
  renderList(sandboxes); // uses document
}

async function deleteSandbox(sandboxId) {
  //console.log("Delete called for sandbox:", sandboxId);
  if (confirm("Permanently delete this sandbox?")) {
    try {
      const response = await fetch(`/delete/${sandboxId}`, { method: 'DELETE' });
      if (response.ok) gettingSandboxes();
      else alert('Failed to delete sandbox');
    } catch (e) {
      alert('Error deleting sandbox');
    }
  }
}

window.deleteSandbox = deleteSandbox;

  let l = document.getElementById("sandboxes");
  function renderList(sandboxes) {
    // let sandboxes = getSandboxNames(user)
    var result = "";
    sandboxes.forEach(function (item) {
      const sandboxId = item.edit.split("/edit/")[1];
      result += `<li id="nameLi"> ${item.name} <br>
          <div class="galButtons">
            <form action="${item.edit}"><button id="galBtn">Edit</button></form>
            <form action="${item.view}"><button id="galBtn">View</button><br></form>
            <form><button id="galBtn" onclick="deleteSandbox('${sandboxId}')">Delete</button><form><br>
          </div>
          Share Link: ${item.share} </li>`;
    });
    
   l.innerHTML = result;
  }
  gettingSandboxes();
    // Alternative using arrow function expression:
    // document.getElementById('list').innerHTML = persons.map(person => `<li>${ getFullName(person) }</li>`).join('');
// export {renderList}