const socket = io("http://localhost:3500", {
    withCredentials: false,
    transports:['websocket']
});

const loginPage = document.getElementById("section_login");
const boardPage = document.getElementById("game-board");

document.getElementById("login_button").addEventListener("click", login);

const login = async () => {
    const username = document.getElementById("login_input_username").value;
    const password = document.getElementById("login_input_password").value;

    try{
        const response = await fetch('/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        });

        if(!response.data){
            const data = await response.json();
            alert(`Login failed: ${data.message}`)
        }
        alert("Login successful!");
        loginPage.style.display = "none";
        boardPage.style.display = "block";
    }
    catch(error){
        console.error(error);
    }
};

