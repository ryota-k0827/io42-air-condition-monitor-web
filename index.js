window.onload = () => {
  const socket = new WebSocket("ws://ohs80538pi.local:9000")

  const warningMsg = document.getElementById("warning-msg")
  const conStatus = document.getElementById("con-status")
  const updateDate = document.getElementById("update-date")
  const airCondition = document.getElementById("air-condition")
  const temperatureOutput = document.getElementById("temperature-output")
  const humidityOutput = document.getElementById("humidity-output")
  const co2Output = document.getElementById("co2-output")
  const result = document.getElementById("result")

  const warningSe1 = new Audio('assets/music/warning-01.mp3')
  const warningSe2 = new Audio('assets/music/warning-02.mp3')

  fetch("data.json")
      .then(res => res.json())
      .then(data => formatJSON(data))

  const formatDateTime = (datetime) => {
    const year = datetime.getFullYear().toString()
    const month = ('00' + (datetime.getMonth()+1)).slice(-2)
    const day = ('00' + datetime.getDate()).slice(-2)
    const hour = ('00' + datetime.getHours()).slice(-2)
    const minutes = ('00' + datetime.getMinutes()).slice(-2)
    const seconds = ('00' + datetime.getSeconds()).slice(-2)

    return (`${year}/${month}/${day} ${hour}:${minutes}:${seconds}`);
  }

  const formatJSON = (data) => {
    let cnt = 0
    let reverseData = []
    for(let i = data.length - 1; i >= 0; i--) {
      reverseData[cnt] = data[i];
      cnt++
    }

    let html = "<table>";

    html += "<tr><th>温度</th><th>湿度</th><th>計測日時</th></tr>"
 
    for(let item of reverseData){
      let datetime = formatDateTime(new Date(item.datetime))
      html += `<tr><td>${String(item.temperature)}°C</td><td>${String(item.humidity)}%</td><td>${datetime}</td></tr>`;
    }
    html += "</table>";
 
    result.innerHTML = html;
  }

  const resetAudio = () => {
    warningSe1.pause()
    warningSe2.pause()
    warningSe1.currentTime = 0
    warningSe2.currentTime = 0
  }

  const onClickWarningMsg = () => {
    warningMsg.remove()
  }

  document.body.onclick = onClickWarningMsg

  socket.onopen = (e) => {
    console.log("WebSocketサーバーに接続しました")
    conStatus.innerHTML = "サーバー: 接続"
  }

  socket.onmessage = (e) => {
    const splitData = e.data.split("/")
    temperatureOutput.innerHTML = `${splitData[1]}°C`
    humidityOutput.innerHTML = `${splitData[3]}%`

    // const co2Min = 900
    // const co2Max = 2600
    // const co2Data = Math.floor(Math.random() * (co2Max + 1 - co2Min)) + co2Min

    const co2DataList = [901, 927, 966, 998, 1129, 1368, 1487, 1999, 2376, 2789]
    const randomNum = Math.floor(Math.random() * 10)
    
    if (co2DataList[randomNum] <= 1000) {
      co2Output.style.color = "black"
      airCondition.style.color = "black"
      airCondition.innerHTML = "空気の状態: 正常"
      resetAudio()
    } else if (co2DataList[randomNum] <= 1500) {
      co2Output.style.color = "orange"
      airCondition.style.color = "orange"
      airCondition.innerHTML = "空気の状態: やや悪い"
      resetAudio()
    } else if (co2DataList[randomNum] <= 2500) {
      co2Output.style.color = "tomato"
      airCondition.style.color = "tomato"
      airCondition.innerHTML = "空気の状態: 悪い"
      resetAudio()
      warningSe1.play()
    } else {
      co2Output.style.color = "red"
      airCondition.style.color = "red"
      airCondition.innerHTML = "空気の状態: 非常に悪い"
      resetAudio()
      warningSe2.play()
    }
    co2Output.innerHTML = `${co2DataList[randomNum].toLocaleString()}ppm`

    fetch("data.json")
      .then(res => res.json())
      .then(data => formatJSON(data))

    const nowDate = formatDateTime(new Date())
    updateDate.innerHTML = `更新日時: ${nowDate}`
  }

  socket.onclose = (e) => {
    console.log("WebSocketサーバー側から切断されました")
    conStatus.innerHTML = "サーバー: 未接続"
    temperatureOutput.innerHTML = '-°C'
    humidityOutput.innerHTML = '-%'
    co2Output.innerHTML = '-ppm'
  }

  socket.onerror = (e) => {
    console.error("WebSocketサーバーとの通信中にエラーが発生しました")
  }
}