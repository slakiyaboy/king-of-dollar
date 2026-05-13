import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

getAuth,

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

signOut,

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

getDatabase,

ref,

set,

get,

child,

update,

push

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

/* 🔥 FIREBASE */

const firebaseConfig = {

apiKey: "AIzaSyAifKKpluXjlOOjnhCSL2fSCj4urp5ZFN4",

authDomain: "king-of-dollar.firebaseapp.com",

databaseURL: "https://king-of-dollar-default-rtdb.asia-southeast1.firebasedatabase.app",

projectId: "king-of-dollar",

storageBucket: "king-of-dollar.firebasestorage.app",

messagingSenderId: "289594893517",

appId: "1:289594893517:web:c12a017bc02e06ca7cb584",

measurementId: "G-LHHS2J9F20"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getDatabase(app);

/* 🎬 START */

window.onload = () => {

setTimeout(()=>{

welcome.style.display="none";

authPage.style.display="block";

},3000);

};

/* 🔐 SESSION */

onAuthStateChanged(auth, async (user)=>{

if(user){

const snapshot =
await get(child(ref(db),"users/"+user.uid));

if(snapshot.exists()){

const data = snapshot.val();

showMain(data.email,data.balance);

}

}

});

/* 🟢 SIGNUP */

window.signup = async ()=>{

try{

if(pass.value.length < 6){

alert("Password too short");

return;

}

const userCredential =

await createUserWithEmailAndPassword(

auth,

email.value,

pass.value

);

const user = userCredential.user;

await set(ref(db,"users/"+user.uid),{

email:email.value,

balance:0,

lastReward:0,

totalRewards:0,

createdAt:Date.now()

});

showMain(email.value,0);

}catch(error){

alert(error.message);

}

};

/* 🔵 LOGIN */

window.login = async ()=>{

try{

const userCredential =

await signInWithEmailAndPassword(

auth,

email.value,

pass.value

);

const user = userCredential.user;

const snapshot =
await get(child(ref(db),"users/"+user.uid));

const data = snapshot.val();

showMain(data.email,data.balance);

}catch(error){

alert("Login Failed");

}

};

/* 🚪 LOGOUT */

window.logout = async ()=>{

await signOut(auth);

mainPage.style.display="none";

authPage.style.display="block";

};

/* 🏠 MAIN */

function showMain(name,balanceValue){

authPage.style.display="none";

mainPage.style.display="block";

document.getElementById("user").innerText=name;

document.getElementById("balance").innerText=
"$"+Number(balanceValue).toFixed(2);

document.getElementById("walletBalance").innerText=
"$"+Number(balanceValue).toFixed(2);

}

/* 🎬 WATCH AD */

window.watchAd = async ()=>{

const user = auth.currentUser;

if(!user){

alert("Login Required");

return;

}

const snapshot =
await get(child(ref(db),"users/"+user.uid));

const data = snapshot.val();

const now = Date.now();

/* ⛔ COOLDOWN */

if(now - data.lastReward < 30000){

const left = Math.ceil(
(30000 - (now - data.lastReward))/1000
);

cooldownText.innerText =
"Wait "+left+" seconds";

return;

}

cooldownText.innerText="";

ad.style.display="flex";

close.style.display="none";

let time = 5;

t.innerText=time;

const interval = setInterval(()=>{

time--;

t.innerText=time;

if(time<=0){

clearInterval(interval);

close.style.display="block";

}

},1000);

};

/* 💰 REWARD */

window.reward = async ()=>{

const user = auth.currentUser;

if(!user){

alert("Unauthorized");

return;

}

const snapshot =
await get(child(ref(db),"users/"+user.uid));

const data = snapshot.val();

const now = Date.now();

if(now - data.lastReward < 30000){

alert("Cooldown Active");

return;

}

const newBalance =
Number(data.balance)+0.01;

await update(ref(db,"users/"+user.uid),{

balance:newBalance,

lastReward:now,

totalRewards:data.totalRewards+1

});

document.getElementById("balance").innerText=
"$"+newBalance.toFixed(2);

document.getElementById("walletBalance").innerText=
"$"+newBalance.toFixed(2);

ad.style.display="none";

alert("$0.01 Added");

};

/* 📤 WITHDRAW */

window.withdraw = async ()=>{

const amount =
Number(document.getElementById("amount").value);

if(amount <= 0){

alert("Invalid Amount");

return;

}

const user = auth.currentUser;

if(!user){

alert("Unauthorized");

return;

}

const snapshot =
await get(child(ref(db),"users/"+user.uid));

const data = snapshot.val();

if(amount < 1){

alert("Minimum withdraw is $1");

return;

}

if(amount > data.balance){

alert("Insufficient Balance");

return;

}

/* UPDATE */

const newBalance =
data.balance - amount;

await update(ref(db,"users/"+user.uid),{

balance:newBalance

});

/* SAVE REQUEST */

await push(ref(db,"withdraws"),{

uid:user.uid,

email:data.email,

amount:amount,

status:"pending",

createdAt:Date.now()

});

document.getElementById("balance").innerText=
"$"+newBalance.toFixed(2);

document.getElementById("walletBalance").innerText=
"$"+newBalance.toFixed(2);

alert("Withdraw Request Sent");

};

/* 🏠 HOME */

window.showHome = ()=>{

document.getElementById("homePage").style.display="block";

document.getElementById("walletPage").style.display="none";

};

/* 👛 WALLET */

window.showWallet = ()=>{

document.getElementById("homePage").style.display="none";

document.getElementById("walletPage").style.display="block";

};
