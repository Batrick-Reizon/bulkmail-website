import React, { useState } from "react"
import * as XLSX from "xlsx"
import axios from "axios"

function App() {
  const [message, setMessage] = useState("")
  const [emailList, setemailList] = useState([])
  const [status, setStatus] = useState(false)

  const API = process.env.REACT_APP_API_URL

  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const handleFile = (event) => {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const workSheet = XLSX.read(data, { type: "binary" })
      const sheetName = workSheet.SheetNames[0]
      const workBook = workSheet.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(workBook, { header: "A" })
      const totalEmail = emailList.map((item) => item.A)
      console.log(totalEmail)
      setemailList(totalEmail)
    }

    reader.readAsBinaryString(file)
  }

  const handleSend = () => {
    setStatus(true)
    axios.post(`${API}/sendemail`, { message: message, emailList: emailList })
      .then((data) => {
        if (data.data === true) {
          alert("Email Send Successfully")
          setMessage("")
          setStatus(false)
        } else {
          alert("Failed to send Email")
        }
      })
  }

  return (<div>
    <div className="bg-blue-950 text-center p-5">
      <h1 className="text-white text-2xl font-bold">BulkMail</h1>
    </div>
    <div className="bg-blue-800 text-center p-5">
      <h1 className="text-white sm:text-2xl font-medium">We can help you sending multiple email by sending once</h1>
    </div>
    <div className="bg-blue-600 text-center p-5">
      <h1 className="text-white sm:text-xl font-medium">Drag and Drop</h1>
    </div>
    <div className="bg-blue-400 flex flex-col justify-center items-center p-5">
      <textarea onChange={handleChange} value={message} className="w-11/12 sm:w-1/2 h-32 p-2 outline-none border border-black rounded" placeholder="Enter the text here....."></textarea>
      <input onChange={handleFile} type="file" className="border-4 border-white border-dashed p-4 my-5 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/4" />
      <button onClick={handleSend} className="bg-blue-950 text-white py-1 px-3 rounded">{status ? "Sending" : "Send"}</button>
      <p className="my-3">Total Emails in the file: {emailList.length}</p>
    </div>
    <div className="bg-blue-300 p-5">
      <h1 className="text-blue-300">H</h1>
    </div>
    <div className="bg-blue-200 p-5">
      <h1 className="text-blue-200">H</h1>
    </div>
  </div>)
}

export default App