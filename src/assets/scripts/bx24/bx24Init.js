export default function initBX24() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '//api.bitrix24.com/api/v1/';
      script.onload = () => {
        BX24.callMethod("app.option.get", {}, (result) => {
          if (result.error()) {
            console.log("error");
            reject(new Error("BX24 initialization failed"));
          } else {
            console.log(result.data());
            sessionStorage.tokens = JSON.stringify(result.data().tokens);
            resolve();
          }
        });
      };
      script.onerror = () => reject(new Error("BX24 script loading failed"));
      document.head.appendChild(script);
    });
  }
  