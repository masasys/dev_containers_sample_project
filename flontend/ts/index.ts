window.addEventListener("load", async () => {
  const buttonLogin = document.getElementById("button") as HTMLButtonElement;
  buttonLogin.addEventListener("click", async () => {
    await fetch("/api/hello").then((response: Response) => {
      response.json().then((response: { message: string }) => {
        (document.getElementById("result") as HTMLDivElement).innerText = response.message;
      });
    });
  });
});
