let countdownInterval;
let lastTimeRemaining = 3;
let timeRemaining = 3; // 預設 5 分鐘
let isPaused = false;
let isCounting = false; // 用來追蹤倒數是否進行中
let alertTime = 1 / 30; // 分鐘
// 初始化已保存的配置
let customConfigs = [
  { name: '講者', time: 20, alert: 2 },
  { name: '與談人', time: 12, alert: 2 },
  { name: '25分鐘番茄鐘', time: 25, alert: 5 },
];

function updateCountdownDisplay() {
  const countdownElement = document.getElementById('countdown');
  const hours = String(Math.floor(timeRemaining / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeRemaining % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(timeRemaining % 60).padStart(2, '0');

  countdownElement.textContent =
    parseInt(hours) > 0
      ? `${hours}:${minutes}:${seconds}`
      : `${minutes}:${seconds}`;

  if (timeRemaining <= 0) {
    handleCountdownEnd(); // 呼叫時間結束處理邏輯
    return; // 時間歸零後不再更新顯示
  }
}

function handleCountdownEnd() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  isCounting = false;
  const startPauseButton = document.getElementById('start-pause-button');
  const bigNumber = document.querySelector('.big-number');
  startPauseButton.textContent = '重新開始'; // 改變按鈕顯示文字
  startPauseButton.classList.remove('btn-danger'); // 移除暫停時的 class
  startPauseButton.classList.add('btn-primary'); // 添加新的 class
  document.body.style.backgroundColor = '#ff7e7e'; // 切換到紅色背景
  bigNumber.style.height = '60vh';
  console.log('倒數完成，時間到！');
  playBell(); // 播放鈴聲
}

function toggleCountdown() {
  const startPauseButton = document.getElementById('start-pause-button');
  const bigNumber = document.querySelector('.big-number');
  console.log(bigNumber);
  console.log(timeRemaining);
  if (startPauseButton.textContent === '重新開始') {
    timeRemaining = lastTimeRemaining;
    updateCountdownDisplay();
  }
  if (timeRemaining === 0) {
    return;
  }
  if (isCounting && timeRemaining > 0) {
    console.log('有嗎');
    // 暫停倒數
    clearInterval(countdownInterval);
    countdownInterval = null;
    isCounting = false;

    startPauseButton.textContent = '開始'; // 改變按鈕顯示文字
    startPauseButton.classList.remove('btn-danger'); // 移除暫停時的 class
    startPauseButton.classList.add('btn-primary'); // 添加新的 class
    document.body.style.backgroundColor = '#ffffff'; // 還原背景顏色
  } else {
    // 開始倒數
    countdownInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateCountdownDisplay();

        // 剩餘 alertTime 分鐘時切換背景顏色
        if (timeRemaining === alertTime * 60) {
          document.body.style.backgroundColor = '#ffcb7e'; // 切換到警示背景
        }
      } else {
        handleCountdownEnd(); // 時間到，呼叫結束處理邏輯
      }
    }, 1000);
    bigNumber.style.height = '85vh';
    startPauseButton.textContent = '暫停'; // 改變按鈕顯示文字
    startPauseButton.classList.remove('btn-primary'); // 移除預設的 class
    startPauseButton.classList.add('btn-danger'); // 添加新的 class
    document.body.style.backgroundColor = '#b5e6b7'; // 開始倒數時，顯示新的背景顏色
    isCounting = true; // 更新狀態
  }
}

// 播放鈴聲
function playBell() {
  const bell = new Audio('bell.mp3');
  bell.play();
}

// 重設倒數
function resetCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  isCounting = false; // 確保倒數停止
  document.getElementById('start-pause-button').textContent = '開始'; // 重置按鈕文字
  updateCountdownDisplay();
  document.body.style.backgroundColor = '#ffffff'; // 恢復原背景色
}

// 重設上次倒數
function resetPreviousCountdown() {
  timeRemaining = lastTimeRemaining;
  resetCountdown();
}

// 更新切換背景時間
function updateAlertTime() {
  alertTime = parseInt(document.getElementById('alert-time').value);
}

// 顯示當前時間
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById(
    'current-time'
  ).textContent = `目前時間：${timeString}`;
}
setInterval(updateCurrentTime, 1000);

// 新增自訂配置
function addCustomConfig() {
  const customName = document.getElementById('custom-name').value.trim();
  const customTime = parseInt(document.getElementById('custom-time').value);
  const customAlert = parseInt(document.getElementById('custom-alert').value);

  if (!customName) {
    alert('請輸入配置名稱！');
    return;
  }

  if (
    isNaN(customTime) ||
    customTime <= 0 ||
    isNaN(customAlert) ||
    customAlert < 0
  ) {
    alert('請輸入有效的倒數時間和提醒時間！');
    return;
  }

  const newConfig = { name: customName, time: customTime, alert: customAlert };
  customConfigs.push(newConfig);
  renderConfigList(); // 更新配置列表

  // 清空輸入框
  document.getElementById('custom-name').value = '';
  document.getElementById('custom-time').value = '';
  document.getElementById('custom-alert').value = '';
}

function renderConfigList() {
  const configList = document.getElementById('config-list');
  configList.innerHTML = ''; // 清空現有列表

  customConfigs.forEach((config, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'flex-row',
      'justify-content-between'
    );
    listItem.id = `config-item-${index}`;

    const configText = document.createElement('div');
    configText.classList.add('border', 'd-flex', 'align-items-center');
    configText.textContent = `${config.name} - 倒數 ${config.time} 分鐘， 結束前 ${config.alert} 分鐘時提醒`;

    // 創建一個容器來包含按鈕
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add(
      'd-flex',
      'justify-content-end',
      'border',
      'gap-2'
    ); // 用 gap-2 來設置按鈕之間的間距

    // 使用此配置按鈕
    const selectButton = document.createElement('button');
    selectButton.classList.add('btn', 'btn-light', 'select-button');
    selectButton.innerHTML = '<i class="fa-regular fa-square-check"></i>';
    selectButton.onclick = () => selectConfig(config, index);

    // 編輯按鈕
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-light');
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.onclick = () => enableEditMode(index);

    // 刪除按鈕
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.onclick = () => deleteConfig(index);

    // 將按鈕添加到按鈕容器中
    buttonGroup.appendChild(selectButton);
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);

    // 將文字和按鈕容器添加到列表項目中
    listItem.appendChild(configText);
    listItem.appendChild(buttonGroup);

    // 將列表項目添加到列表中
    configList.appendChild(listItem);
  });
}

// 使用選定的配置
function selectConfig(config, index) {
  // 設置倒數和提醒時間
  timeRemaining = config.time * 60; // 將倒數時間轉換為秒
  alertTime = config.alert; // 設定提醒時間

  lastTimeRemaining = timeRemaining;

  // 先清除其他項目的選中狀態
  const listItems = document.querySelectorAll('.list-group-item');
  listItems.forEach((item) => {
    item.classList.remove('active'); // 移除選中樣式
    const button = item.querySelector('.select-button');
    if (button) {
      // button.textContent = '使用此配置'; // 還原按鈕文字
      button.innerHTML = '<i class="fa-regular fa-square-check"></i>';
      button.disabled = false; // 重新啟用按鈕
    }
  });

  // 標記當前項目
  const currentItem = document.getElementById(`config-item-${index}`);
  currentItem.classList.add('active'); // 添加選中樣式
  const selectButton = currentItem.querySelector('.select-button');
  selectButton.innerHTML = '<i class="fa-solid fa-square-check"></i>'; // 修改按鈕樣式
  selectButton.disabled = true; // 禁用按鈕，防止再次點擊

  updateCountdownDisplay(); // 更新顯示
  resetCountdown();
}

// 啟用編輯模式
function enableEditMode(index) {
  const listItem = document.getElementById(`config-item-${index}`);
  listItem.innerHTML = ''; // 清空列表項目

  // 編輯輸入框
  const nameInput = document.createElement('input');
  nameInput.classList.add('w-1');
  nameInput.type = 'text';
  nameInput.value = customConfigs[index].name;

  const timeInput = document.createElement('input');
  timeInput.classList.add('w-1');
  timeInput.type = 'number';
  timeInput.value = customConfigs[index].time;
  timeInput.min = 1;

  const alertInput = document.createElement('input');
  alertInput.classList.add('w-1');
  alertInput.type = 'number';
  alertInput.value = customConfigs[index].alert;
  alertInput.min = 0;

  // 創建一個容器來包含按鈕
  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('d-flex', 'justify-content-end', 'border', 'gap-2'); // 用 gap-2 來設置按鈕之間的間距

  // 保存按鈕
  const saveButton = document.createElement('button');
  saveButton.classList.add('btn', 'btn-light');
  saveButton.innerHTML = '<i class="fa-regular fa-floppy-disk"></i>';
  saveButton.onclick = () =>
    saveConfig(index, nameInput.value, timeInput.value, alertInput.value);

  // 取消按鈕
  const cancelButton = document.createElement('button');
  cancelButton.classList.add('btn', 'btn-light');
  cancelButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  cancelButton.onclick = renderConfigList;

  // 將按鈕添加到按鈕容器中
  buttonGroup.appendChild(saveButton);
  buttonGroup.appendChild(cancelButton); // 添加到列表項目
  listItem.appendChild(document.createTextNode('名稱：'));
  listItem.appendChild(nameInput);
  listItem.appendChild(document.createTextNode(' 倒數時間（分鐘）：'));
  listItem.appendChild(timeInput);
  listItem.appendChild(document.createTextNode(' 提醒時間（分鐘）：'));
  listItem.appendChild(alertInput);
  listItem.appendChild(buttonGroup);

  // 將列表項目添加到列表中
  configList.appendChild(listItem);
}

// 保存編輯後的配置
function saveConfig(index, newName, newTime, newAlert) {
  const parsedTime = parseInt(newTime);
  const parsedAlert = parseInt(newAlert);

  if (!newName.trim()) {
    alert('請輸入有效的名稱！');
    return;
  }

  if (
    isNaN(parsedTime) ||
    parsedTime <= 0 ||
    isNaN(parsedAlert) ||
    parsedAlert < 0
  ) {
    alert('請輸入有效的數值！');
    return;
  }

  customConfigs[index] = {
    name: newName.trim(),
    time: parsedTime,
    alert: parsedAlert,
  }; // 更新配置
  renderConfigList(); // 重新渲染列表
}

// 刪除配置
function deleteConfig(index) {
  customConfigs.splice(index, 1); // 移除指定的配置
  renderConfigList(); // 重新渲染列表
}

// 初始化
updateCountdownDisplay();
updateCurrentTime();
renderConfigList();
