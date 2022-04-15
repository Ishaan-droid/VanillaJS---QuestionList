const QUESTIONS_API = 'https://www.algoexpert.io/api/fe/questions';
const SUBMISSIONS_API = 'https://www.algoexpert.io/api/fe/submissions';

fetchData();

async function fetchData() {
  const allPromises = await Promise.all(
    [QUESTIONS_API, SUBMISSIONS_API].map(async cur => {
      const res = await fetch(cur);
      return res.json();
    })
  );

  const [questions, submissions] = allPromises;

  displayData(questions, submissions);
}

function displayData(questions, submissions) {
  const classStatus = type => {
    switch (type) {
      case 'CORRECT':
        return 'correct';
      case 'INCORRECT':
        return 'incorrect';
      case 'PARTIALLY_CORRECT':
        return 'partially-correct';
      case 'unattempted':
        return 'unattempted';
    }
  };

  const categoryQuestionsHTML = ques =>
    ques
      .map(
        cur => `
    <div class="question" id=${cur.id}>
    <h4 class=${classStatus(cur.status)}>${cur.status}</h4>
    <h4>${cur.name}</h4>
    </div>`
      )
      .join('');

  const categoryHTML = (category, questions) => `<div class="column">
    <h3>${category}</h3>
    ${categoryQuestionsHTML(questions)}
    </div>`;

  const model = modelData(questions, submissions);

  model.map(cur => {
    document.body.insertAdjacentHTML('beforeend', categoryHTML(cur[0], cur[1]));
  });
}

function modelData(data, sub) {
  const submissions = {};

  for (let i = 0; i < sub.length; i++) {
    if (!submissions.hasOwnProperty(sub[i].questionId)) {
      submissions[sub[i].questionId] = sub[i].status;
    } else {
      continue;
    }
  }

  data.forEach(cur => {
    if (submissions.hasOwnProperty(cur.id)) {
      cur.status = submissions[cur.id];
    } else {
      cur.status = 'unattempted';
    }
  });

  const categories = {};

  for (let i = 0; i < data.length; i++) {
    if (!categories.hasOwnProperty(data[i].category)) {
      categories[data[i].category] = [
        {
          name: data[i].name,
          id: data[i].id,
          status: data[i].status,
        },
      ];
    } else {
      categories[data[i].category].push({
        name: data[i].name,
        id: data[i].id,
        status: data[i].status,
      });
    }
  }

  const arrCategories = Object.entries(categories);

  return arrCategories;
}
