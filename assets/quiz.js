(function () {
  var QUIZ_DATA = {
    ox: [
      { prompt: '르네상스는 이탈리아에서 시작되었다.', answer: true },
      { prompt: '인상주의 화가들은 주로 화실 안에서만 그림을 그렸다.', answer: false, note: '인상주의는 야외에서 빛을 직접 관찰하며 그리는 플레네르 작업으로 유명합니다.' },
      { prompt: '빈센트 반 고흐는 생전에 상업적으로 크게 성공한 화가였다.', answer: false, note: '반 고흐는 생전에 거의 그림을 팔지 못했고, 사후에 명성을 얻었습니다.' },
      { prompt: '입체주의는 피카소와 브라크가 함께 발전시켰다.', answer: true },
      { prompt: '바로크 미술은 반종교개혁과 밀접한 관련이 있다.', answer: true },
      { prompt: '낭만주의는 이성과 규범을 가장 중요한 가치로 여겼다.', answer: false, note: '이성과 규범을 중시한 것은 신고전주의이며, 낭만주의는 감정과 상상력을 강조했습니다.' },
      { prompt: '카라바조는 강한 명암 대비 기법으로 유명하다.', answer: true },
      { prompt: '로코코는 바로크보다 더 무겁고 웅장한 양식이다.', answer: false, note: '로코코는 바로크보다 가볍고 섬세하며 장식적인 양식입니다.' }
    ],
    mc: [
      { prompt: '모나리자를 그린 화가는?', options: ['미켈란젤로', '라파엘로', '레오나르도 다빈치', '카라바조'], answer: 2 },
      { prompt: '인상주의라는 이름의 유래가 된 작품은?', options: ['수련 연작', '인상, 해돋이', '별이 빛나는 밤', '올랭피아'], answer: 1 },
      { prompt: '다음 중 낭만주의 화가가 아닌 사람은?', options: ['들라크루아', '제리코', '고야', '다비드'], answer: 3, note: '다비드는 신고전주의를 대표하는 화가입니다.' },
      { prompt: "'이삭 줍는 사람들'을 그린 사실주의 화가는?", options: ['쿠르베', '밀레', '마네', '모네'], answer: 1 },
      { prompt: '야수주의를 대표하는 화가는?', options: ['마티스', '세잔', '고갱', '브라크'], answer: 0 },
      { prompt: '다음 중 시대순으로 가장 먼저 등장한 사조는?', options: ['인상주의', '바로크', '낭만주의', '입체주의'], answer: 1 },
      { prompt: "'게르니카'를 그린 화가는?", options: ['브라크', '마티스', '피카소', '드랭'], answer: 2 },
      { prompt: '베르메르의 대표작은?', options: ['진주 귀걸이를 한 소녀', '야경', '만종', '그네'], answer: 0 }
    ],
    picture: [
      { title: '별이 빛나는 밤', desc: '소용돌이치는 밤하늘과 사이프러스 나무가 특징인 이 작품', options: ['고갱', '반 고흐', '세잔', '마티스'], answer: 1 },
      { title: '수련 연작', desc: '지베르니 정원의 연못을 빛의 변화에 따라 반복해 그린 이 작품', options: ['르누아르', '드가', '모네', '쇠라'], answer: 2 },
      { title: '아비뇽의 처녀들', desc: '다섯 인물을 여러 시점에서 동시에 해체해 그린 이 작품', options: ['브라크', '피카소', '드랭', '마티스'], answer: 1 },
      { title: '1808년 5월 3일', desc: '나폴레옹 군대의 학살 장면을 그린 이 작품', options: ['고야', '들라크루아', '제리코', '다비드'], answer: 0 },
      { title: '진주 귀걸이를 한 소녀', desc: '어두운 배경 속 소녀의 얼굴에 집중한 이 작품', options: ['렘브란트', '베르메르', '할스', '루벤스'], answer: 1 },
      { title: '그네', desc: '경쾌한 붓터치로 귀족의 유희를 그린 이 작품', options: ['바토', '부셰', '프라고나르', '다비드'], answer: 2 },
      { title: '생트빅투아르 산 연작', desc: '산의 형태를 기하학적으로 단순화해 그린 이 작품', options: ['반 고흐', '고갱', '세잔', '쇠라'], answer: 2 },
      { title: '아테네 학당', desc: '고대 철학자들을 한 화면에 모은 이 작품', options: ['미켈란젤로', '라파엘로', '레오나르도 다빈치', '도나텔로'], answer: 1 }
    ]
  };

  var QUIZ_LABEL = { ox: 'OX 퀴즈', mc: '객관식 퀴즈', picture: '그림 맞추기' };
  var STORAGE_KEY = 'art-app-quiz-scores';

  var state = { type: 'ox', index: 0, score: 0, answered: false };

  var tabs = document.querySelectorAll('.quiz-tab');
  var progressFill = document.getElementById('quizProgressFill');
  var progressText = document.getElementById('quizProgressText');
  var scoreText = document.getElementById('quizScoreText');
  var questionArea = document.getElementById('quizQuestionArea');
  var nextBtn = document.getElementById('quizNextBtn');
  var skipBtn = document.getElementById('quizSkipBtn');
  var quizCard = document.getElementById('quizCard');
  var resultBox = document.getElementById('quizResult');
  var resultScore = document.getElementById('quizResultScore');
  var resultMsg = document.getElementById('quizResultMsg');
  var resultBest = document.getElementById('quizResultBest');
  var retryBtn = document.getElementById('quizRetryBtn');

  function loadScores() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveScore(type, score, total) {
    var scores = loadScores();
    var prevBest = (scores[type] && scores[type].best) || 0;
    scores[type] = {
      best: Math.max(prevBest, score),
      last: score,
      total: total,
      date: new Date().toISOString().slice(0, 10)
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {}
    return scores[type];
  }

  function currentQuestions() {
    return QUIZ_DATA[state.type];
  }

  function updateProgress() {
    var total = currentQuestions().length;
    var pct = Math.round((state.index / total) * 100);
    progressFill.style.width = pct + '%';
    progressText.textContent = (state.index + 1) + ' / ' + total;
    scoreText.textContent = '점수 ' + state.score;
  }

  function renderQuestion() {
    state.answered = false;
    nextBtn.disabled = true;
    skipBtn.disabled = false;
    updateProgress();
    var q = currentQuestions()[state.index];
    questionArea.innerHTML = '';

    if (state.type === 'ox') {
      questionArea.appendChild(buildPrompt(q.prompt));
      var wrap = document.createElement('div');
      wrap.className = 'ox-options';
      wrap.appendChild(buildOxButton(true));
      wrap.appendChild(buildOxButton(false));
      questionArea.appendChild(wrap);
    } else if (state.type === 'mc') {
      questionArea.appendChild(buildPrompt(q.prompt));
      questionArea.appendChild(buildMcOptions(q.options, q.answer, q.note));
    } else {
      var plate = document.createElement('div');
      plate.className = 'art-plate';
      plate.innerHTML =
        '<div class="art-plate-visual">🖼️</div>' +
        '<div class="art-plate-title">' + q.title + '</div>' +
        '<div class="art-plate-desc">' + q.desc + '</div>';
      questionArea.appendChild(plate);
      questionArea.appendChild(buildPrompt('이 작품을 그린 화가는 누구일까요?'));
      questionArea.appendChild(buildMcOptions(q.options, q.answer, q.note));
    }
  }

  function buildPrompt(text) {
    var p = document.createElement('div');
    p.className = 'q-prompt';
    p.textContent = text;
    return p;
  }

  function buildOxButton(value) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ox-btn ' + (value ? 'ox-btn-o' : 'ox-btn-x');
    btn.textContent = value ? 'O' : 'X';
    btn.addEventListener('click', function () {
      handleAnswer(value === currentQuestions()[state.index].answer, [btn], null);
    });
    return btn;
  }

  function buildMcOptions(options, answerIndex, note) {
    var wrap = document.createElement('div');
    wrap.className = 'mc-options';
    var buttons = [];
    options.forEach(function (label, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mc-btn';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        handleAnswer(i === answerIndex, buttons, { buttons: buttons, correctIndex: answerIndex, note: note });
      });
      buttons.push(btn);
      wrap.appendChild(btn);
    });
    return wrap;
  }

  function handleAnswer(isCorrect, clickedButtons, mcContext) {
    if (state.answered) return;
    state.answered = true;

    if (mcContext) {
      mcContext.buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === mcContext.correctIndex) b.classList.add('correct');
      });
      if (!isCorrect) {
        clickedButtons[0].classList.add('wrong');
      }
      if (mcContext.note) {
        var noteEl = document.createElement('div');
        noteEl.className = 'q-note';
        noteEl.textContent = mcContext.note;
        questionArea.appendChild(noteEl);
      }
    } else {
      var q = currentQuestions()[state.index];
      var oxButtons = questionArea.querySelectorAll('.ox-btn');
      oxButtons.forEach(function (b) {
        b.disabled = true;
        var isO = b.classList.contains('ox-btn-o');
        if (isO === q.answer) b.classList.add('correct');
      });
      if (!isCorrect) clickedButtons[0].classList.add('wrong');
      if (q.note) {
        var noteEl2 = document.createElement('div');
        noteEl2.className = 'q-note';
        noteEl2.textContent = q.note;
        questionArea.appendChild(noteEl2);
      }
    }

    if (isCorrect) state.score++;
    updateProgress();
    nextBtn.disabled = false;
    skipBtn.disabled = true;
  }

  function showResult() {
    var total = currentQuestions().length;
    quizCard.hidden = true;
    resultBox.hidden = false;
    resultScore.textContent = state.score + ' / ' + total;
    var pct = Math.round((state.score / total) * 100);
    var msg;
    if (pct === 100) msg = '완벽해요! 모든 문제를 맞혔습니다.';
    else if (pct >= 70) msg = '훌륭해요! 대부분의 흐름을 잘 이해하고 있어요.';
    else if (pct >= 40) msg = '조금 더 살펴보면 좋을 것 같아요.';
    else msg = '연표와 사조 페이지를 먼저 둘러보는 걸 추천해요.';
    resultMsg.textContent = msg;
    var saved = saveScore(state.type, state.score, total);
    resultBest.textContent = QUIZ_LABEL[state.type] + ' 최고 기록: ' + saved.best + ' / ' + total;
  }

  function startQuiz(type) {
    state.type = type;
    state.index = 0;
    state.score = 0;
    quizCard.hidden = false;
    resultBox.hidden = true;
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.getAttribute('data-quiz') === type);
    });
    renderQuestion();
  }

  nextBtn.addEventListener('click', function () {
    if (state.index + 1 < currentQuestions().length) {
      state.index++;
      renderQuestion();
    } else {
      showResult();
    }
  });

  skipBtn.addEventListener('click', function () {
    if (state.answered) return;
    if (state.index + 1 < currentQuestions().length) {
      state.index++;
      renderQuestion();
    } else {
      showResult();
    }
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      startQuiz(tab.getAttribute('data-quiz'));
    });
  });

  retryBtn.addEventListener('click', function () {
    startQuiz(state.type);
  });

  startQuiz('ox');
})();
