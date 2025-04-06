const createdairy = document.getElementById('createdairy');
const smallbox = document.getElementById('smallbox');
const dairybutton = document.getElementById('dairybutton');

function showtime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 根据天气获取对应的 font class 类名
function getWeatherIconClass(weather) {
    const weatherIconClasses = {
        '晴': 'iconfont icon-qingtian',
        '阴': 'iconfont icon-yintian',
        '小雨': 'iconfont icon-xiaoyu-zhongyu',
        '大雨': 'iconfont icon-dayu-baoyu',
        '小雪': 'iconfont icon-xiaoxue-zhongxue',
        '大雪': 'iconfont icon-daxue-baoxue',
        '风': 'iconfont icon-dafeng',
        '雾': 'iconfont icon-wu',
    };
    return weatherIconClasses[weather] || '';
}

//封装创建日记项的函数
function createDiaryItem(date, content, index, imageData, weather) {
    //创建日期的p标签
    const dateElement = document.createElement('p');
    dateElement.textContent = date;
    dateElement.id = 'dateElement';
    // 创建天气显示元素
    const weatherElement = document.createElement('span');
    const weatherIconClass = getWeatherIconClass(weather);
    weatherElement.innerHTML = ` <i class="${weatherIconClass} weather-icon"></i> ${weather}`;
    //创建文本区域
    const textarea = document.createElement('textarea');
    textarea.style.width = '500px';
    textarea.className = "dairy";
    textarea.value = content;
    textarea.disabled = true;
    // 创建包含文本框和天气的容器
    const WeathertextContainer = document.createElement('div');
    WeathertextContainer.appendChild(weatherElement);
    WeathertextContainer.appendChild(textarea);
    WeathertextContainer.classList.add('weathertext');

    // 创建封装日期、日记内容和图片的盒子
    const container = document.createElement('div');
    container.classList.add('dairy');
    container.appendChild(dateElement);
    container.appendChild(WeathertextContainer);

    // 如果有图片数据，创建 img 元素
    if (imageData) {
        const img = document.createElement('img');
        img.src = imageData;
         // 添加 max-w-full 和 h-auto 类，使图片在不同屏幕下能自适应大小
         img.classList.add('max-w-full', 'h-auto','my-4'); 
        container.appendChild(img);
    }

    // 创建复选框并设置 data-index 属性
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'checkbox';
    checkbox.className = 'dairy-checkbox';
    checkbox.dataset.index = index;
    checkbox.style.display = 'none';
    container.appendChild(checkbox);

    smallbox.insertBefore(container, smallbox.firstChild);
    return { container, textarea };
}
// 页面加载时检查 localStorage 并显示之前保存的所有内容
let savedcontent = [];
try {
    const storedData = localStorage.getItem('diaries');
    if (storedData) {
        savedcontent = JSON.parse(storedData);
        if (!Array.isArray(savedcontent)) {
            savedcontent = [];
        }
    }
} catch (error) {
    console.error('解析 localStorage 数据时出错:', error);
    savedcontent = [];
}
const diaryItems = []; // 用于存储每个日记项的信息
savedcontent.forEach(({ date, content, imageData, weather }, index) => {
    const { container, textarea } = createDiaryItem(date, content, index, imageData, weather);
    diaryItems.push({ container, textarea, index }); // 存储日记项相关信息
    // 调整已保存日记的 textarea 高度
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
})
//创建总的修改按钮
const globalExit = document.createElement('button');
globalExit.style.display = 'inline';
globalExit.id = 'globalExit';
globalExit.textContent = '修改';
globalExit.className = 'iconfont icon-xiugai';
dairybutton.appendChild(globalExit);
//监听总的修改按钮事件
globalExit.addEventListener('click', editing);

//修改函数
function editing() {
    diaryItems.forEach(({ textarea }) => {
        // 直接将文本框设为可编辑状态
        textarea.disabled = false;
    });
    const globalExit = document.getElementById('globalExit');
    // 删除总的修改按钮
    dairybutton.removeChild(globalExit);
    //创建总的保存按钮
    const globalSave = document.createElement('button');
    globalSave.style.display = 'inline';
    globalSave.textContent = '保存';
    globalSave.id = 'globalSave';
    dairybutton.appendChild(globalSave);
    // 监听总的保存按钮
    globalSave.addEventListener('click', saving);
}
//保存函数
function saving() {
    diaryItems.forEach(({ textarea, index }) => {
        const newdairycontent = textarea.value;
        savedcontent[index].content = newdairycontent;
    });
    localStorage.setItem('diaries', JSON.stringify(savedcontent));
    diaryItems.forEach(({ textarea }) => {
        textarea.disabled = true;
    });
    const globalSave = document.getElementById('globalSave');
    // 删除总的保存按钮
    dairybutton.removeChild(globalSave);
    //创建总的修改按钮
    const globalExit = document.createElement('button');
    globalExit.style.display = 'inline';
    globalExit.textContent = '修改';
    globalExit.className = 'iconfont icon-xiugai';
    globalExit.id = 'globalExit';
    dairybutton.appendChild(globalExit);
    globalExit.addEventListener('click', editing);
}

// 监听点击‘创建日记’事件
createdairy.addEventListener('click', function (e) {
    e.preventDefault();
    // 创建输入框和保存按钮
    const textarea = document.createElement('textarea');
    const savebutton = document.createElement('button');
    const fileInput = document.createElement('input');
    const weatherContainer = document.createElement('div');
    const weatherOptions = ['晴', '阴', '小雨', '大雨', '小雪', '大雪', '风', '雾'];
    const selectWeatherButton = document.createElement('button');
    selectWeatherButton.textContent = '选择天气';
    weatherContainer.className = 'weather-popup';
    let selectedWeather = null;
    weatherOptions.forEach(weather => {
        const icon = document.createElement('i');
        const iconClass = getWeatherIconClass(weather);
        icon.className = `${iconClass} weather-icon`;
        icon.addEventListener('click', () => {
            // 移除之前选中的图标样式
            const previousSelected = weatherContainer.querySelector('.weather-icon.selected');
            if (previousSelected) {
                previousSelected.classList.remove('selected');
            }
            // 添加当前选中的图标样式
            icon.classList.add('selected');
            selectedWeather = weather;
            weatherContainer.style.display = 'none';
        })
        weatherContainer.appendChild(icon);
    })
    textarea.placeholder = '记录你的生活';
    textarea.className = "dairy";
    textarea.style.width = '500px';
    savebutton.textContent = '保存';
    savebutton.id = 'savebutton';
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    // 创建包含文本框和天气的容器
    const WeathertextContainer = document.createElement('div');
    WeathertextContainer.appendChild(selectWeatherButton);
    WeathertextContainer.appendChild(textarea);
    WeathertextContainer.classList.add('weathertext');
    smallbox.insertBefore(WeathertextContainer, smallbox.firstChild);
    // 将输入框和按钮加入smallbox容器中
    smallbox.insertBefore(fileInput, smallbox.firstChild.nextSibling);
    smallbox.insertBefore(savebutton, smallbox.firstChild.nextSibling);

    selectWeatherButton.addEventListener('click', () => {
        weatherContainer.style.display = 'block';
        WeathertextContainer.insertBefore(weatherContainer, selectWeatherButton.nextSibling);
        WeathertextContainer.removeChild(selectWeatherButton);
    });
    // 监听点击保存按钮事件
    savebutton.addEventListener('click', function () {
        // 通过 localStorage 获取输入值
        const dairycontent = textarea.value;
        const date = showtime();
        const newindex = savedcontent.length;
        let imageData = null;

        // 定义一个处理日记保存的函数
        const saveDiary = () => {
            savedcontent.push({ date: date, content: dairycontent, imageData: imageData, weather: selectedWeather });
            localStorage.setItem('diaries', JSON.stringify(savedcontent));
            // 调用 createDiaryItem 函数创建并显示新的日记项
            const { container, textarea: newTextarea } = createDiaryItem(date, dairycontent, newindex, imageData, selectedWeather);
            diaryItems.push({ container, textarea: newTextarea, index: newindex });
            // 确保新创建的日记项不可编辑
            newTextarea.disabled = true;
            smallbox.insertBefore(container, smallbox.firstChild);
            // 移除输入框和保存按钮
            if (textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }
            if (fileInput.parentNode) {
                fileInput.parentNode.removeChild(fileInput);
            }
            if (savebutton.parentNode) {
                savebutton.parentNode.removeChild(savebutton);
            }
            if (weatherContainer.parentNode) {
                weatherContainer.parentNode.removeChild(weatherContainer);
            }
            if (selectWeatherButton.parentNode) {
                selectWeatherButton.parentNode.removeChild(selectWeatherButton);
            }

        };
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                imageData = e.target.result;
                saveDiary();
            }
            reader.readAsDataURL(file);
        } else {
            saveDiary();
        }
    })
    // 监听输入超过 250 字事件
    textarea.addEventListener('input', function () {
        if (this.value.length > 250) {
            this.value = this.value.slice(0, 250);
            alert('最多只能输入 250 个字');
        }
        // 动态调整文本框高度
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    })
})

//页面滚动监听
window.addEventListener('scroll', function () {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
        window.scrollTo(0, scrollHeight - clientHeight);
    }
})
//显示复选框函数
function showcheckbox() {
    const dairycheckbox = document.querySelectorAll('.dairy-checkbox');
    dairycheckbox.forEach((checkbox) => {
        checkbox.style.display = 'inline';
    })
    document.getElementById('delete').style.display = 'none';
    document.getElementById('sure').style.display = 'inline';
}
//确认删除函数
function DeleteSelectedDiaries() {
    const dairycheckbox = document.querySelectorAll('.dairy-checkbox');
    const selectedIndices = [];

    dairycheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            const index = parseInt(checkbox.dataset.index);
            if (!isNaN(index)) {
                const parent = checkbox.parentNode;
                if (parent) {
                    const nextSibling = parent.nextSibling;
                    if (nextSibling && nextSibling.tagName === 'BUTTON') {
                        smallbox.removeChild(nextSibling);
                    }
                    parent.remove();
                    selectedIndices.push(index);
                }
            }
        }
        checkbox.remove();
    })

    // 从 savedcontent 中移除选中的日记项
    selectedIndices.sort((a, b) => b - a);
    selectedIndices.forEach((index) => {
        savedcontent.splice(index, 1);
    });
    //更新localstorage的值
    localStorage.setItem('diaries', JSON.stringify(savedcontent));
    document.getElementById('delete').style.display = 'inline';
    document.getElementById('sure').style.display = 'none';
}
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const backButton = document.getElementById('backButton')
//监听搜索按钮
searchButton.addEventListener('click', function () {
    const keyword = searchInput.value.trim();
    smallbox.innerHTML = '';
    if (keyword === '') {
        savedcontent.forEach(({ date, content, imageData, weather }, index) => {
            createDiaryItem(date, content, index, imageData);
        })
    } else {
        const filter = savedcontent.filter((diary) => {
            return diary.date.includes(keyword) || diary.content.includes(keyword);
        })
        filter.forEach(({ date, content, imageData, weather }, index) => {
            createDiaryItem(date, content, index, imageData, weather);
        })
    }
    backButton.style.display = 'inline';
    // 清空搜索框内容
    searchInput.value = '';
})
//返回按钮的监听
backButton.addEventListener('click', function () {
    smallbox.innerHTML = '';
    savedcontent.forEach(({ date, content, imageData, weather }, index) => {
        createDiaryItem(date, content, index, imageData, weather);
    })
    backButton.style.display = 'none';
    // 清空搜索框内容
    searchInput.value = '';
})
