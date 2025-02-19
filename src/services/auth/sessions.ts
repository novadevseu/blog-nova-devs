export async function getUserSession() {
    const response = await fetch("/api/auth", {
      method: "GET",
    });
    const data = await response.json();
    if (response.ok) {
      console.log("UID:", data.uid);
      return data.uid;
    } else {
      console.log("No session found");
    }
  }
  
  export async function setUserSession(userId: string) {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
   
      body: JSON.stringify({
        uid: userId, 
      }), 
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data.message); 
    } else {
      console.error("Error:", data);
    }
  }
  