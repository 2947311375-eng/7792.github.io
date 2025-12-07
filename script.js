// 页面切换功能
$(function() {
  const $pages = $('.page');
  const $navLinks = $('.nav-link');
  const $pageLinks = $('.page-link');

  function switchPage(pageId) {
    $pages.removeClass('active');
    $(`#${pageId}`).addClass('active');

    $navLinks.removeClass('active');
    $navLinks.filter(`[data-page="${pageId}"]`).addClass('active');

    $('html, body').animate({ scrollTop: 0 }, 300);
    
    if (pageId === 'message-board') {
      triggerJumpAnimation();
    }
  }

  $navLinks.on('click', function(e) {
    e.preventDefault();
    const pageId = $(this).data('page');
    switchPage(pageId);
  });

  $pageLinks.on('click', function(e) {
    e.preventDefault();
    const pageId = $(this).attr('href').substring(1);
    switchPage(pageId);
  });
});

// 作品轮播功能
let currentSlide = 0;
let slideInterval;

function initSlider() {
  const totalSlides = 4;
  const sliderContainer = $('#sliderContainer');
  const dots = $('.slider-dot');
  
  if (sliderContainer.length === 0 || dots.length === 0) return;
  
  function updateSlider() {
    sliderContainer.css('transform', `translateX(-${currentSlide * 25}%)`);
    dots.removeClass('active');
    dots.eq(currentSlide).addClass('active');
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }
  
  $('.slider-arrow.prev').on('click', prevSlide);
  $('.slider-arrow.next').on('click', nextSlide);
  
  dots.on('click', function() {
    currentSlide = parseInt($(this).data('index'));
    updateSlider();
  });
  
  slideInterval = setInterval(nextSlide, 4000);
  
  $('#worksSlider').on('mouseenter', () => clearInterval(slideInterval));
  $('#worksSlider').on('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 4000);
  });
}

// 视频播放器功能
function initVideoPlayer() {
  const video = $('#experienceVideo')[0];
  if (!video) return;
  
  const playBtn = $('#playBtn');
  const playIcon = $('#playIcon');
  const videoTime = $('#videoTime');
  const videoProgress = $('#videoProgress');
  const muteBtn = $('#muteBtn');
  const volumeIcon = $('#volumeIcon');
  const volumeSlider = $('#volumeSlider');
  const fullscreenBtn = $('#fullscreenBtn');
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  function updatePlayButton() {
    if (video.paused) {
      playIcon.text('▶');
      playBtn.html('<span id="playIcon">▶</span> 播放');
    } else {
      playIcon.text('⏸');
      playBtn.html('<span id="playIcon">⏸</span> 暂停');
    }
  }
  
  function updateTime() {
    videoTime.text(`${formatTime(video.currentTime)} / ${formatTime(video.duration)}`);
    const progress = (video.currentTime / video.duration) * 100;
    videoProgress.css('width', `${progress}%`);
  }
  
  function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
      volumeIcon.text('🔇');
    } else if (video.volume < 0.5) {
      volumeIcon.text('🔉');
    } else {
      volumeIcon.text('🔊');
    }
  }
  
  playBtn.on('click', function() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayButton();
  });
  
  $('.progress').on('click', function(e) {
    const rect = this.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  });
  
  muteBtn.on('click', function() {
    video.muted = !video.muted;
    updateVolumeIcon();
  });
  
  volumeSlider.on('input', function() {
    video.volume = this.value / 100;
    video.muted = video.volume === 0;
    updateVolumeIcon();
  });
  
  fullscreenBtn.on('click', function() {
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.log(`全屏请求错误: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });
  
  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('volumechange', updateVolumeIcon);
  
  video.addEventListener('loadedmetadata', function() {
    updateTime();
    updateVolumeIcon();
  });
  
  video.addEventListener('ended', function() {
    playIcon.text('↺');
    playBtn.html('<span id="playIcon">↺</span> 重新播放');
  });
}

// 跳动图片功能
let jumpCount = 0;
let todayJumpCount = 0;
const jumpTypes = ['jump-animation', 'bounce-animation', 'shake-animation'];
let currentJumpTypeIndex = 0;

function initJumpCount() {
  const savedJumpCount = localStorage.getItem('jumpCount');
  const savedTodayJumps = localStorage.getItem('todayJumps');
  const savedJumpDate = localStorage.getItem('jumpDate');
  
  const today = new Date().toDateString();
  
  if (savedJumpCount) {
    jumpCount = parseInt(savedJumpCount);
  }
  
  if (savedJumpDate === today && savedTodayJumps) {
    todayJumpCount = parseInt(savedTodayJumps);
  } else {
    todayJumpCount = 0;
    localStorage.setItem('jumpDate', today);
    localStorage.setItem('todayJumps', todayJumpCount);
  }
  
  updateJumpCounters();
}

function updateJumpCounters() {
  $('.jump-counter, #currentJumpCount, #totalJumps, #footerJumpCount, #navJumpCount').text(jumpCount);
  $('#todayJumps').text(todayJumpCount);
  
  localStorage.setItem('jumpCount', jumpCount);
  localStorage.setItem('todayJumps', todayJumpCount);
}

function triggerJumpAnimation() {
  const jumpingImg = $('#jumpingImg');
  if (jumpingImg.length === 0) return;
  
  jumpTypes.forEach(type => jumpingImg.removeClass(type));
  
  const jumpType = jumpTypes[currentJumpTypeIndex];
  jumpingImg.addClass(jumpType);
  
  currentJumpTypeIndex = (currentJumpTypeIndex + 1) % jumpTypes.length;
  
  jumpCount++;
  todayJumpCount++;
  
  updateJumpCounters();
  
  const typeNames = {
    'jump-animation': '跳跃',
    'bounce-animation': '弹跳',
    'shake-animation': '摇晃'
  };
  $('#jumpType').text(typeNames[jumpType]);
  
  setTimeout(() => {
    jumpingImg.removeClass(jumpType);
  }, 1000);
}

// 留言板功能
function initMessageBoard() {
  // 图片预览
  $('#uploadTrigger').on('click', function() {
    $('#imageUpload').click();
  });
  
  $('#imageUpload').on('change', function() {
    const preview = $('#imagePreview');
    preview.empty();
    
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const img = $('<img>').attr('src', e.target.result)
          .css({
            'maxWidth': '150px',
            'maxHeight': '150px',
            'marginRight': '10px',
            'borderRadius': '4px'
          });
        preview.append(img);
      }
      
      reader.readAsDataURL(this.files[0]);
    }
  });
  
  // 表单提交
  $('#messageForm').on('submit', function(e) {
    e.preventDefault();
    
    const name = $('#name').val().trim();
    const message = $('#message').val().trim();
    const contact = $('#contact').val().trim();
    
    if (!name || !message) {
      alert('请填写姓名和留言内容');
      return;
    }
    
    const messageList = $('#messageList');
    const newMessage = $('<div>').addClass('message-item');
    
    const now = new Date();
    const timeStr = now.toLocaleDateString('zh-CN') + ' ' + 
                   now.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'});
    
    const messageContent = `
      <div class="message-header">
        <div class="message-author">${name}</div>
        <div class="message-time">${timeStr}</div>
      </div>
      <div class="message-content">
        留言内容：${message}
      </div>
    `;
    
    newMessage.html(messageContent);
    
    const imagePreview = $('#imagePreview');
    if (imagePreview.children().length > 0) {
      const imageDiv = $('<div>').addClass('image-item');
      imageDiv.html(imagePreview.html());
      newMessage.append(imageDiv);
      
      imagePreview.empty();
      $('#imageUpload').val('');
    }
    
    if (contact) {
      const contactDiv = $('<div>').addClass('message-contact')
        .text(`联系方式：${contact}`);
      newMessage.append(contactDiv);
    }
    
    messageList.prepend(newMessage);
    
    const messageCount = parseInt($('#messageCount').text()) + 1;
    $('#messageCount').text(messageCount);
    $('#totalCount').text(messageCount);
    $('.nav-badge').text(messageCount);
    
    const today = now.toLocaleDateString('zh-CN');
    if (today === '2025/5/7') { 
      const todayNum = parseInt($('#todayCount').text()) + 1;
      $('#todayCount').text(todayNum);
    }
    
    if (imagePreview.children().length > 0) {
      const imageNum = parseInt($('#imageCount').text()) + 1;
      $('#imageCount').text(imageNum);
    }
    
    $(this)[0].reset();
    alert('留言提交成功！');
  });
  
  // 手动跳动按钮
  $('#manualJumpBtn').on('click', function(e) {
    e.preventDefault();
    triggerJumpAnimation();
  });
  
  // 重置跳动计数
  $('#resetJumpBtn').on('click', function() {
    if (confirm('确定要重置跳动计数吗？')) {
      jumpCount = 0;
      todayJumpCount = 0;
      updateJumpCounters();
      alert('跳动计数已重置！');
    }
  });
}

// 页面加载初始化
$(document).ready(function() {
  initSlider();
  initVideoPlayer();
  initJumpCount();
  initMessageBoard();
  
  if (window.location.hash === '#message-board' || $('.page.active').attr('id') === 'message-board') {
    setTimeout(() => {
      triggerJumpAnimation();
    }, 500);
  }
});

// 作品筛选功能
function initWorksFilter() {
  // 获取所有作品
  const $workItems = $('.work-item');
  const $filterBtns = $('.filter-btn');
  const $categoryItems = $('.category-item');
  const $categoryDropdownItems = $('.category-dropdown-item');
  const $noWorksMessage = $('.no-works-message');
  
  // 统计作品数量
  function updateWorksCount() {
    const visibleCount = $('.work-item:not(.hidden)').length;
    const totalCount = $workItems.length;
    
    // 更新作品总数
    $('#worksCount, #totalWorks').text(totalCount);
    
    // 更新分类数量
    const databaseCount = $('.work-item[data-category="database"]').length;
    const analysisCount = $('.work-item[data-category="data-analysis"]').length;
    const frontendCount = $('.work-item[data-category="frontend"]').length;
    const mobileCount = $('.work-item[data-category="mobile"]').length;
    
    $('#databaseCount').text(databaseCount);
    $('#frontendCount').text(frontendCount);
    $('#mobileCount').text(mobileCount);
    
    // 显示/隐藏无作品提示
    if (visibleCount === 0) {
      $noWorksMessage.show();
    } else {
      $noWorksMessage.hide();
    }
  }
  
  // 筛选作品函数
  function filterWorks(category, filterType = 'all') {
    $workItems.each(function() {
      const $item = $(this);
      const itemCategory = $item.data('category');
      const itemDate = new Date($item.data('date'));
      const itemPopularity = parseInt($item.data('popularity'));
      
      let shouldShow = true;
      
      // 按分类筛选
      if (category !== 'all' && itemCategory !== category) {
        shouldShow = false;
      }
      
      // 按筛选类型处理
      if (shouldShow && filterType !== 'all') {
        if (filterType === 'latest') {
          // 最新发布：按日期排序，只显示最近3个月内的作品
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          if (itemDate < threeMonthsAgo) {
            shouldShow = false;
          }
        } else if (filterType === 'popular') {
          // 热门推荐：只显示浏览量超过80的作品
          if (itemPopularity < 80) {
            shouldShow = false;
          }
        }
      }
      
      // 显示/隐藏作品
      if (shouldShow) {
        $item.removeClass('hidden');
        $item.css('animation', 'fadeIn 0.5s ease');
      } else {
        $item.addClass('hidden');
      }
    });
    
    updateWorksCount();
  }
  
  // 排序作品（按日期或热度）
  function sortWorks(sortBy = 'date') {
    const $worksContainer = $('.works-container');
    const $visibleItems = $('.work-item:not(.hidden)');
    
    const sortedItems = $visibleItems.toArray().sort(function(a, b) {
      const $a = $(a);
      const $b = $(b);
      
      if (sortBy === 'date') {
        // 按日期降序（最新在前）
        return new Date($b.data('date')) - new Date($a.data('date'));
      } else if (sortBy === 'popularity') {
        // 按热度降序
        return parseInt($b.data('popularity')) - parseInt($a.data('popularity'));
      }
      return 0;
    });
    
    // 重新排列作品
    sortedItems.forEach(item => {
      $worksContainer.append(item);
    });
  }
  
  // 按钮点击事件 - 筛选按钮
  $filterBtns.on('click', function() {
    const filterType = $(this).data('filter');
    const currentCategory = $('.category-item.active').data('category') || 'all';
    
    // 更新按钮状态
    $filterBtns.removeClass('active');
    $(this).addClass('active');
    
    // 执行筛选
    filterWorks(currentCategory, filterType);
    
    // 根据筛选类型排序
    if (filterType === 'latest') {
      sortWorks('date');
    } else if (filterType === 'popular') {
      sortWorks('popularity');
    }
  });
  
  // 按钮点击事件 - 分类按钮（侧边栏）
  $categoryItems.on('click', function() {
    const category = $(this).data('category');
    const currentFilter = $('.filter-btn.active').data('filter') || 'all';
    
    // 更新分类按钮状态
    $categoryItems.removeClass('active');
    $(this).addClass('active');
    
    // 更新下拉菜单状态
    $categoryDropdownItems.removeClass('active');
    $categoryDropdownItems.filter(`[data-category="${category}"]`).addClass('active');
    
    // 更新下拉按钮文本
    let categoryText = '全部作品';
    if (category === 'database') categoryText = '数据库系统';
    else if (category === 'data-analysis') categoryText = '数据分析';
    else if (category === 'frontend') categoryText = '前端开发';
    else if (category === 'mobile') categoryText = '移动应用';
    
    $('#categoryDropdown').html(`${categoryText} ▼`);
    
    // 执行筛选
    filterWorks(category, currentFilter);
  });
  
  // 按钮点击事件 - 下拉菜单分类
  $categoryDropdownItems.on('click', function(e) {
    e.preventDefault();
    const category = $(this).data('category');
    
    // 更新下拉菜单状态
    $categoryDropdownItems.removeClass('active');
    $(this).addClass('active');
    
    // 更新侧边栏分类状态
    $categoryItems.removeClass('active');
    $categoryItems.filter(`[data-category="${category}"]`).addClass('active');
    
    // 更新下拉按钮文本
    let categoryText = $(this).text();
    $('#categoryDropdown').html(`${categoryText} ▼`);
    
    const currentFilter = $('.filter-btn.active').data('filter') || 'all';
    filterWorks(category, currentFilter);
  });
  
  // 初始化作品统计
  updateWorksCount();
}

// 修改页面加载初始化函数
$(document).ready(function() {
  initSlider();
  initVideoPlayer();
  initJumpCount();
  initMessageBoard();
  initWorksFilter(); // 新增作品筛选功能初始化
  
  if (window.location.hash === '#message-board' || $('.page.active').attr('id') === 'message-board') {
    setTimeout(() => {
      triggerJumpAnimation();
    }, 500);
  }
});
