const axios = require('axios');

axios.post('http://localhost:3000/categorize', {
  title: "YouTube - Music",
  url: "https://youtube.com/music"
})
.then(res => {
  console.log("Response:", res.data);
})
.catch(err => {
  console.error("Error:", err.message);
});
