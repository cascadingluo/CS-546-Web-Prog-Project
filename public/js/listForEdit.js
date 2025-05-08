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

  let l = document.getElementById("sandboxes");
  function renderList(sandboxes) {
    // let sandboxes = getSandboxNames(user)
    var result = "";
    sandboxes.forEach(function (item) {
      result += "<li>" + item.name + `<a href =${item.edit}><button>Edit</button></a><a href =${item.view}><button>View</button></a>` + "Share Link:" + item.share+ '</li>';
    });
    
   l.innerHTML = result;
  }
  gettingSandboxes();
    // Alternative using arrow function expression:
    // document.getElementById('list').innerHTML = persons.map(person => `<li>${ getFullName(person) }</li>`).join('');
// export {renderList}