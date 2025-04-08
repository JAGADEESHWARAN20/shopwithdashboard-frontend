
const URL = `https://admindashboardecom.vercel.app/api/stores/get-id-by-name`;



const getStorename = async ()  => {

     const res = await fetch(URL);

     return res.json();
}

export default getStorename;

