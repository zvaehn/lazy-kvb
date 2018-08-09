
const cologneAPI = {
  request: (method, url, body) => {
    return new Promise(function (resolve, reject) {
      const xmlHTTP = new XMLHttpRequest();
      xmlHTTP.open(method, url);
      if(body) xmlHTTP.setRequestHeader('Content-Type', 'application/json');
      xmlHTTP.onload = resolve;
      xmlHTTP.onerror = reject;
      xmlHTTP.send(JSON.stringify(body));
    });
  },
  getElevators() {
    return new Promise ((resolve, reject) => {
      // const url = 'http://online-service.kvb-koeln.de/geoserver/OPENDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODENDATA%3Afahrtreppen_gestoert&outputFormat=application/json';
      const url = `${process.env.API_SCRIPT}?feature=elevators`;

      this.request('GET', url)
        .then((response) => {
          const data = JSON.parse(response.target.response);
          const features = data.features;
          resolve(features);
        })
        .catch((err) => {
          reject(err);
        });
    })
  },
  getEscalators() {
    return new Promise ((resolve, reject) => {
      // const url = 'http://online-service.kvb-koeln.de/geoserver/OPENDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODENDATA%3Afahrtreppen_gestoert&outputFormat=application/json';
      const url = `${process.env.API_SCRIPT}?feature=escalators`;

      this.request('GET', url)
        .then((response) => {
          const data = JSON.parse(response.target.response);
          const features = data.features;
          resolve(features);
        })
        .catch((err) => {
          reject(err);
        });
    })
  }
};

export {cologneAPI};
