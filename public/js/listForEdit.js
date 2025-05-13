async function gettingSandboxes() {
  const response = await fetch("/getSandboxesInfo");
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
            <button id="galBtn" onclick="deleteSandbox('${sandboxId}')">Delete</button><br>
          </div>
          Share Link: ${item.share} </li>`;
    });
    
   l.innerHTML = result;
  }
  gettingSandboxes();