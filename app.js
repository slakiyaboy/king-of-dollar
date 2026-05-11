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
apiKey:"YOUR_KEY",
authDomain:"YOUR_DOMAIN",
databaseURL:"YOUR_DB",
projectId:"YOUR_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

/* 🎬 WELCOME → AUTO SWITCH */
window.onload = () => {
setTimeout(()=>{
document.getElementById("welcome").style.display="none";
document.getElementById("authPage").classList.remove("hidden");
},3000);
}

/* 🔄 SWITCH LOGIN / SIGNUP */
window.showSignup = ()=>{
loginBox.classList.add("hidden");
signupBox.classList.remove("hidden");
}

window.showLogin = ()=>{
signupBox.classList.add("hidden");
loginBox.classList.remove("hidden");
}

/* SIGNUP */
window.signup = async ()=>{

const user = await createUserWithEmailAndPassword(auth,email.value,pass.value);

await set(ref(db,"users/"+user.user.uid),{
name:name.value,
username:username.value,
balance:0
});

showMain(username.value,0);

}

/* LOGIN */
window.login = async ()=>{

const user = await signInWithEmailAndPassword(auth,email.value,pass.value);

const snap = await get(child(ref(db),"users/"+user.user.uid));
const data = snap.val();

showMain(data.username,data.balance);

}

/* MAIN SCREEN */
function showMain(name,balance){

document.getElementById("authPage").classList.add("hidden");
document.getElementById("mainPage").classList.remove("hidden");

document.getElementById("user").innerText=name;
document.getElementById("balance").innerText="$"+balance;

}

/* AD */
window.watchAd = ()=>{

ad.classList.remove("hidden");

let t=5;
document.getElementById("t").innerText=t;

let x=setInterval(()=>{
t--;
document.getElementById("t").innerText=t;

if(t<=0){
clearInterval(x);
close.classList.remove("hidden");
}
},1000);

}

/* REWARD */
window.reward = async ()=>{

ad.classList.add("hidden");

const user = auth.currentUser;

const snap = await get(child(ref(db),"users/"+user.uid));
const data = snap.val();

let newBal = data.balance + 0.01;

await update(ref(db,"users/"+user.uid),{
balance:newBal
});

balance.innerText="$"+newBal;

}

/* WITHDRAW */
window.withdraw = async ()=>{

const user = auth.currentUser;

const snap = await get(child(ref(db),"users/"+user.uid));
const data = snap.val();

if(Number(amount.value) > data.balance){
alert("No balance");
return;
}

await update(ref(db,"users/"+user.uid),{
balance:data.balance - Number(amount.value)
});

await set(ref(db,"withdraws/"+Date.now()),{
uid:user.uid,
amount:amount.value,
status:"pending"
});

alert("Sent");
}
