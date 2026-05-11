import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
getDatabase,
ref,
set,
get,
child,
update
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
apiKey: "YOUR_KEY",
authDomain: "YOUR_DOMAIN",
databaseURL: "YOUR_DB",
projectId: "YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// UI
window.goAuth = () => {
document.getElementById("authPage").style.display="block";
}

window.showSignup = () => {
loginBox.classList.add("hidden");
signupBox.classList.remove("hidden");
}

window.showLogin = () => {
signupBox.classList.add("hidden");
loginBox.classList.remove("hidden");
}

// SIGNUP
window.signup = async () => {

const user = await createUserWithEmailAndPassword(auth,email.value,pass.value);

await set(ref(db,"users/"+user.user.uid),{
name:name.value,
username:username.value,
balance:0
});

showMain(username.value,0);

}

// LOGIN
window.login = async () => {

const user = await signInWithEmailAndPassword(auth,loginEmail.value,loginPass.value);

const snap = await get(child(ref(db),"users/"+user.user.uid));
const data = snap.val();

showMain(data.username,data.balance);

}

function showMain(name,balance){
authPage.style.display="none";
mainPage.style.display="block";

document.getElementById("user").innerText=name;
document.getElementById("balance").innerText="$"+balance;
}

// AD SYSTEM
window.watchAd = () => {

let t=5;
adPopup.style.display="block";

timer.innerText=t;

const x=setInterval(()=>{
t--;
timer.innerText=t;

if(t<=0){
clearInterval(x);
closeBtn.classList.remove("hidden");
}
},1000);

}

// REWARD (basic)
window.closeAd = async () => {

adPopup.style.display="none";
closeBtn.classList.add("hidden");

const user = auth.currentUser;

const snap = await get(child(ref(db),"users/"+user.uid));
const data = snap.val();

const newBal = data.balance + 0.01;

await update(ref(db,"users/"+user.uid),{
balance:newBal
});

balance.innerText="$"+newBal.toFixed(2);

}

// WITHDRAW
window.withdraw = async () => {

const user = auth.currentUser;

const snap = await get(child(ref(db),"users/"+user.uid));
const data = snap.val();

if(Number(amount.value) > data.balance){
alert("No balance");
return;
}

await update(ref(db,"users/"+user.uid),{
balance:data.balance-Number(amount.value)
});

await set(ref(db,"withdraws/"+Date.now()),{
uid:user.uid,
amount:amount.value,
status:"pending"
});

alert("Request Sent");
}
