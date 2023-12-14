var gamepads = []
window.addEventListener("gamepadconnected", async (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
    );
    gamepads[gamepads.length] = e.gamepad
    var conFile = {};
    console.log(e.gamepad.id.toLowerCase())

    if (e.gamepad.id.toLowerCase().includes('xbox') || e.gamepad.id.toLowerCase().includes('xinput') ) {
        conFile = await GetJSON('Xbox.json');
    }
    else if (e.gamepad.id.toLowerCase().includes('dual') || e.gamepad.id.toLowerCase().includes('wireless controller') ) {
        conFile = await GetJSON('Play.json');
    }

    for (var i in e.gamepad.buttons){
        await setup(i,e.gamepad.index,conFile)
    }
    for (var i in e.gamepad.axes){
        await setupAxes(i,e.gamepad.index,conFile)
    }
    for (var g in gamepads){
    setInterval(() => {
        handleContorls();
        handleAxes();
        updateGamepadState();
    }, 10);
}
});

async function handleContorls() {
    for (var g in gamepads){
    for (const index in gamepads[g].buttons) {
        const button = gamepads[g].buttons[index]
        if (button.pressed) {
            document.getElementById(g + '-' + index).textContent = document.getElementById(g + '-' + index).textContent.replace("Off","On");
        }
        else {
            document.getElementById(g + '-' + index).textContent = document.getElementById(g + '-' + index).textContent.replace("On","Off");
        }
    }
}
}

async function handleAxes() {
    for (var g in gamepads){
    for (const index in gamepads[g].axes) {
        const axis = gamepads[g].axes[index]
        var value = (Math.floor(axis * 100) / 100).toPrecision(2)
        if (Math.abs(value) < 0.1)
        value = 0.00
        document.getElementById(g + '-a' + index).textContent = document.getElementById(g + '-a' + index).textContent.split('=')[0] + "= " + value
    }
}
}

async function delayWithAsyncAwait(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}

function updateGamepadState() {
    for (var g in gamepads) {
        gamepads[g] = navigator.getGamepads()[g];
    }
}

async function setup(i,g,n){
    const newDiv = document.createElement('div')
    document.body.appendChild(newDiv);
    newDiv.textContent = n.Buttons[i] + " : Off";
    newDiv.id = g + '-' + i;
}

async function setupAxes(i,g,n){
    const newDiv = document.createElement('div')
    document.body.appendChild(newDiv);
    newDiv.textContent = n.Axes[i] + " = " + 0.00;
    newDiv.id = g + '-a' + i;
}

async function GetJSON(jsonFilePath){
var c = await (await fetch(jsonFilePath)).json()
return c
}