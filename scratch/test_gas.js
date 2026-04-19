async function testGas() {
    const url = "https://script.google.com/macros/s/AKfycbxk5bTkMwI8ch14TEHtd25ZzOBcC3X8cTmsVX11NXySjfieF7qXAIrXo2jdL6yhlCCt/exec";
    
    const params = new URLSearchParams();
    params.append('name', 'Developer Test');
    params.append('email', 'test@example.com');
    params.append('contactNo', '123456');
    params.append('message', 'Testing GAS Connection');
    params.append('department', 'Debug Tooling');
    params.append('formatted_message', 'Test format string');

    try {
        console.log("Sending POST to GAS...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString(),
            redirect: 'follow'
        });
        
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}

testGas();
